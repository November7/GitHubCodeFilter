<?php
defined('MOODLE_INTERNAL') || die();

function filter_githubcode_page_config($page) {
    $page->requires->js('/filter/githubcode/js/highlight.min.js');
    $page->requires->js_init_code('hljs.highlightAll();');
    $page->requires->css('/filter/githubcode/css/default.min.css');
}