// Info:
// keywords: max. 4 groups
// ver: 0.1 [2022.11.26]
// ver: 2.0 [2023.11.25]
// ver: 2.0 [2025.12.02] moving to new repo

define([], function () {
    return {
        ver: "2.1",
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
                'return','yield',
                'True','False','None',
                'def','class','pass','in','is',
                'import','from','as',
                'with','try','raise','finally','except',
                'break','continue','global','nonlocal','assert','del'
            ],
            lv2: [
                'int','float','str',
                'bool','bytes','complex',
                'list','tuple','set','dict','range',
                'frozenset','memoryview',
                'and','or','not'
            ],
            lv3: [
                'self','cls',
                'staticmethod','classmethod','property',
                'async','await'
            ],
            lv4: [
                'print','input','len','open','type','isinstance','dir','help','id'
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
