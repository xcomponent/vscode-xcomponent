export const expectedLocations = {
    "1": {
        "x": 145,
        "y": -78
    },
    "2": {
        "x": 546,
        "y": 24
    },
    "3": {
        "x": 919,
        "y": -138
    },
    "4": {
        "x": 745,
        "y": 20
    },
    "5": {
        "x": 607,
        "y": -127.33333333333334
    },
    "6": {
        "x": 890,
        "y": 0
    }
};

export const expectedControlPointTransition = {
    "1": {
        "firstPoint": {
            "x": 565.903158875305,
            "y": 43.461781309980324
        },
        "firstControlPoint": {
            "x": 604.2717568971972,
            "y": -12.35004992622192
        },
        "secondControlPoint": {
            "x": 684.0046730402405,
            "y": -6.615324290958256
        },
        "lastPoint": {
            "x": 752.6482403717195,
            "y": 44.61813950716779
        }
    },
    "2": {
        "firstPoint": {
            "x": 179.20930996076106,
            "y": -56.79101659280864
        },
        "firstControlPoint": {
            "x": 317.31123869371106,
            "y": -249.30318626997376
        },
        "secondControlPoint": {
            "x": 436.272154163274,
            "y": -234.8266592781731
        },
        "lastPoint": {
            "x": 555.6249187347512,
            "y": 43.67467761240422
        }
    },
    "5": {
        "firstPoint": {
            "x": 690.9678774654012,
            "y": -103.75015274385868
        },
        "firstControlPoint": {
            "x": 762.7945093568703,
            "y": -153.37771935389367
        },
        "secondControlPoint": {
            "x": 838.961806141515,
            "y": -158.98632689100384
        },
        "lastPoint": {
            "x": 922.6553540869479,
            "y": -112.2887149958318
        }
    },
    "7": {
        "firstPoint": {
            "x": 764.4381399135601,
            "y": 38.501533356129904
        },
        "firstControlPoint": {
            "x": 793.1127056422748,
            "y": -25.33531884348009
        },
        "secondControlPoint": {
            "x": 842.7566233168754,
            "y": -26.30140441768713
        },
        "lastPoint": {
            "x": 895.480004358779,
            "y": 22.859402306549725
        }
    }
};

export const expectedControlPointTriggerable = {
    "3": {
        "firstPoint": {
            "x": 561.6080387660304,
            "y": 42.4747972039303
        },
        "firstControlPoint": {
            "x": 565.8987616780212,
            "y": -45.03776123817483
        },
        "secondControlPoint": {
            "x": 635.3253206132188,
            "y": -39.83979806154872
        },
        "lastPoint": {
            "x": 647.783733810074,
            "y": 3.417641519114177
        }
    },
    "6": {
        "firstPoint": {
            "x": 683.0567636287167,
            "y": -108.68175229094362
        },
        "firstControlPoint": {
            "x": 696.1133311981484,
            "y": -182.9564730403514
        },
        "secondControlPoint": {
            "x": 759.4102292422128,
            "y": -184.59185790508192
        },
        "lastPoint": {
            "x": 801.997480039458,
            "y": -144.48411953953965
        }
    }
};

export const expectedStateMachines = {
    "StateMachine1": {
        "name": "Manager",
        "publicMember": undefined
    },
    "StateMachine2": {
        "name": "Reponse",
        "publicMember": "XComponent.WorldHello.UserObject.Reponse"
    }
};

export const expectedStates = {
    "State1": {
        "name": "EntryPoint",
        "group": "Manager",
        "key": "Manager&EntryPoint",
        "isFinal": true,
        "isEntryPoint": true
    },
    "State2": {
        "name": "first",
        "group": "Reponse",
        "key": "Reponse&first",
        "isFinal": true,
        "isEntryPoint": false
    },
    "State3": {
        "name": "Done",
        "group": "Reponse",
        "key": "Reponse&Done",
        "isFinal": true,
        "isEntryPoint": false
    },
    "State4": {
        "name": "second",
        "group": "Reponse",
        "key": "Reponse&second",
        "isFinal": true,
        "isEntryPoint": false
    },
    "State6": {
        "name": "Third",
        "group": "Reponse",
        "key": "Reponse&Third",
        "isFinal": true,
        "isEntryPoint": false
    }
};

export const expectedTransitionPatternStates = {
    "TP_State5": {
        "name": "FirstSecondThirdPatternState",
        "group": "Reponse",
        "key": "Reponse&FirstSecondThirdPatternState",
        "isFinal": true,
        "isPatternTransitionState": true,
        "selectedStatesKeys": [
            "State2",
            "State4",
            "State6"
        ]
    }
};

export const expectedLinkDataArray = [{
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

export const expectedFinalState = ["Reponse&Done"];

export const componentName = "WorldHello";

export const entryPointStateMachine = "Manager";