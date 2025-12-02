// Info:
// keywords: max. 4 groups
// ver: 1.0 [2018.10.08]
// ver: 2.0 [2023.11.25]

define([], function () {
    return {
            ver: "2.0",
            langname: 'Command Prompt',
            casesensitive: {
                lv1: false,
                lv2: false,
                lv3: false
            },
            keywords: {
                lv1: [
                    'cd','mkdir','ls','dir',
                    'shutdown','reboot','halt','turnoff',
                    'sudo','su','chmod','chown','pwd',
                    'cat','nano','joe',
                    'adduser','useradd','addgroup',
                    'passwd','userdel','groupdel',
                    'shadow','group'
                ],
                lv2: [
                    'less','more','grep',
                    'ifconfig','ifup','ifdown'
                ],
                lv3: [
                    'iface','static','dhcp','address','netmask',
                    'network','broadcast','gateway','auto','inet','dns-nameservers'
                ]
            },
            number: '[0-9]+',
            text: ['"','\''],
            intxt: 'lLuU',
            realxt: 'fF',
            comment: ['\\/\\/','#'],
            multicomment: [] //pair begin => end
        };
    });