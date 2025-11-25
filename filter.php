<?php
defined('MOODLE_INTERNAL') || die();

class filter_githubcode extends moodle_text_filter {
    public function filter($text, array $options = []) {
        global $PAGE;

        if (empty($text)) {
            return $text;
        }

        static $resourcesloaded = false;
        if (!$resourcesloaded) {
            $PAGE->requires->js(new moodle_url('/filter/githubcode/js/highlight.min.js'));
            $PAGE->requires->js_init_code('document.addEventListener("DOMContentLoaded", () => { if (window.hljs) hljs.highlightAll(); });');
            $resourcesloaded = true;
        }

        $pattern = '/<a[^>]+href="(https:\/\/raw\.githubusercontent\.com\/[^"]+)"[^>]*>.*?<\/a>/i';

        return preg_replace_callback($pattern, function($matches) {
            $url = trim($matches[1], "\"' \t\n\r");
            $url = str_replace('/refs/heads/', '/', $url);

            // Cache API Moodle
            $cache = cache::make('filter_githubcode', 'githubcode');
            $key = md5($url);

            $data = $cache->get($key);
            if ($data === false || !is_array($data)) {
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                $code = curl_exec($ch);
                $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($code === false || $httpcode !== 200) {
                    return '<div style="color:red">Błąd pobierania z GitHub: ' . htmlspecialchars($url) . ' (HTTP ' . $httpcode . ')</div>';
                }

                $data = [
                    'code' => $code,
                    'time' => time()
                ];
                $cache->set($key, $data);
            }

            $code = $data['code'];
            $age  = time() - $data['time']; 

            $safe = htmlspecialchars($code, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

            $lang = 'plaintext';
            if (preg_match('/\.py$/', $url)) $lang = 'python';
            elseif (preg_match('/\.cpp$/', $url)) $lang = 'cpp';
            elseif (preg_match('/\.js$/', $url)) $lang = 'javascript';
            elseif (preg_match('/\.java$/', $url)) $lang = 'java';
            elseif (preg_match('/\.php$/', $url)) $lang = 'php';

            return "
                <pre><code class=\"language-{$lang}\">{$safe}</code></pre>
                <div style=\"font-size:0.9em;color:#999;margin-top:-10px\">
                    Kod pobrany z repozytorium GitHub (przed {$age} sekundami):
                    <a style=\"color:#999\" href=\"{$url}\" target=\"_blank\">{$url}</a> 
                </div>
            ";
        }, $text);
    }
}