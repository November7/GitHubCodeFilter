<?php
defined('MOODLE_INTERNAL') || die();
/*********************************************************************************************************
 * GitHub Code Filter for Moodle
 * Copyright:  Copyright (c) 2026 Marcin Kowalski
 * License:    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 * @package    filter_githubcode
*********************************************************************************************************/

class filter_githubcode extends moodle_text_filter 
{

    public function filter($text, array $options = []) 
    {
        global $PAGE, $CFG;

        if (empty($text)) 
        {
            return $text;
        }

        // call js engine for syntax highlighting
        $PAGE->requires->js_call_amd('filter_githubcode/syntaxhighlighter', 'init', array($CFG->wwwroot));

        // Hotfix: remove auto-inserted <p> and <br> around rawcode/githubblock
        // for testing purposes only – may be removed later
        // issue: removed all paragraphs, breaking layout!!!!!!!
        // need to be fixed properly later
        // $text = preg_replace('/<p>\s*(\{rawcode\b\s*\})\s*<\/p>/i', '$1', $text);
        // $text = preg_replace('/<p>\s*(\{\/rawcode\})\s*<\/p>/i', '$1', $text);
        // $text = preg_replace('/<p>\s*(\{githubblock\b)/i', '$1', $text);
        // $text = preg_replace('/(\{\/githubblock\})\s*<\/p>/i', '$1', $text);        
        // $text = preg_replace('/<\/p>\s*<p>/i', "\n", $text); // ????????
        // end hotfix

        // option #1 {githubblock params}fallback{/githubblock}
        $pattern_github_block = '/\{githubblock([^}]*)\}(.*?)\{\/githubblock\}/is';
        $text = preg_replace_callback($pattern_github_block, function($matches) {
            $inside   = trim($matches[1]); // params
            $fallback = $matches[2];       // fallback

            $params = $this->parse_params($inside);

            // href is required
            if (empty($params['href'])) {
                // if no href, but there is fallback – we can treat fallback as code. ????
                if (trim($fallback) !== '') {
                    return $this->render_rawcode_from_content($params, $fallback);
                }
                return "<div style='color:red'>Missing href in githubcode tag</div>";
            }

            return $this->render_githubcode($params, $fallback);
        }, $text);

        // option #2 {rawcode params}kod{/rawcode}
        $pattern_raw = '/\{rawcode([^}]*)\}(.*?)\{\/rawcode\}/is';
        $text = preg_replace_callback($pattern_raw, function($matches) {
            $inside = trim($matches[1]);
            $code   = $matches[2];

            // Cleanup of $code: (br, p, nbsp, leading/trailing spaces, etc.)
            $code = preg_replace('/<br\s*\/?>/i', "\n", $code);
            $code = preg_replace('/^<p>(.*?)$/m', '$1', $code);
            $code = preg_replace('/^(.*?)<\/p>\s*$/m', '$1', $code);
            $code = html_entity_decode($code, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $code = trim($code, "\n\r ");
            $params = $this->parse_params($inside);
            return $this->render_rawcode_from_content($params, $code);
        }, $text);

        // option #3 {githubcode params}
        $pattern_single = '/\{githubcode\s+([^}]+)\}/i';
        $text = preg_replace_callback($pattern_single, function($matches) {
            $inside = $matches[1];
            $params = $this->parse_params($inside);

            if (empty($params['href'])) 
            {
                return "<div style='color:red'>Missing href in githubcode tag</div>";
            }

            return $this->render_githubcode($params, null);
        }, $text);

        return $text;
    }

    /**
     * Proste parsowanie parametrów w stylu: key=value, flagi bez '=' → true.
     * Działa jak dotąd – kompatybilnie z Twoim kodem.
     */
    protected function parse_params(string $inside): array 
    {
        $tokens = preg_split('/\s+/', $inside, -1, PREG_SPLIT_NO_EMPTY);

        $params = [];
        foreach ($tokens as $t) 
        {
            if (strpos($t, '=') !== false) 
            {
                [$k, $v] = explode('=', $t, 2);
                $params[strtolower($k)] = trim($v, "\"'");
            } 
            else 
            {
                $params[strtolower($t)] = true; // flaga
            }
        }
        return $params;
    }

    /**
     * Wspólne renderowanie githubcode – używane przez:
     *  - stary {githubcode ...}
     *  - nowy blokowy {githubcode ...}fallback{/githubcode}
     *
     * Jeśli $fallback !== null i pobranie z GitHuba się nie powiedzie,
     * używany jest fallback zamiast czerwonego błędu.
     */
    protected function render_githubcode(array $params, ?string $fallback) 
    {
        $url = $params['href'] ?? '';

        // Obsługa ewentualnego wklejenia całego href="..." z edytora.
        if (preg_match('/href\s*=\s*(["\'])(.*?)\1/i', $url, $m)) 
        {
            $url = $m[2];
        }

        $url = preg_replace('/">.*$/', '', $url);
        $url = trim($url, " \t\n\r\"'");
        $url = str_replace('/refs/heads/', '/', $url);
        if (!preg_match('#^https?://#i', $url)) 
        {
            $url = 'https://' . ltrim($url, '/');
        }

        // Cache API Moodle
        $cache = cache::make('filter_githubcode', 'githubcode');
        $key   = md5($url);

        $cached = $cache->get($key);

        if ($cached === false || !is_array($cached)) 
        {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            $code     = curl_exec($ch);
            $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($code === false || $httpcode !== 200)
            {
                // Jeśli mamy fallback (tryb blokowy), użyj fallback zamiast błędu.
                if ($fallback !== null && trim($fallback) !== '') 
                {
                    $code = $fallback;
                    $age  = 0;
                    return $this->render_code_common($code, $params, $age, '');
                }

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

        return $this->render_code_common($code, $params, $age, $url);
    }

    /**
     * Renderowanie RAW kodu z zawartości bloku {rawcode ...}kod{/rawcode}.
     */
    protected function render_rawcode_from_content(array $params, string $code) 
    {
        $age = 0;
        $url = ''; // lokalny kod – brak URL
        return $this->render_code_common($code, $params, $age, $url);
    }


    protected function render_code_common(string $code, array $params, int $age, string $url) 
    {
        $safe = htmlspecialchars($code, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

        // Rozpoznanie języka po rozszerzeniu lub parametrze lang.
        $lang = 'plaintext';
        if (!empty($params['lang'])) 
        {
            $lang = $params['lang'];
        }
        else if (!empty($url) && preg_match('/\.([^.]+)$/i', $url, $m)) 
        {
            $ext = strtolower($m[1]);
            $map = [
                'py'   => 'python',
                'c'    => 'c',
                'cpp'  => 'cpp',
                'cs'   => 'cs',
                'js'   => 'javascript',
                'java' => 'java',
                'html' => 'javascript',
                'htm'  => 'javascript',
                'php'  => 'php',
                'pas'  => 'pascal'
            ];
            if (isset($map[$ext])) 
            {
                $lang = $map[$ext];
            }
        }

        $defaulttheme = get_config('filter_githubcode', 'theme');
        $theme = !empty($params['theme']) ? $params['theme'] : $defaulttheme;
        $theme = in_array($theme, ['dark', 'light', 'blue']) ? $theme : 'blue';

        $defaultlinenumbers = get_config('filter_githubcode', 'linenumbers');
        if (isset($params['linenumbers'])) 
        {
            $linenumbers = ($params['linenumbers'] !== 'off' && $params['linenumbers'] !== '0');
        } 
        else 
        {
            $linenumbers = !empty($defaultlinenumbers) && $defaultlinenumbers != '0';
        }

        $title = !empty($params['title']) ? htmlspecialchars($params['title']) : '';

        $defaultzebrastyle = get_config('filter_githubcode', 'zebrastyle');
        if (isset($params['zebrastyle'])) 
        {
            $zebrastyle = ($params['zebrastyle'] !== 'off' && $params['zebrastyle'] !== '0');
        } 
        else 
        {
            $zebrastyle = !empty($defaultzebrastyle) && $defaultzebrastyle != '0';
        }

        return "
        <code class='githubcode'
            data-theme='{$theme}'
            data-lang='{$lang}'
            data-linenumbers='" . ($linenumbers ? '1' : '0') . "'
            data-zebrastyle='" . ($zebrastyle ? '1' : '0') . "'
            data-title='{$title}'
            data-age='{$age}'
            data-href='{$url}'>{$safe}
        </code>
        ";
    }
}
?>