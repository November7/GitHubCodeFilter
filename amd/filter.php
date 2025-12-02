<?php
class filter_codehighlighter extends moodle_text_filter {
    public function filter($text, array $options = array()) {
        global $PAGE;
        global $CFG;
        $PAGE->requires->js_call_amd('filter_codehighlighter/highlight', 'init', array($CFG->wwwroot));
        return $text;
    }
}
?>