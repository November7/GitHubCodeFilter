<?php
defined('MOODLE_INTERNAL') || die();

// $plugin->filtertype = 1;
$plugin->version   = 2026010501;   // Data w formacie YYYYMMDDXX
$plugin->requires  = 2022041900;   // Minimalna wersja Moodle
$plugin->release   = "1.0.15 (Build: {$plugin->version})";
$plugin->component = 'filter_githubcode';
$plugin->name = 'GitHub Code Filter';