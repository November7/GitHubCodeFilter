<?php
defined('MOODLE_INTERNAL') || die();



function filter_githubcode_page_config($page) {
    $page->requires->js_init_code('console.log("filter_githubcode_page_config działa!");');

    $page->requires->js(new moodle_url('/filter/githubcode/js/highlight.min.js'));
    $page->requires->css(new moodle_url('/filter/githubcode/css/default.min.css'));
    $page->requires->js_init_code('hljs.highlightAll();');
}