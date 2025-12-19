// AMD module for syntax highlighter
// ver: 4.0 [2025.12.06] moving to new repo
// ver: 4.1 [2025.12.08] stable release (version 1.0.0) ->
// ver: 1.0.0 [2025.12.08] change versioning scheme (compatible with plugin versioning)

define(['jquery'], function($) {
    /**
    * Escapuje znaki specjalne HTML.
    * @param {string} raw - surowy kod
    * @returns {string} - kod z encjami (&lt;, &gt;, &amp;)
    */
    function escape(raw) {
        return $("<div>").text(raw).html();
    }

    /**
    * Code & params extractor
    * @param {jQuery} $block - jQuery object containing the code block
    * @returns {Object} - Extracted code and parameters
    */
    function extract($block) {
        let code = $block.first();
        if(code.length === 0) {
            return null;
        }

        let attrs = {};
        $.each(code.prop("attributes"), function() {
            if (this.name !== "class") {
                attrs[this.name] = this.value;
            }
        });
        return {
            code: code.text(),
            classes: code.attr("class") || "",
            attrs: attrs
        };
    }

    /**
    * Podmienia zawartość <pre> na finalny <code>:
    * @param {Object} code - kod do sparsowania
    * @param {Object} classes - klasy do dodania do elementu code
    * @param {Object} attrs - atrybuty do dodania w nagłówku i stopce
    * @returns {string} newCode - sparsowany kod
    */
    function final(code, classes, attrs) {
        let container = $("<div>")
            .addClass("githubcode-container")
            .addClass(attrs['data-theme'] ? "githubcode-" + attrs['data-theme'] : "light")
            .toggleClass("lines-off", attrs['data-linenumbers'] == 0)
            .toggleClass("zebra-on", attrs['data-zebrastyle'] == 1);

        let header = $("<div>")
            .addClass("githubcode-header")            
            .append(
                $("<span>")
                    .addClass("language")
                    .text(attrs['data-lang'] || "Plain Text")
                )
            .append(
                $("<span>")
                    .addClass("title")
                    .text(attrs['data-title'] || "")
                )
            .append(
                $("<span>")
                .addClass("github-link")
                .attr("title", "GithubCodeFilter on GitHub")
                .html(
                    $("<a>")
                        .attr("href", 'https://github.com/November7/GitHubCodeFilter' || "#")
                        .attr("target", "_blank")
                        .attr("rel", "noopener noreferrer")
                        .append($("<i>").addClass("fab fa-github"))
                    )
                );

        let codeBlock = $("<pre>").append(
            $("<code>")
                .attr("class", classes)
                .html(code)
        );

        let footer = $("<div>")
            .addClass("githubcode-footer")
            .append(
                $("<span>")
                    .addClass("zebra-toggle")
                    .attr("title", "Toggle zebra-style")
                    .on("click", function() {
                        $(this).closest(".githubcode-container").toggleClass("zebra-on");
                    })
                    .append($("<i>").addClass("fa-solid fa-grip-lines"))                    
            )
            .append(
                $("<span>")
                    .addClass("lines-toggle")
                    .attr("title", "Toggle line numbers")
                    .on("click", function() {
                        $(this).closest(".githubcode-container").toggleClass("lines-off");
                    })
                    .append($("<i>").addClass("fa-solid fa-1"))
            )
            .append(
                $("<span>")
                    .addClass("cache-icon")
                    .attr("title", "Code fetched from github.com " + attrs['data-age'] + " seconds ago")
                    .append(
                        $("<i>").addClass("fa-regular fa-clock")
                    )
                    .on("click", function() {
                        let $icon = $(this);
                        let text = $icon.attr("title");
                        let $label = $icon.find(".cache-label");
                        if ($label.length) {
                            $label.remove();
                        } else {
                            $icon.append(
                                $("<span>")
                                    .addClass("cache-label")
                                    .css({"margin-left":"6px"})
                                    .text(text)
                            );
                        }
                    })
            )
            .append(
                $("<span>")
                    .addClass("source-link")
                    .html(
                        $("<a>")
                            .attr("href", attrs['data-href'] || "#")
                            .attr("target", "_blank")
                            .attr("rel", "noopener noreferrer")
                            .append($("<i>").addClass("fa-solid fa-anchor"))
                    )
            );
            
        container.append(header, codeBlock,  footer);
        return container;
    }

    /**
    * Dzieli kod na linie i opakowuje każdą linię w span.line:
    * @param {Object} code - kod do sparsowania
    * @returns {string} newCode - sparsowany kod
    */
    function lines(code) {
        let lines = code.replace(/\n$/, "").split("\n");
        let newCode = "";
        lines.forEach(function(line) {
            newCode += "<span class='line'>" +  line + "</span>\n";
        });
        return newCode;
    }

    /**
    * Podział wg regexów i nadanie klas:
    * @param {Object} segs - kod do sparsowania
    * @param {Object} re - regex do podziału
    * @param {string} cls - klasa do nadania
    * @returns {string} newCode - sparsowany kod
    */
    function splitByRegex(segs, re, cls) {
        let out = [];
        segs.forEach(s => {
            if (s.cls) { out.push(s); return; }
            let text = s.html;
            let last = 0;
            re.lastIndex = 0;
            let m;
            while ((m = re.exec(text)) !== null) {
                if (m.index > last) {out.push({ html: text.slice(last, m.index), cls: null });}
                out.push({ html: m[0], cls: cls });
                last = re.lastIndex;
            }
            if (last < text.length) {out.push({ html: text.slice(last), cls: null });}
        });
        return out;
    }

    return {
        init: function() {
            $("code.githubcode").each(function() {
                let extractedCode = extract($(this));
                if (!extractedCode) {return;}
                let langname = extractedCode.attrs['data-lang'] || 'txt';

                require(['filter_githubcode/' + langname], function(lang_data) {
                    if (!lang_data) {return;}
                    extractedCode.attrs['data-lang'] = lang_data.langname || langname;
                    let segs = [{ html: escape(extractedCode.code), cls: null }];

                    //fix multi-line comments
                    for (let i = 0; i < lang_data.multicomment.length; i += 2) {
                        let open = lang_data.multicomment[i];
                        let close = lang_data.multicomment[i + 1];
                        let re = new RegExp(open + "[\\s\\S]*?" + close, "g");
                        segs = splitByRegex(segs, re, "comment");
                    }

                    segs = splitByRegex(segs, new RegExp("(" + lang_data.comment.join("|") + ".*)", "g"), "comment");
                    
                    //fix
                    let artx = lang_data.text.map(el => "\\" + el + "[\\s\\S]*?\\" + el);

                    let regtx = new RegExp("(" + artx.join("|") + ")", "g");
                    segs = splitByRegex(segs, regtx, "string");

                    for (let k in lang_data.keywords) {
                        let flags = lang_data.casesensitive[k] ? "g" : "gi";
                        let re = new RegExp("\\b(" + lang_data.keywords[k].join("|") + ")\\b", flags);
                        segs = splitByRegex(segs, re, "keyword-" + k);
                    }
                    
                    let regNum = new RegExp("\\b(" + lang_data.number + ")\\b", "g");
                    segs = splitByRegex(segs, regNum, "dec-number");

                    //fix
                    let safeCode = segs.map(s => s.cls ? `<span class='${s.cls}'>${s.html}</span>` : s.html).join("");
                    safeCode = safeCode.replace(/<span class='(comment|string)'>([\s\S]*?)<\/span>/g,
                        (_, cls, content) => {
                            return content.split("\n")
                            .map(part => `<span class='${cls}'>${part}</span>`)
                            .join("\n");
                        }
                    );
                    let parsedCode = lines(safeCode);
                    let newCode = final(parsedCode, extractedCode.classes, extractedCode.attrs);
                    $(this).replaceWith(newCode);
                }.bind(this));
            });
        }
    };
});