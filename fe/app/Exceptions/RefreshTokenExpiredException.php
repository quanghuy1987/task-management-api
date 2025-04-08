<?php
namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
class RefreshTokenExpiredException extends Exception
{
    
    public function render(Request $request): JsonResponse
    {
        return new JsonResponse([
          'message' => 'refresh_token_expired'
        ], Response::HTTP_UNAUTHORIZED);
    }
}
