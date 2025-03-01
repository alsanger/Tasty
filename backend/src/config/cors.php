<?php

return [
    'paths' => ['*'], // Добавьте '*', чтобы разрешить все пути
    'allowed_methods' => ['*'], // Все методы разрешены
    'allowed_origins' => ['*'], // Все источники разрешены
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'], // Все заголовки разрешены
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => false,
];
