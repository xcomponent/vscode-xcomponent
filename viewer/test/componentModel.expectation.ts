import { NodeDataArrayTemplate, LinkDataArrayTemplate, DrawComponentData } from "../src/gojsTemplates";

export const correctNodeDataArray: Array<NodeDataArrayTemplate> = [{
    key: "Manager",
    text: "Manager",
    isGroup: true,
    numberOfInstances: 0
},
{
    key: "Reponse",
    text: "Reponse",
    isGroup: true,
    numberOfInstances: 0
},
{
    key: "Manager&EntryPoint",
    text: "EntryPoint",
    group: "Manager",
    stateName: "EntryPoint",
    numberOfStates: 0,
    fill: "Black",
    stroke: "Black",
    loc: "145 -78"
},
{
    key: "Reponse&first",
    text: "first",
    group: "Reponse",
    stateName: "first",
    numberOfStates: 0,
    fill: "White",
    stroke: "White",
    loc: "546 24"
},
{
    key: "Reponse&Done",
    text: "Done",
    group: "Reponse",
    stateName: "Done",
    numberOfStates: 0,
    fill: "Green",
    stroke: "Green",
    loc: "919 -138"
},
{
    key: "Reponse&second",
    text: "second",
    group: "Reponse",
    stateName: "second",
    numberOfStates: 0,
    fill: "White",
    stroke: "White",
    loc: "745 20"
},
{
    key: "Reponse&Third",
    text: "Third",
    group: "Reponse",
    stateName: "Third",
    numberOfStates: 0,
    fill: "White",
    stroke: "White",
    loc: "890 0"
},
{
    key: "Reponse&FirstSecondThirdPatternState",
    text: "FirstSecondThirdPatternState",
    group: "Reponse",
    stateName: "FirstSecondThirdPatternState",
    numberOfStates: 0,
    fill: "rgba(102,0,204,0.45)",
    stroke: "rgba(102,0,204,0.45)",
    loc: "607 -127.33333333333334"
},
{ key: "2", category: "LinkLabel", text: "SayHello" },
{ key: "5", category: "LinkLabel", text: "Done" },
{ key: "1", category: "LinkLabel", text: "FirstTransition" },
{ key: "7", category: "LinkLabel", text: "SecondTransition" }];

export const correctLinkDataArray: Array<LinkDataArrayTemplate> = [{
    key: "2",
    from: "Manager&EntryPoint",
    stateMachineTarget: "Manager",
    to: "Reponse&first",
    text: "SayHello",
    messageType: "XComponent.WorldHello.UserObject.SayHello",
    labelKeys: ["2"],
    triggerable: false,
    controls:
        [317.31123869371106,
            -249.30318626997376,
            436.272154163274,
            -234.8266592781731],
    strokeLink: "green",
    strokeArrow: "green",
    fillArrow: "green"
},
{
    key: "5",
    from: "Reponse&FirstSecondThirdPatternState",
    stateMachineTarget: "Reponse",
    to: "Reponse&Done",
    text: "Done",
    messageType: "XComponent.WorldHello.UserObject.Done",
    labelKeys: ["5"],
    triggerable: false,
    controls:
        [762.7945093568703,
            -153.37771935389367,
            838.961806141515,
            -158.98632689100384],
    strokeLink: "black",
    strokeArrow: "black",
    fillArrow: "black"
},
{
    key: "1",
    from: "Reponse&first",
    stateMachineTarget: "Reponse",
    to: "Reponse&second",
    text: "FirstTransition",
    messageType: "XComponent.WorldHello.UserObject.SayHello",
    labelKeys: ["1"],
    triggerable: false,
    controls:
        [604.2717568971972,
            -12.35004992622192,
            684.0046730402405,
            -6.615324290958256],
    strokeLink: "black",
    strokeArrow: "black",
    fillArrow: "black"
},
{
    key: "7",
    from: "Reponse&second",
    stateMachineTarget: "Reponse",
    to: "Reponse&Third",
    text: "SecondTransition",
    messageType: "XComponent.WorldHello.UserObject.SayHello",
    labelKeys: ["7"],
    triggerable: false,
    controls:
        [793.1127056422748,
            -25.33531884348009,
            842.7566233168754,
            -26.30140441768713],
    strokeLink: "black",
    strokeArrow: "black",
    fillArrow: "black"
},
{
    key: "6",
    from: "Reponse&FirstSecondThirdPatternState",
    to: "5",
    strokeLink: "red",
    strokeArrow: "red",
    fillArrow: "red",
    triggerable: true,
    dash: [3, 2],
    controls:
        [696.1133311981484,
            -182.9564730403514,
            759.4102292422128,
            -184.59185790508192,
            801.997480039458,
            -144.48411953953965]
},
{
    key: "3",
    from: "Reponse&first",
    to: "1",
    strokeLink: "red",
    strokeArrow: "red",
    fillArrow: "red",
    triggerable: true,
    dash: [3, 2],
    controls:
        [565.8987616780212,
            -45.03776123817483,
            635.3253206132188,
            -39.83979806154872,
            647.783733810074,
            3.417641519114177]
}];

