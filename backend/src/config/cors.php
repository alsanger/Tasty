<?php

return [
    'paths' => ['api/*'], // Разрешить CORS для API
    'allowed_methods' => ['*'], // Разрешить все методы (GET, POST, PUT, DELETE)
    'allowed_origins' => ['*'], // Разрешить запросы с любого источника
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Разрешить любые заголовки
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false, // Если авторизация через cookies, поставить true
];
