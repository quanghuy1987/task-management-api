<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Services\ExternalApiService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/Register');
    }
    
    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
//        $request->validate([
//          'name'     => 'required|string|max:255',
//          'email'    => 'required|string|lowercase|email|max:255',
//          'password' => ['required', 'confirmed'],
//        ]);
        
        $externalService = new ExternalApiService();
        $postData = [
          'name'     => $request->name,
          'email'    => $request->email,
          'password' => $request->password,
        ];
        
        $response = $externalService->post('/auth/register', $postData);
        if (isset($response['statusCode'])) {
            $total = count($response['message']);
            $convertValidation = [];
            for ($i = 0; $i < $total; $i++) {
                $tmp = $response['message'][$i];
                $tmpConvertMessage = array_map(function ($value) {
                    return __('error.'.$value);
                }, $tmp);
                $convertValidation = array_merge($tmpConvertMessage);
            }
            
            throw ValidationException::withMessages($convertValidation);
        }
        
        return to_route('login')->with('status', __('auth.send_verify_email'));
    }
}
