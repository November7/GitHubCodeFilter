// Info:
// keywords: max. 4 groups
// ver: 0.1 [2022.11.26]
// ver: 2.0 [2023.11.25]

define([], function () {

return {
        ver: "2.0.3",
        langname: 'Python',
        casesensitive: {
            lv1: true,
            lv2: true,
            lv3: true,
            lv4: true
        },
        keywords: {
            lv1: [
                'for','while',
                'if','elif','else',
                'return','True','False','None',
                'def','class','pass','in','import','as',
                'with','try','raise','finally','except'
            ],
            lv2: [
                'int','float','str',
                'bool','bytes','complex',
                'list','touple','set','dict','range',
                'and','or','not'
            ],
            lv3: [
                'self','cls','staticmethod','classmethod' //can't contain @ because of \b in regexp
            ],
            lv4: [
                'print','input'
            ]
        },
        number: '[0-9]+',
        text: ['"','\''],
        intxt: '',
        realxt: '',
        comment: ['#'],
        multicomment: ["'''","'''"] //pair begin => end
    };
});
