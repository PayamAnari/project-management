<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProjectController;
use App\Http\Controllers\API\TaskController;
use App\Http\Controllers\API\CommentController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/


// routes/api.php
Route::middleware('api')->post('/register', [RegisteredUserController::class, 'store']);
Route::middleware('api')->post('/login', [AuthenticatedSessionController::class, 'store']);
Route::middleware('auth:sanctum')->post('/logout', [AuthenticatedSessionController::class, 'destroy']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/users', function() {
        return \App\Models\User::select('id', 'name')->get();
    });

    // Project routes
    Route::apiResource('projects', ProjectController::class);
    
    // Task routes
    Route::apiResource('tasks', TaskController::class);
    Route::post('tasks/{task}/attachments', [TaskController::class, 'addAttachment']);
    Route::delete('tasks/{task}/attachments/{attachment}', [TaskController::class, 'deleteAttachment']);
    Route::post('tasks/update-priorities', [TaskController::class, 'updatePriorities']);
    Route::get('/attachments/{attachment}/download', [TaskController::class, 'downloadAttachment']);
    
    
    // Comment routes
    Route::apiResource('comments', CommentController::class);
});

