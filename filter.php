<?php
defined('MOODLE_INTERNAL') || die();

class filter_githubcode extends moodle_text_filter {
    public function filter($text, array $options = []) {
        global $PAGE;

        if (empty($text)) {
            return $text;
        }

        $PAGE->requires->js_call_amd('filter_githubcode/syntaxhighlighter', 'init', array($CFG->wwwroot));

        $pattern = '/\{githubcode\s+([^}]+)\}/i';

        return preg_replace_callback($pattern, function($matches) {
            $inside = $matches[1];
            $tokens = preg_split('/\s+/', $inside);

            $params = [];
            foreach ($tokens as $t) {
                if (strpos($t, '=') !== false) {
                    [$k, $v] = explode('=', $t, 2);
                    $params[strtolower($k)] = trim($v, "\"'");
                } else {
                    $params[strtolower($t)] = true; // flaga
                }
            }

            if (empty($params['href'])) {
                return "<div style='color:red'>Missing href in githubcode tag</div>";
            }

            $url = $params['href'] ?? '';

            if (preg_match('/href\s*=\s*(["\'])(.*?)\1/i', $url, $m)) {
                $url = $m[2];
            }

            $url = preg_replace('/">.*$/', '', $url);
            $url = trim($url, " \t\n\r\"'");
            $url = str_replace('/refs/heads/', '/', $url);
            if (!preg_match('#^https?://#i', $url)) {
                $url = 'https://' . ltrim($url, '/');
            }

            // Cache API Moodle
            $cache = cache::make('filter_githubcode', 'githubcode');
            $key = md5($url);

            $cached = $cache->get($key);
            if ($cached === false || !is_array($cached)) {
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
                $code = curl_exec($ch);
                $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($code === false || $httpcode !== 200) {
                    $safeUrl = htmlspecialchars($url);
                    return "<div style='color:red'>Failed to retrieve from GitHub: {$safeUrl} HTTP {$httpcode}</div>";
                }

                $cached = [
                    'code' => $code,
                    'time' => time()
                ];
                $cache->set($key, $cached);
            }

            $code = $cached['code'];
            $age  = time() - $cached['time'];

            $safe = htmlspecialchars($code, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

            // Rozpoznanie języka po rozszerzeniu
            $lang = 'plaintext';
            $map = [
                'py'   => 'python',
                'c'    => 'c',
                'cpp'  => 'cpp',
                'cs'   => 'cs',
                'js'   => 'javascript',
                // 'java' => 'java',
                // 'html' => 'html',
                // 'htm'  => 'html',
                // 'php'  => 'php',
                // 'pas'  => 'pascal'
            ];
            if (preg_match('/\.([^.]+)$/i', $url, $m)) {
                $ext = strtolower($m[1]);
                if (isset($map[$ext])) $lang = $map[$ext];
            }

            $linenumbers = !empty($params['linenumbers']) && $params['linenumbers'] != '0';
            $theme = !empty($params['theme']) ? $params['theme'] : 'blue';

            $title = !empty($params['title']) ? htmlspecialchars($params['title']) : '';

            $theme = in_array($params['theme'], ['dark','light', 'blue']) ? $theme : 'light';

            return "
            <code class='githubcode'
                data-theme='{$theme}' 
                data-lang='{$lang}' 
                data-linenumbers='{$linenumbers}' 
                data-title='{$title}' 
                data-age='{$age}' 
                data-href='{$url}'>{$safe}
            </code>
            ";
        }, $text);
    }
}
?>