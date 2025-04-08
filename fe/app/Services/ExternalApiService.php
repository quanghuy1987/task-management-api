<?php

namespace App\Services;

use App\Exceptions\RefreshTokenExpiredException;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Contracts\Auth\Authenticatable as UserContract;
use Illuminate\Support\Facades\Auth;
use League\Uri\Contracts\UserInfoInterface;
use Symfony\Component\HttpFoundation\Response;

class ExternalApiService
{
    private $httpClient;
    private $config = [];
    private $userInfo;
    
    const METHOD_GET = 'GET';
    const METHOD_POST = 'POST';
    const METHOD_PUT = 'PUT';
    const METHOD_DELETE = 'DELETE';
    
    private $isRefreshToken = false;
    
    public function __construct()
    {
        $this->httpClient = new Client([
          'base_uri' => config('services.externalApi.base_uri'),
          'synchronous' => true
        ]);
    }
    
    public function setHeaders(array $headers): void
    {
        $this->config['headers'] = $headers;
    }
    
    public function setUserInfo(UserContract $user ): void
    {
        $this->userInfo = $user;
    }
    
    public function get($uri, $query = [])
    {
        return $this->request(self::METHOD_GET, $uri, ['query' => $query]);
    }
    
    public function post($uri, $data = [], $isJson = true)
    {
        if ($isJson) {
            return $this->request(self::METHOD_POST, $uri, ['json' => $data]);
        } else {
            return $this->request(self::METHOD_POST, $uri, ['form_params' => $data]);
        }
    }
    
    public function delete($uri)
    {
        return $this->request(self::METHOD_DELETE, $uri, []);
    }
    
    public function put($uri, $data = [])
    {
        return $this->request(self::METHOD_PUT, $uri, ['json' => $data]);
    }
    
    private function request($method, $uri, $config)
    {
        $config = array_merge($this->config, $config);
        $userInfo = $this->userInfo ?? Auth::user();
        if (!is_null($userInfo)) {
            $bearTokenHeader = ['Authorization' => 'Bearer ' . $userInfo->accessToken];
            $config['headers'] = isset($config['headers']) ? array_merge($config['headers'], $bearTokenHeader ) : $bearTokenHeader;
        }
        
        try {
            $response = $this->httpClient->request($method, $uri, $config);
            if (!empty($response->getBody()->__toString())) {
                $contents = json_decode($response->getBody()->__toString(), true);
            } else {
                $contents = json_decode($response->getBody(), true);
            }
            return $contents;
        } catch (ClientException $ex) {
            $response = $ex->getResponse();
            $statusCode = $response->getStatusCode();
            $responseBodyAsString = json_decode($response->getBody()->__toString(), true);
            if ($statusCode === Response::HTTP_UNAUTHORIZED && !$this->isRefreshToken) {
                $this->getAccessToken();
                return $this->request($method, $uri, $config);
            }
            $responseBodyAsString['statusCode'] = $statusCode;
            return $responseBodyAsString;
        }
    }
    
    /**
     * @throws RefreshTokenExpiredException
     */
    private function getAccessToken() {
        $userInfo = $this->userInfo ?? Auth::user();
        $refreshToken = $userInfo->refreshToken;
        $this->isRefreshToken = true;
        $this->config['headers'] = [
          'X-Refresh-Token' => $refreshToken
        ];
        $response =  $this->request(self::METHOD_GET, 'refresh-token', []);
        if (isset($response['statusCode'])) {
            throw new RefreshTokenExpiredException();
        }
        $userInfo->accessToken = $response['accessToken'];
        setUserInfo($userInfo);
    }
}
