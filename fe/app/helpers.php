<?php
use Illuminate\Support\Facades\Cache;
use App\Models\User;

if (!function_exists('getUserInfo')) {
    function getUserInfo($identifier)
    {
        $user = Cache::get('user_' . $identifier);
        if ($user) {
            return new User($user);
        }
        return $user;
    }
}

if (!function_exists('setUserInfo')) {
    function setUserInfo(User $user): void
    {
        $lifeTime = config('session.lifetime');
        $interval = new DateInterval('P' . $lifeTime . 'M');
        Cache::set('user_' . $user->getAuthIdentifier(), $user->toArray(), $interval);
    }
}
