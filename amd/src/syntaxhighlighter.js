// AMD module for syntax highlighter

// ver: 2.0 [2025.12.02] moving to new repo

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
        let code = $block.find('code.githubcode').first();
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
* @param {Object} classes - klasy do dodania do elementu code
* @param {Object} code - kod do sparsowania
* @returns {string} newCode - sparsowany kod
*/
    function final(classes, code) {
        return $("<code>").attr("class", classes).html(code);
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
            newCode += "<span class='line'>" +  escape(line) + "</span>\n";
        });
        return newCode;
    }

    return {
        init: function() {
            $("pre:has(code.githubcode)").each(function() {
                let extractedCode = extract($(this));
                if (!extractedCode) { return; }
                else {
                    window.console.log("Attributes:", extractedCode.attrs);
                }

                let parsedCode = lines(extractedCode.code);
                let newCode = final(extractedCode.classes, parsedCode);
                $(this).empty().append(newCode);

            });
        }
    };
});