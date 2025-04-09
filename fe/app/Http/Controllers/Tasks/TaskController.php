<?php

namespace App\Http\Controllers\Tasks;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\ExternalApiService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $component = 'tasks/List';
        if ($user->role === User::$ADMIN_ROLE) {
            $component = 'tasks/ListForAdmin';
        }
        return Inertia::render($component, ['status' => $request->session()->get('status'),]);
    }
    
    public function view($id) {
        return Inertia::render('tasks/View', compact(['id']));
    }
    
    public function show($id) {
        return Inertia::render('tasks/Create', compact(['id']));
    }
    
    public function viewSubTask($id) {
        return Inertia::render('tasks/View', compact(['id']));
    }
    
    public function create() {
        return Inertia::render('tasks/Create');
    }
    
    /**
     * @param Request $request
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $externalService = new ExternalApiService();
        $data = $request->all();
        $response = $externalService->post('/tasks', $data);
        if (isset($response['statusCode'])) {
            $total = count($response['message']);
            $convertValidation = [];
            for ($i = 0; $i < $total; $i++) {
                $tmp = $response['message'][$i];
                $tmpConvertMessage = array_map(function ($value) {
                    return __('error.'.$value);
                }, $tmp);
                $convertValidation = array_merge($convertValidation, $tmpConvertMessage);
            }
            
            throw ValidationException::withMessages($convertValidation);
        }
        
        return to_route('tasks.index')->with('status', __('success.task_create_successfully'));
    }
    
    /**
     * @param         $id
     * @param Request $request
     * @throws ValidationException
     */
    public function update($id, Request $request)
    {
        $externalService = new ExternalApiService();
        $data = $request->all();
        $response = $externalService->put('/tasks/' . $id, $data);
        if (isset($response['statusCode'])) {
            $total = count($response['message']);
            $convertValidation = [];
            for ($i = 0; $i < $total; $i++) {
                $tmp = $response['message'][$i];
                $tmpConvertMessage = array_map(function ($value) {
                    return __('error.'.$value);
                }, $tmp);
                $convertValidation = array_merge($convertValidation, $tmpConvertMessage);
            }
            
            throw ValidationException::withMessages($convertValidation);
        }
        
        return to_route('tasks.index')->with('status', __('success.task_update_successfully'));
    }
    
}
