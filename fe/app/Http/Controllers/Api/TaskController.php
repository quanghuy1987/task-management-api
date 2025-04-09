<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ExternalApiService;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends Controller
{
    public function index() {
        $externalService = new ExternalApiService();
        
        $response = $externalService->get('/tasks');
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
            return new JsonResponse($convertValidation, $response['statusCode']);
        }
        
        return new JsonResponse($response, Response::HTTP_OK);
    }
    
    public function detail($id) {
        $externalService = new ExternalApiService();
        
        $response = $externalService->get('/tasks/'. $id);
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
            return new JsonResponse($convertValidation, $response['statusCode']);
        }
        
        return new JsonResponse($response, Response::HTTP_OK);
    }
    
    public function getAllSubtasks($id) {
        $externalService = new ExternalApiService();
        
        $response = $externalService->get('/tasks/'. $id . '/subtasks');
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
            return new JsonResponse($convertValidation, $response['statusCode']);
        }
        
        return new JsonResponse($response, Response::HTTP_OK);
    }
}
