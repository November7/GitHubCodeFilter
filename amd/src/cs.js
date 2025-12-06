// Info:
// keywords: max. 4 groups
// ver: 1.0 [2025.12.06]

define([], function () {
    return {
        ver: "1.0",
        langname: 'C#',
        casesensitive: {
            lv1: true,
            lv2: true,
            lv3: true,
            lv4: true
        },
        keywords: {
            lv1: [
                'for','foreach','while','do',
                'if','else',
                'break','continue','goto',
                'switch','case','default',
                'public','protected','private','internal',
                'try','throw','catch','finally',
                'using',
                'return','yield',
                'true','false','null'
            ],
            lv2: [
                'bool','byte','sbyte','char','decimal','double','float',
                'int','uint','long','ulong','short','ushort',
                'string','object','dynamic','var',
                'void','enum','struct','class','interface',
                'const','static','readonly','volatile',
                'abstract','sealed','override','virtual','new',
                'async','await','namespace',
            ],
            lv3: [
                'base','this','typeof','sizeof','nameof',
                'checked','unchecked','lock','unsafe','fixed',
                'params','ref','out','in',
                'is','as'
            ],
            lv4: [
                'Console','WriteLine','ReadLine'
            ]
        },
        number: '[0-9]+',
        text: ['"','\''],
        intxt: '',       // w C# nie ma sufiksów lLuU jak w C++
        realxt: 'fFdDmM',// sufiksy dla literałów float/double/decimal
        comment: ['\\/\\/'],
        multicomment: ['\\/\\*','\\*\\/'] //pair begin => end
    };
});