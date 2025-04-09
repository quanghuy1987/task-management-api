<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Tasks\TaskController;
use App\Http\Controllers\Api\TaskController as ApiTaskController;
use App\Http\Controllers\Api\UserController as ApiUserController;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');
    
    Route::get('/tasks', [TaskController::class, 'index'])->name('tasks.index');
    Route::get('/tasks/create', [TaskController::class, 'create'])->name('task.create');
    Route::get('/tasks/{id}', [TaskController::class, 'view'])->name('task.detail');
    
    Route::put('/tasks/{id}', [TaskController::class, 'update'])->name('task.put.update');
    Route::get('/tasks/{id}/detail', [TaskController::class, 'show'])->name('task.get.detail.update');
    Route::post('/tasks', [TaskController::class, 'store'])->name('task.post.store');
    
    Route::get('/subtasks/{id}', [TaskController::class, 'viewSubTask'])->name('subtask.detail');
    Route::get('/subtasks/{id}/detail', [TaskController::class, 'show'])->name('subtask.get.detail.update');
    Route::put('/subtasks/{id}', [TaskController::class, 'updateSubTask'])->name('subtask.put.update');
    
    Route::get('/api/tasks', [ApiTaskController::class, 'index'])->name('api.task.index');
    Route::get('/api/tasks/{id}', [ApiTaskController::class, 'detail'])->name('api.task.detail');
    Route::get('/tasks/{id}/subtasks', [ApiTaskController::class, 'getAllSubtasks'])->name('api.task.get.subTasks');
    Route::get('/api/users', [ApiUserController::class, 'index'])->name('api.user.index');
    
});
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
