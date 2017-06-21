export const correctNodeDataArray = [{
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

export const correctLinkDataArray = [{
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
    controls:
    [565.8987616780212,
        -45.03776123817483,
        635.3253206132188,
        -39.83979806154872,
        647.783733810074,
        3.417641519114177]
}];