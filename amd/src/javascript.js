// Info:
// keywords: max. 4 groups
// ver: 0.1 [2025.12.08]

define([], function () {
    return {
        ver: "0.1",
        langname: 'JavaScript',
        casesensitive: {
            lv1: true,
            lv2: true,
            lv3: false,
            lv4: false
        },
        keywords: {
            lv1: [
                'for','while','do',
                'if','else',
                'break','continue',
                'switch','case','default',
                'try','throw','catch','finally',
                'return','true','false','null','undefined'
            ],
            lv2: [
                'var','let','const',
                'function','class','extends','super',
                'import','export','default',
                'new','delete','typeof','instanceof',
                'document','window','console','Math','Date','JSON',
                'Promise','async','await'
            ],
            lv3: [
                'lang','charset','name','content','http-equiv',
            ],
            lv4: [
                'span','div','script','style','html','body','head',
                'doctype','meta','title','link'
            ]
        },
        number: '[0-9]+',
        text: ['"','\'','`'],
        intxt: '',
        realxt: '',
        comment: ['\\/\\/'],
        multicomment: ['\\/\\*','\\*\\/']  // pair begin => end
    };
});