export const correctNodeDataArrayWithoutGraphical: Array<NodeDataArrayTemplate> =
    [{
        key: "Manager",
        text: "Manager",
        isGroup: true,
        numberOfInstances: 0
    },
    {
        key: "Reponse",
        text: "Reponse",
        isGroup: true,
        numberOfInstances: 0
    },
    {
        key: "Manager&EntryPoint",
        text: "EntryPoint",
        group: "Manager",
        stateName: "EntryPoint",
        numberOfStates: 0,
        fill: "Black",
        stroke: "Black",
        loc: undefined
    },
    {
        key: "Reponse&first",
        text: "first",
        group: "Reponse",
        stateName: "first",
        numberOfStates: 0,
        fill: "White",
        stroke: "White",
        loc: undefined
    },
    {
        key: "Reponse&Done",
        text: "Done",
        group: "Reponse",
        stateName: "Done",
        numberOfStates: 0,
        fill: "Green",
        stroke: "Green",
        loc: undefined
    },
    {
        key: "Reponse&second",
        text: "second",
        group: "Reponse",
        stateName: "second",
        numberOfStates: 0,
        fill: "White",
        stroke: "White",
        loc: undefined
    },
    {
        key: "Reponse&Third",
        text: "Third",
        group: "Reponse",
        stateName: "Third",
        numberOfStates: 0,
        fill: "White",
        stroke: "White",
        loc: undefined
    },
    {
        key: "Reponse&FirstSecondThirdPatternState",
        text: "FirstSecondThirdPatternState",
        group: "Reponse",
        stateName: "FirstSecondThirdPatternState",
        numberOfStates: 0,
        fill: "rgba(102,0,204,0.45)",
        stroke: "rgba(102,0,204,0.45)",
        loc: undefined
    },
    { key: "2", category: "LinkLabel", text: "SayHello" },
    { key: "5", category: "LinkLabel", text: "Done" },
    { key: "1", category: "LinkLabel", text: "FirstTransition" },
    { key: "7", category: "LinkLabel", text: "SecondTransition" }];

