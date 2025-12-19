<?php
defined('MOODLE_INTERNAL') || die();

$settings->add(new admin_setting_configselect(
    'filter_githubcode/theme',
    get_string('theme', 'filter_githubcode'),
    '',
    'dark',
    array(
        'dark' => 'Dark',
        'light' => 'Light',
        'blue' => 'Blue'
    )
));

$settings->add(new admin_setting_configcheckbox(
    'filter_githubcode/linenumbers', 
    get_string('linenumbers', 'filter_githubcode'), 
    '', 
    1
));

$settings->add(new admin_setting_configcheckbox(
    'filter_githubcode/zebrastyle', 
    get_string('zebrastyle', 'filter_githubcode'), 
    '', 
    1
));