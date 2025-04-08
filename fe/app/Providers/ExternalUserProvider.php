<?php

namespace App\Providers;

use App\Models\User;
use App\Services\ExternalApiService;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Support\Facades\Log;

class ExternalUserProvider implements UserProvider
{
    public function retrieveById($identifier)
    {
        return getUserInfo($identifier);
    }
    
    public function retrieveByToken($identifier, #[\SensitiveParameter] $token)
    {
        // TODO: Implement retrieveByToken() method.
    }
    
    public function updateRememberToken(Authenticatable $user, #[\SensitiveParameter] $token)
    {
        // TODO: Implement updateRememberToken() method.
    }
    
    public function retrieveByCredentials(#[\SensitiveParameter] array $credentials): ?User
    {
        if (!array_key_exists('email', $credentials) || !array_key_exists('password', $credentials)) {
            return null;
        }
        
        $externalService = new ExternalApiService();
        $response = $externalService->post('/auth/login', $credentials);
        $user = null;
        Log::info('ExternalUserProvider#retrieveByCredentials', ['response' => $response]);
        if (isset($response['user'])) {
            $user = new User($response['user']);
            $user->setRememberToken(null);
            setUserInfo($user);
        }
        
        return $user;
    }
    
    public function validateCredentials(Authenticatable $user, #[\SensitiveParameter] array $credentials): bool
    {
        return true;
    }
    
    public function rehashPasswordIfRequired(
      Authenticatable $user,
      #[\SensitiveParameter] array $credentials,
      bool $force = false
    ) {
        // TODO: Implement rehashPasswordIfRequired() method.
    }
}
