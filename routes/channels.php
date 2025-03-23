<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Project;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
*/

Broadcast::channel('project.{projectId}', function ($user, $projectId) {
    $project = Project::findOrFail($projectId);
    return $user->id === $project->user_id;
});