export const correctLinkDataArrayWithoutGraphical: Array<LinkDataArrayTemplate> =
    [{
        key: "2",
        from: "Manager&EntryPoint",
        stateMachineTarget: "Manager",
        to: "Reponse&first",
        text: "SayHello",
        messageType: "XComponent.WorldHello.UserObject.SayHello",
        labelKeys: ["2"],
        triggerable: false,
        controls: null,
        strokeLink: "green",
        strokeArrow: "green",
        fillArrow: "green"
    },
    {
        key: "5",
        from: "Reponse&FirstSecondThirdPatternState",
        stateMachineTarget: "Reponse",
        to: "Reponse&Done",
        text: "Done",
        messageType: "XComponent.WorldHello.UserObject.Done",
        labelKeys: ["5"],
        triggerable: false,
        controls: null,
        strokeLink: "black",
        strokeArrow: "black",
        fillArrow: "black"
    },
    {
        key: "1",
        from: "Reponse&first",
        stateMachineTarget: "Reponse",
        to: "Reponse&second",
        text: "FirstTransition",
        messageType: "XComponent.WorldHello.UserObject.SayHello",
        labelKeys: ["1"],
        triggerable: false,
        controls: null,
        strokeLink: "black",
        strokeArrow: "black",
        fillArrow: "black"
    },
    {
        key: "7",
        from: "Reponse&second",
        stateMachineTarget: "Reponse",
        to: "Reponse&Third",
        text: "SecondTransition",
        messageType: "XComponent.WorldHello.UserObject.SayHello",
        labelKeys: ["7"],
        triggerable: false,
        controls: null,
        strokeLink: "black",
        strokeArrow: "black",
        fillArrow: "black"
    },
    {
        key: "6",
        from: "Reponse&FirstSecondThirdPatternState",
        to: "5",
        strokeLink: "red",
        strokeArrow: "red",
        fillArrow: "red",
        triggerable: true,
        dash: [3, 2],
        controls: null
    },
    {
        key: "3",
        from: "Reponse&first",
        to: "1",
        strokeLink: "red",
        strokeArrow: "red",
        fillArrow: "red",
        triggerable: true,
        dash: [3, 2],
        controls: null
    }];


export const correctNodeDataArrayWithExtraData: Array<NodeDataArrayTemplate> = [{
    key: "Manager",
    text: "Manager",
    isGroup: true,
    numberOfInstances: 0
},
{
    key: "Reponse",
    text: "Reponse",
    isGroup: true,
    numberOfInstances: 0
},
{
    key: "Manager&ExtraState",
    text: "ExtraState",
    group: "Manager",
    stateName: "ExtraState",
    numberOfStates: 0,
    fill: "White",
    stroke: "White",
    loc: undefined
},
{
    key: "Manager&EntryPoint",
    text: "EntryPoint",
    group: "Manager",
    stateName: "EntryPoint",
    numberOfStates: 0,
    fill: "Black",
    stroke: "Black",
    loc: undefined
},
{
    key: "Reponse&first",
    text: "first",
    group: "Reponse",
    stateName: "first",
    numberOfStates: 0,
    fill: "White",
    stroke: "White",
    loc: undefined
},
{
    key: "Reponse&Done",
    text: "Done",
    group: "Reponse",
    stateName: "Done",
    numberOfStates: 0,
    fill: "Green",
    stroke: "Green",
    loc: undefined
},
{
    key: "Reponse&second",
    text: "second",
    group: "Reponse",
    stateName: "second",
    numberOfStates: 0,
    fill: "White",
    stroke: "White",
    loc: undefined
},
{
    key: "Reponse&Third",
    text: "Third",
    group: "Reponse",
    stateName: "Third",
    numberOfStates: 0,
    fill: "White",
    stroke: "White",
    loc: undefined
},
{
    key: "Reponse&FirstSecondThirdPatternState",
    text: "FirstSecondThirdPatternState",
    group: "Reponse",
    stateName: "FirstSecondThirdPatternState",
    numberOfStates: 0,
    fill: "rgba(102,0,204,0.45)",
    stroke: "rgba(102,0,204,0.45)",
    loc: undefined
},
{ key: "01", category: "LinkLabel", text: "ExtraTransition" },
{ key: "2", category: "LinkLabel", text: "SayHello" },
{ key: "5", category: "LinkLabel", text: "Done" },
{ key: "1", category: "LinkLabel", text: "FirstTransition" },
{ key: "7", category: "LinkLabel", text: "SecondTransition" }];

