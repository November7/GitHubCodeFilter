define(['jquery'], function($) {
    return {
        init: function() {
            // window.console.log("highlight init 3.0");
            $.fn.parseCodeSplit = function(regexp,type) {
                let splitHtml = $(this).html().split(/(<span.*?\/span>)/gi);
                for(let i=0;i<splitHtml.length;i+=2)
                {
                    splitHtml[i] = splitHtml[i].replace(regexp,'<span class="'+type+'">$1</span>');
                }
                return splitHtml.join("");
            };
            $.fn.parseCode = function(regexp,type) {

                return $(this).html().replace(regexp,'<span class="'+type+'">$1</span>');
            };
            $.fn.matchCode = function(regexp) {
                let splitHtml = $(this).html().split(/(<span.*?\/span>)/gi);
                for(let i=0;i<splitHtml.length;i+=2)
                {
                    if(splitHtml[i].match(regexp)) {return true;}
                }
                return false;
            };
            // $(".chParser_JS").each(function() {
            $(".codehl").each(function() {
                /// do przerobienia
                // window.console.log(this.className);
                let re = RegExp("chLang_([a-zA-Z]+)","gm");
                let strippedLangName;
                strippedLangName = re.exec(this.className);
                // window.console.log("Lang "+strippedLangName[1]);
                let langname = strippedLangName[1];
                if($.inArray(langname, ['cpp','python','cmd','php']) < 0) {return;}
                ////////////////////////////
                let pres = $(this).find("td:eq(1) pre" );
                require(['filter_codehighlighter/'+langname], function(lang_data) {
                    if(lang_data == undefined) {return;}
                    let artx = [];
                    lang_data.text.forEach(function(el) {
                        artx.push("\\"+el+".*?"+"\\"+el);
                    });
                    let regtx = new RegExp("("+artx.join('|')+")","g");
                    let regky = [];
                    for(let k in lang_data.keywords) {
                        if (lang_data.keywords.hasOwnProperty(k)) {
                            regky.push(new RegExp("\\b("+
                            lang_data.keywords[k].join("|")+
                            ")\\b",lang_data.casesensitive[k]?"g":"gi"));
                        }
                    }
                    // window.console.log(regky);
                    let regcm = [];
                    lang_data.comment.forEach(function(el) {
                        regcm.push(el+".*");
                    });
                    for(let i=0;i<lang_data.multicomment.length;i+=2) {
                        regcm.push(lang_data.multicomment[i]+".*?"+lang_data.multicomment[i+1]);
                    }
                    pres.each(function() {
                        $(this).html($(this).parseCodeSplit(regtx,'text'));
                    });
                    for(let i=0;i<lang_data.multicomment.length;i+=2) {
                        let cs = 0;
                        let mc_b = lang_data.multicomment[i];
                        let mc_e = lang_data.multicomment[i+1];
                        pres.each(function() {
                            if(cs) {
                                $(this).html($(this).parseCode(new RegExp("(^.*?($|"+mc_e+"))","g"),'multicomment'));
                                if($(this).html().match(new RegExp("("+mc_e+")"),"g")) {
                                    cs = 0;
                                }
                            }
                            else {
                                $(this).html($(this).parseCode(new RegExp("("+regcm.join("|")+")"),'comment'));
                            }
                            let rmc_b = new RegExp("("+mc_b + "((?!"+mc_e + ").)*$)","g");
                            if($(this).matchCode(rmc_b)) {
                                $(this).html($(this).parseCode(rmc_b,'multicomment'));
                                cs = 1;
                            }
                        });
                    }
                    pres.each(function() {
                        for(let i=0;i<regky.length;++i) {
                            $(this).html($(this).parseCodeSplit(regky[i],'keyword'+(i+1)));
                        }
                        $(this).html($(this).parseCodeSplit(new RegExp("\\b("+lang_data.number+")\\b","g"),'dec-number'));
                    });
                });
            });
        }
    };
});