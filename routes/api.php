<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\CommentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    // Project routes
    Route::apiResource('projects', ProjectController::class);
    
    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::post('tasks/update-priorities', [TaskController::class, 'updatePriorities']);
    
    // Comment routes
    Route::apiResource('comments', CommentController::class);
});

