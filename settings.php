<?php
defined('MOODLE_INTERNAL') || die();

// $settings->add(new admin_setting_configtext(
//     'filter_githubcode/language',
//     get_string('language', 'filter_githubcode'),
//     'Default language for syntaxhighlighter.js (for example: cpp, python, javascript)',
//     'cpp'
// ));

$settings->add(new admin_setting_configselect(
    'filter_githubcode/theme',
    get_string('theme', 'filter_githubcode'),
    'Default theme (dark, light, blue)',
    'dark',
    array(
        'dark' => 'Dark',
        'light' => 'Light',
        'blue' => 'Blue'
    )
));


// $settings->add(new admin_setting_configcheckbox(
//     'filter_githubcode/linenumbers', 
//     get_string('linenumbers', 'filter_githubcode'), 
//     'Enable line numbers', 
//     1
// ));