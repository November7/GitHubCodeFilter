<?php
defined('MOODLE_INTERNAL') || die();

$settings->add(new admin_setting_configtext(
    'filter_githubcode/language',
    get_string('language', 'filter_githubcode'),
    'Default language for highlight.js (for example: cpp, python, javascript)',
    'cpp'
));