export const correctLinkDataArrayWithExtraData: Array<LinkDataArrayTemplate> = [{
    key: "01",
    from: "Manager&ExtraState",
    stateMachineTarget: "Manager",
    to: "Manager&EntryPoint",
    text: "ExtraTransition",
    messageType: "XComponent.WorldHello.UserObject.SayHello",
    labelKeys: ["01"],
    triggerable: false,
    controls: null,
    strokeLink: "black",
    strokeArrow: "black",
    fillArrow: "black"
},
{
    key: "2",
    from: "Manager&EntryPoint",
    stateMachineTarget: "Manager",
    to: "Reponse&first",
    text: "SayHello",
    messageType: "XComponent.WorldHello.UserObject.SayHello",
    labelKeys: ["2"],
    triggerable: false,
    controls: null,
    strokeLink: "green",
    strokeArrow: "green",
    fillArrow: "green"
},
{
    key: "5",
    from: "Reponse&FirstSecondThirdPatternState",
    stateMachineTarget: "Reponse",
    to: "Reponse&Done",
    text: "Done",
    messageType: "XComponent.WorldHello.UserObject.Done",
    labelKeys: ["5"],
    triggerable: false,
    controls: null,
    strokeLink: "black",
    strokeArrow: "black",
    fillArrow: "black"
},
{
    key: "1",
    from: "Reponse&first",
    stateMachineTarget: "Reponse",
    to: "Reponse&second",
    text: "FirstTransition",
    messageType: "XComponent.WorldHello.UserObject.SayHello",
    labelKeys: ["1"],
    triggerable: false,
    controls: null,
    strokeLink: "black",
    strokeArrow: "black",
    fillArrow: "black"
},
{
    key: "7",
    from: "Reponse&second",
    stateMachineTarget: "Reponse",
    to: "Reponse&Third",
    text: "SecondTransition",
    messageType: "XComponent.WorldHello.UserObject.SayHello",
    labelKeys: ["7"],
    triggerable: false,
    controls: null,
    strokeLink: "black",
    strokeArrow: "black",
    fillArrow: "black"
},
{
    key: "6",
    from: "Reponse&FirstSecondThirdPatternState",
    to: "5",
    strokeLink: "red",
    strokeArrow: "red",
    fillArrow: "red",
    triggerable: true,
    dash: [3, 2],
    controls: null
},
{
    key: "3",
    from: "Reponse&first",
    to: "1",
    strokeLink: "red",
    strokeArrow: "red",
    fillArrow: "red",
    triggerable: true,
    dash: [3, 2],
    controls: null
}];


export const correctNodeDataArrayLightManager = [{
    key: 'LightManager',
    text: 'LightManager',
    isGroup: true,
    numberOfInstances: 0
},
{
    key: 'Light',
    text: 'Light',
    isGroup: true,
    numberOfInstances: 0
},
{
    key: 'LightManager&EntryPoint',
    text: 'EntryPoint',
    group: 'LightManager',
    stateName: 'EntryPoint',
    numberOfStates: 0,
    fill: 'Black',
    stroke: 'Black',
    loc: '475 191.69232177734375'
},
{
    key: 'LightManager&Up',
    text: 'Up',
    group: 'LightManager',
    stateName: 'Up',
    numberOfStates: 0,
    fill: 'White',
    stroke: 'White',
    loc: '480.86720275878906 389.7500305175781'
},
{
    key: 'Light&Red',
    text: 'Red',
    group: 'Light',
    stateName: 'Red',
    numberOfStates: 0,
    fill: 'White',
    stroke: 'White',
    loc: '764.048828125 110.87501525878906'
},
{
    key: 'Light&Green',
    text: 'Green',
    group: 'Light',
    stateName: 'Green',
    numberOfStates: 0,
    fill: 'White',
    stroke: 'White',
    loc: '979.1332742179773 207.0875523507772'
},
{
    key: 'Light&Orange',
    text: 'Orange',
    group: 'Light',
    stateName: 'Orange',
    numberOfStates: 0,
    fill: 'White',
    stroke: 'White',
    loc: '904.255925058729 315.95400593471817'
},
{
    key: 'Light&Paused',
    text: 'Paused',
    group: 'Light',
    stateName: 'Paused',
    numberOfStates: 0,
    fill: 'White',
    stroke: 'White',
    loc: '871.415173810738 506.41716122650837'
},
{ key: '17', category: 'LinkLabel', text: 'Init' },
{ key: '18', category: 'LinkLabel', text: 'CreateLight' },
{ key: '1', category: 'LinkLabel', text: 'FromRedToGreen' },
{ key: '5', category: 'LinkLabel', text: 'Pause' },
{ key: '9', category: 'LinkLabel', text: 'UpdatePeriods' },
{ key: '2', category: 'LinkLabel', text: 'FromGreenToOrange' },
{ key: '7', category: 'LinkLabel', text: 'Pause' },
{ key: '11', category: 'LinkLabel', text: 'UpdatePeriods' },
{ key: '3', category: 'LinkLabel', text: 'FromOrangeToRed' },
{ key: '6', category: 'LinkLabel', text: 'Pause' },
{ key: '10', category: 'LinkLabel', text: 'UpdatePeriods' },
{ key: '8', category: 'LinkLabel', text: 'Start' },
{ key: '13', category: 'LinkLabel', text: 'BlinkUpdate' }]


