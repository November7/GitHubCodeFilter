// Info:
// keywords: max. 4 groups
// ver: 0.1 [2018.08.24]
// ver: 2.0 [2023.11.25]

define([], function () {
    return {
        ver: "2.0",
        langname: 'C++',
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
                'public','protected','private',
                'try','throw','catch',
                'using','namespace',
                'return','true','false','null'
            ],
            lv2: [
                'char','bool','int','float','double','void','enum',
                'struct','union','class',
                'signed','unsigned','long','short',
                'volatile','const','static','auto','register',
                'virtual','friend',
                'delete','new'
            ],
            lv3: [
                'INT','UINT','LONG','ULONG',
                'TRUE','FALSE','NULL','FILE'
            ],
            lv4: [
                'cout','endl','cin'
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