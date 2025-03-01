<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class DisableCors
{
    public function handle(Request $request, Closure $next)
    {
        // Если это preflight-запрос (OPTIONS), сразу возвращаем пустой ответ без CORS-заголовков
        if ($request->isMethod('OPTIONS')) {
            return response()->json([], Response::HTTP_NO_CONTENT);
        }

        $response = $next($request);

        // Удаляем заголовки CORS, если они были добавлены
        foreach ([
                     'Access-Control-Allow-Origin',
                     'Access-Control-Allow-Methods',
                     'Access-Control-Allow-Headers',
                     'Access-Control-Allow-Credentials',
                 ] as $header) {
            if ($response->headers->has($header)) {
                $response->headers->remove($header);
            }
        }

        return $response;
    }
}
