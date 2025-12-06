// AMD module for syntax highlighter
// ver: 4.0 [2025.12.06] moving to new repo

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
        let container = $("<div>").addClass("githubcode-container");

        let header = $("<div>").addClass("githubcode-header")
        .append(
            $("<span>")
                .addClass("title")
                .text(attrs['data-title'] || "")
        )
        .append(
            $("<span>")
                .addClass("language")
                .text(attrs['data-lang'] || "Plain Text")
        );

        let codeBlock = $("<pre>").append(
            $("<code>")
                .attr("class", classes)
                .html(code)
        );

        let footer = $("<div>")
            .addClass("githubcode-footer")
            .text("Stopka");

        container.append(header, codeBlock, footer);
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

                    segs = splitByRegex(segs, new RegExp("(" + lang_data.comment.join("|") + ".*)", "g"), "comment");
                    for (let i = 0; i < lang_data.multicomment.length; i += 2) {
                        let re = new RegExp(lang_data.multicomment[i] + ".*?" + lang_data.multicomment[i+1], "gs");
                        segs = splitByRegex(segs, re, "comment");
                    }

                    let artx = lang_data.text.map(el => "\\"+el+".*?\\"+el);
                    let regtx = new RegExp("(" + artx.join("|") + ")", "g");
                    segs = splitByRegex(segs, regtx, "string");

                    for (let k in lang_data.keywords) {
                        let re = new RegExp("\\b(" + lang_data.keywords[k].join("|") + 
                        ")\\b", lang_data.casesensitive[k] ? "g" : "gi");
                        segs = splitByRegex(segs, re, "keyword-"+k);
                    }
                    
                    let regNum = new RegExp("\\b(" + lang_data.number + ")\\b", "g");
                    segs = splitByRegex(segs, regNum, "dec-number");

                    let safeCode = segs.map(s => s.cls ? `<span class='${s.cls}'>${s.html}</span>` : s.html).join("");

                    let parsedCode = lines(safeCode);
                    let newCode = final(parsedCode, extractedCode.classes, extractedCode.attrs);
                    $(this).replaceWith(newCode); 

                }.bind(this));
            });
        }
    };
});
