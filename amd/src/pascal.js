// Info:
// keywords: max. 4 groups
// ver: 0.1 [2026.01.09]

define([], function () {
    return {
        ver: "0.1",
        langname: 'Pascal',
        casesensitive: {
            lv1: false,
            lv2: false,
            lv3: false,
            lv4: false
        },
        keywords: {
            lv1: [
                'if','then','else',
                'for','to','downto','while','do','repeat','until',
                'case','of',
                'begin','end',
                'break','continue','exit'
            ],
            lv2: [
                'program','unit','uses',
                'var','const','type',
                'record','array','set','file',
                'function','procedure',
                'with','goto',
                'true','false','nil'
            ],
            lv3: [
                'integer','real','char','boolean','string',
                'byte','word','longint','qword','single','double','extended'
            ],
            lv4: [
                'writeln','write','readln','read'
            ]
        },
        number: '[0-9]+',
        text: ['"','\''],
        intxt: '',
        realxt: '',
        comment: ['\\/\\/'],   // FreePascal/Delphi styl
        multicomment: ['\\{','\\}']  // Pascalowy blok komentarza
    };
});
