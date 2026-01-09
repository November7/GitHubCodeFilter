// Info:
// keywords: max. 4 groups
// ver: 1.0 [2026.01.09]

define([], function () {
    return {
        ver: "1.0",
        langname: 'Java',
        casesensitive: {
            lv1: true,
            lv2: true,
            lv3: true,
            lv4: true
        },
        keywords: {
            lv1: [
                'if','else',
                'for','while','do',
                'switch','case','default',
                'break','continue','return',
                'try','catch','finally','throw','throws',
                'true','false','null'
            ],
            lv2: [
                'class','interface','enum',
                'extends','implements',
                'public','protected','private',
                'static','final','abstract',
                'synchronized','volatile','transient',
                'new','this','super',
                'void','int','long','short','byte','char','boolean','float','double'
            ],
            lv3: [
                'package','import',
                'instanceof','assert'
            ],
            lv4: [
                'System','out','in','err'
            ]
        },
        number: '[0-9]+',
        text: ['"','\''],
        intxt: 'lLuU',
        realxt: 'fFdD',
        comment: ['\\/\\/'],
        multicomment: ['\\/\\*','\\*\\/']  //pair begin => end
    };
});
