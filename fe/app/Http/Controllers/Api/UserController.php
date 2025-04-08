<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExternalApiService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response as ResponseAlias;

class UserController extends Controller
{
    public function index() {
        $externalService = new ExternalApiService();
        
        $response = $externalService->get('/auth/users');
        return new JsonResponse($response, ResponseAlias::HTTP_OK);
    }
    
}
