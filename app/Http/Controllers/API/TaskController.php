<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\TaskUpdated;
use Illuminate\Support\Facades\DB;
use App\Models\TaskAttachment;
use Illuminate\Support\Facades\Storage;


class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::with(['project', 'user', 'attachments']);

        if ($request->has('project_id')) {
            $project = Project::findOrFail($request->project_id);
            if ($project->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            $query->where('project_id', $request->project_id);
        } else {
            $query->whereHas('project', function ($q) {
                $q->where('user_id', auth()->id());
            });
        }

        $tasks = $query->orderBy('priority', 'asc')->get();

        return response()->json($tasks);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|in:to_do,in_progress,under_review,completed',
            'priority' => 'numeric',
            'due_date' => 'nullable|date',
            'user_id' => 'required|exists:users,id',
            'attachments' => 'nullable|array',
            'attachments.*' => 'file|max:10240'
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the authenticated user owns the project
        $project = Project::findOrFail($request->project_id);
        if ($project->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();

        try {
        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'project_id' => $request->project_id,
            'user_id' => $request->user_id,
            'priority' => $request->priority ?? 0,
            'status' => $request->status,
            'due_date' => $request->due_date,
        ]);

         // Handle file attachments
         if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $path = $file->store('task_attachments');

                $task->attachments()->create([
                    'file_path' => $path,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size' => $file->getSize()
                ]);
            }
        }

        DB::commit();
        return response()->json($task->load('project', 'user', 'attachments'), 201);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Task creation failed'], 500);
    }
}

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        // Check if the authenticated user owns the project that the task belongs to
        if ($task->project->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($task->load('project', 'user', 'comments.user', 'attachments'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Task $task)
    {
        // Check if the authenticated user owns the project that the task belongs to
        if ($task->project->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'project_id' => 'required|exists:projects,id',
            'status' => 'required|in:to_do,in_progress,under_review,completed',
            'priority' => 'numeric',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the user is trying to move the task to a different project
        if ($request->project_id != $task->project_id) {
            $newProject = Project::findOrFail($request->project_id);
            if ($newProject->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $task->update($request->all());

        // Broadcast the task update event
        event(new TaskUpdated($task, 'update'));

        return response()->json($task);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        // Check if the authenticated user owns the project that the task belongs to
        if ($task->project->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(null, 204);
    }

    /**
     * Update task priorities
     */
    public function updatePriorities(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'tasks' => 'required|array',
            'tasks.*.id' => 'required|exists:tasks,id',
            'tasks.*.priority' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        try {
            DB::beginTransaction();

            $updatedTasks = [];
            foreach ($request->tasks as $taskData) {
                $task = Task::findOrFail($taskData['id']);

                if ($task->project->user_id !== auth()->id()) {
                    DB::rollBack();
                    return response()->json(['message' => 'Unauthorized'], 403);
                }

                $task->priority = $taskData['priority'];
                $task->save();
                $updatedTasks[] = $task;
            }

            DB::commit();

            foreach ($updatedTasks as $task) {
                event(new TaskUpdated($task, 'priority'));
            }

            return response()->json(['message' => 'Task priorities updated successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Update failed'], 500);
        }
    }


    public function addAttachment(Request $request, Task $task)
{
    if ($task->project->user_id !== auth()->id()) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $request->validate([
        'file' => 'required|file|max:10240' // 10MB max
    ]);

    $file = $request->file('file');
    $path = $file->store('task_attachments');

    $attachment = $task->attachments()->create([
        'file_path' => $path,
        'original_name' => $file->getClientOriginalName(),
        'mime_type' => $file->getClientMimeType(),
        'size' => $file->getSize()
    ]);

    return response()->json($attachment, 201);
}

public function deleteAttachment(Task $task, TaskAttachment $attachment)
{
    if ($task->project->user_id !== auth()->id() || $attachment->task_id !== $task->id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    Storage::delete($attachment->file_path);
    $attachment->delete();

    return response()->json([
        'message' => 'Attachment deleted successfully',
        'deleted_attachment_id' => $attachment->id
    ]);}

public function downloadAttachment(TaskAttachment $attachment)
{
    if ($attachment->task->project->user_id !== auth()->id()) {
        abort(403, 'Unauthorized');
    }

    $path = $attachment->file_path;
    $fullPath = Storage::disk('local')->path($path);

    if (Storage::disk('local')->exists($path)) {
        return response()->download(
            $fullPath,
            $attachment->original_name,
            ['Content-Type' => $attachment->mime_type]
        );
    }

    abort(404, 'File not found');
}


};
