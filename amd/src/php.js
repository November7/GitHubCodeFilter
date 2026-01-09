// Info:
// keywords: max. 4 groups
// ver: 1.0 [2026.01.09]

define([], function () {
    return {
        ver: "1.0",
        langname: 'PHP',
        casesensitive: {
            lv1: true,
            lv2: true,
            lv3: true,
            lv4: true
        },
        keywords: {
            lv1: [
                'if','else','elseif',
                'for','foreach','while','do',
                'switch','case','default',
                'break','continue','return',
                'try','catch','finally','throw',
                'true','false','null'
            ],
            lv2: [
                'function','class','interface','trait',
                'extends','implements','use',
                'public','protected','private',
                'static','final','abstract',
                'new','clone',
                'var','const',
                'echo','print','include','require','include_once','require_once'
            ],
            lv3: [
                '__construct','__destruct',
                '__call','__callStatic',
                '__get','__set','__isset','__unset',
                '__sleep','__wakeup',
                '__toString','__invoke',
                '__debugInfo'
            ],
            lv4: [
                'array','isset','empty','unset',
                'count','in_array','explode','implode'
            ]
        },
        number: '[0-9]+',
        text: ['"','\''],
        intxt: '',
        realxt: '',
        comment: ['\\/\\/','#'],
        multicomment: ['\\/\\*','\\*\\/']  //pair begin => end
    };
});
