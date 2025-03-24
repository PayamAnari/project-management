<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Task;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Events\TaskUpdated;
use Illuminate\Support\Facades\DB;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Task::with(['project', 'user']);
        
        // Filter by project if provided
        if ($request->has('project_id')) {
            $project = Project::findOrFail($request->project_id);
            
            // Check if the authenticated user owns the project
            if ($project->user_id !== auth()->id()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            
            $query->where('project_id', $request->project_id);
        } else {
            // Otherwise, only show tasks from projects owned by the user
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
            'status' => 'required|in:pending,in_progress,completed',
            'priority' => 'numeric',
            'due_date' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check if the authenticated user owns the project
        $project = Project::findOrFail($request->project_id);
        if ($project->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'project_id' => $request->project_id,
            'user_id' => auth()->id(),
            'priority' => $request->priority ?? 0,
            'status' => $request->status,
            'due_date' => $request->due_date,
        ]);

        return response()->json($task, 201);
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

        return response()->json($task->load('project', 'user', 'comments.user'));
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
            'status' => 'required|in:pending,in_progress,completed',
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

};