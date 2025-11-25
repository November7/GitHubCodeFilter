<?php
defined('MOODLE_INTERNAL') || die();

$definitions = [
    'githubcode' => [
        'mode' => cache_store::MODE_APPLICATION,
        'simplekeys' => true,
        'simpledata' => true,
        'ttl' => 120 // czas życia cache w sekundach (1h)
    ]
];
