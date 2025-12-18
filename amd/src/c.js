// Info:
// keywords: max. 4 groups
// ver: 0.1 [2018.08.24]
// ver: 2.0 [2023.11.25]
// ver: 2.0 [2025.12.02] moving to new repo
// ver: 2.1 [2025.12.03] added C/C++/C# keywords

define([], function () {
    return {
        ver: "2.1",
        langname: 'C',
        casesensitive: {
            lv1: true,
            lv2: true,
            lv3: true,
            lv4: true
        },
        keywords: {
            lv1: [
                'for','while','do',
                'if','else',
                'break','continue','goto',
                'switch','case','default',
                'typedef','sizeof',
                'return'
            ],
            lv2: [
                'char','int','float','double','void','enum',
                'struct','union',
                'signed','unsigned','long','short',
                'volatile','const','static','auto','register'
            ],
            lv3: [
                'NULL','FILE','size_t'
            ],
            lv4: [
                'printf','scanf'
            ]
        },
        number: '[0-9]+',
        text: ['"','\''],
        intxt: 'lLuU',
        realxt: 'fF',
        comment: ['\\/\\/','#'],
        multicomment: ['\\/\\*','\\*\\/'] //pair begin => end
    };
});