export const correctLinkDataArrayLightManager = [{
    key: '17',
    from: 'LightManager&EntryPoint',
    stateMachineTarget: 'LightManager',
    to: 'LightManager&Up',
    text: 'Init',
    messageType: 'XComponent.Common.Event.DefaultEvent',
    labelKeys: ['17'],
    triggerable: false,
    controls:
        [519.4240836290834,
            293.3939176537497,
            517.815919671771,
            351.083056565342],
    strokeLink: 'orange',
    strokeArrow: 'orange',
    fillArrow: 'orange'
},
{
    key: '18',
    from: 'LightManager&Up',
    stateMachineTarget: 'LightManager',
    to: 'Light&Red',
    text: 'CreateLight',
    messageType: 'XComponent.LightManager.UserObject.CreateLight',
    labelKeys: ['18'],
    triggerable: false,
    controls:
        [578.377528021954,
            309.8102228381269,
            666.8992615405847,
            222.63842615127325],
    strokeLink: 'green',
    strokeArrow: 'green',
    fillArrow: 'green'
},
{
    key: '1',
    from: 'Light&Red',
    stateMachineTarget: 'Light',
    to: 'Light&Green',
    text: 'FromRedToGreen',
    messageType: 'XComponent.Common.Event.DefaultEvent',
    labelKeys: ['1'],
    triggerable: false,
    controls:
        [858.9080862908893,
            166.15146120143993,
            923.1765323259542,
            194.85304716993974],
    strokeLink: 'orange',
    strokeArrow: 'orange',
    fillArrow: 'orange'
},
{
    key: '5',
    from: 'Light&Red',
    stateMachineTarget: 'Light',
    to: 'Light&Paused',
    text: 'Pause',
    messageType: 'XComponent.LightManager.UserObject.Pause',
    labelKeys: ['5'],
    triggerable: false,
    controls:
        [827.1131020484997,
            274.87862571870704,
            861.7913674236534,
            398.7196373902303],
    strokeLink: 'black',
    strokeArrow: 'black',
    fillArrow: 'black'
},
{
    key: '9',
    from: 'Light&Red',
    stateMachineTarget: 'Light',
    to: 'Light&Red',
    text: 'UpdatePeriods',
    messageType: 'XComponent.LightManager.UserObject.UpdatePeriods',
    labelKeys: ['9'],
    triggerable: false,
    controls:
        [800.2988281250018,
            178.64109491962958,
            757.7988281250017,
            178.64109491962594],
    strokeLink: 'black',
    strokeArrow: 'black',
    fillArrow: 'black'
},
{
    key: '2',
    from: 'Light&Green',
    stateMachineTarget: 'Light',
    to: 'Light&Orange',
    text: 'FromGreenToOrange',
    messageType: 'XComponent.Common.Event.DefaultEvent',
    labelKeys: ['2'],
    triggerable: false,
    controls:
        [988.2055810819513,
            290.062971404959,
            968.6587544109598,
            320.0349927508462],
    strokeLink: 'orange',
    strokeArrow: 'orange',
    fillArrow: 'orange'
},
{
    key: '7',
    from: 'Light&Green',
    stateMachineTarget: 'Light',
    to: 'Light&Paused',
    text: 'Pause',
    messageType: 'XComponent.LightManager.UserObject.Pause',
    labelKeys: ['7'],
    triggerable: false,
    controls:
        [978.3461606023013,
            348.70412440375117,
            946.1091072796946,
            440.7361614596875],
    strokeLink: 'black',
    strokeArrow: 'black',
    fillArrow: 'black'
},
{
    key: '11',
    from: 'Light&Green',
    stateMachineTarget: 'Light',
    to: 'Light&Green',
    text: 'UpdatePeriods',
    messageType: 'XComponent.LightManager.UserObject.UpdatePeriods',
    labelKeys: ['11'],
    triggerable: false,
    controls:
        [1015.8616075513123,
            274.85363201161766,
            973.3616075513123,
            274.85363201161414],
    strokeLink: 'black',
    strokeArrow: 'black',
    fillArrow: 'black'
},
{
    key: '3',
    from: 'Light&Orange',
    stateMachineTarget: 'Light',
    to: 'Light&Red',
    text: 'FromOrangeToRed',
    messageType: 'XComponent.Common.Event.DefaultEvent',
    labelKeys: ['3'],
    triggerable: false,
    controls:
        [856.5714951374121,
            286.80350777703796,
            813.1386321446375,
            225.21999214197123],
    strokeLink: 'orange',
    strokeArrow: 'orange',
    fillArrow: 'orange'
},
{
    key: '6',
    from: 'Light&Orange',
    stateMachineTarget: 'Light',
    to: 'Light&Paused',
    text: 'Pause',
    messageType: 'XComponent.LightManager.UserObject.Pause',
    labelKeys: ['6'],
    triggerable: false,
    controls:
        [933.5278197660787,
            418.1998671073119,
            923.6100912301665,
            473.84581525043785],
    strokeLink: 'black',
    strokeArrow: 'black',
    fillArrow: 'black'
},
{
    key: '10',
    from: 'Light&Orange',
    stateMachineTarget: 'Light',
    to: 'Light&Orange',
    text: 'UpdatePeriods',
    messageType: 'XComponent.LightManager.UserObject.UpdatePeriods',
    labelKeys: ['10'],
    triggerable: false,
    controls:
        [944.9175917253974,
            383.72008559555866,
            902.4175917253974,
            383.720085595555],
    strokeLink: 'black',
    strokeArrow: 'black',
    fillArrow: 'black'
},
{
    key: '8',
    from: 'Light&Paused',
    stateMachineTarget: 'Light',
    to: 'Light&Red',
    text: 'Start',
    messageType: 'XComponent.LightManager.UserObject.Start',
    labelKeys: ['8'],
    triggerable: false,
    controls:
        [831.8009209605809,
            407.14294038737285,
            797.1013334720768,
            283.25552139782593],
    strokeLink: 'black',
    strokeArrow: 'black',
    fillArrow: 'black'
},
{
    key: '13',
    from: 'Light&Paused',
    stateMachineTarget: 'Light',
    to: 'Light&Paused',
    text: 'BlinkUpdate',
    messageType: 'XComponent.Common.Event.DefaultEvent',
    labelKeys: ['13'],
    triggerable: false,
    controls:
        [921.0568404774001,
            591.5037489630304,
            858.5568404774042,
            591.5037489630377],
    strokeLink: 'orange',
    strokeArrow: 'orange',
    fillArrow: 'orange'
}]