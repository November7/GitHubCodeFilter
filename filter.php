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

        $pattern = '/\{?(https:\/\/raw\.githubusercontent\.com\/[^}|]+)\|?([^}]*)\}?/i';

        return preg_replace_callback($pattern, function($matches) {
            $url = trim($matches[1], "\"' \t\n\r");
            $url = str_replace('/refs/heads/', '/', $url);

            $params = [];
            if (!empty($matches[2])) {
                $rawParams = explode(';', $matches[2]);
                foreach ($rawParams as $param) {
                    list($key, $value) = explode('=', $param, 2);
                    $params[trim($key)] = trim($value);
                }
            }

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
            $map = [
                'py'   => 'python',
                'c'    => 'c',
                'cpp'  => 'cpp',
                'cs'   => 'csharp',
                'js'   => 'javascript',
                'java' => 'java',
                'html' => 'html',
                'htm'  => 'html',
                'php'  => 'php',
                'pas'  => 'pascal'
            ];

            if (preg_match('/\.([^.]+)$/i', $url, $m)) {
                $ext = strtolower($m[1]);
                if (isset($map[$ext])) $lang = $map[$ext];
            }

            $lines = explode("\n", $safe);
            $numbers = '';
            $i = 1;
            foreach ($lines as $line) {
                $numbers .= "{$i}\n";
                $i++;
            }           

            return "
            <div class=\"githubcode-header\">GithubCode Filter</div>
            <div class=\"githubcode-wrapper\">
                <pre class=\"line-numbers\"><code>{$numbers}</code></pre>
                <pre><code class=\"language-{$lang}\">{$safe}</code></pre>
            </div>
            <div class=\"githubcode-footer\">
                Code fetched {$age} seconds ago from the GitHub repository:
                <a href=\"{$url}\" target=\"_blank\">github.com...</a>
            </div>
            ";
        }, $text);
    }
}