// Info:
// keywords: max. 4 groups
// ver: 0.1 [2018.08.24]
// ver: 2.0 [2023.11.25]
// ver: 2.0 [2025.12.02] moving to new repo
// ver: 2.1 [2025.12.03] added C/C++/C# keywords

define([], function () {
    return {
        ver: "2.1",
        langname: 'C/C++/C#',
        casesensitive: {
            lv1: true,
            lv2: true,
            lv3: true,
            lv4: true
        },
        keywords: {
            lv1: [
                // sterowanie przepływem
                'for','while','do',
                'if','else',
                'break','continue','goto',
                'switch','case','default',
                'typedef','sizeof',
                'public','protected','private',
                'try','throw','catch','finally',
                'using','namespace',
                'return','yield',
                'true','false','null'
            ],
            lv2: [
                // typy i deklaracje
                'char','bool','int','float','double','void','enum',
                'struct','union','class','interface',
                'signed','unsigned','long','short',
                'volatile','const','static','auto','register',
                'virtual','friend','abstract','sealed','override',
                'delete','new','operator',
                'string','object','dynamic','var'
            ],
            lv3: [
                // makra, stałe, typy systemowe
                'INT','UINT','LONG','ULONG',
                'TRUE','FALSE','NULL','FILE',
                'SIZE_T','HRESULT','DWORD','BYTE',
                'nullptr'
            ],
            lv4: [
                // biblioteki standardowe / IO
                'cout','endl','cin','printf','scanf',
                'Console','WriteLine','ReadLine'
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