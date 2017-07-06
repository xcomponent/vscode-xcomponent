export const components = {
    "HelloWorld": {
        "1": {
            "name": "HelloWorldManager",
            "states": {
                "1": "EntryPoint"
            }
        },
        "2": {
            "name": "HelloResponse",
            "states": {
                "2": "Done"
            }
        }
    }
};

export const correctCompositionData = {
    "linkDataArray": [
        {
            "from": "HelloWorld",
            "fromPort": "HelloWorld&HelloResponse&Done&out",
            "to": "helloworldApi",
            "toPort": "1&in",
            "text": "Done to helloworldApi"
        },
        {
            "from": "helloworldApi",
            "fromPort": "1&out",
            "to": "HelloWorld",
            "toPort": "HelloWorld&HelloWorldManager&EntryPoint",
            "text": "helloworldApi to EntryPoint"
        }
    ],
    "apiPortCounter": {
        "helloworldApi": {
            "in": 2,
            "out": 2
        }
    },
    "components": {
        "HelloWorld": {
            "1": {
                "name": "HelloWorldManager",
                "states": {
                    "1": "EntryPoint"
                }
            },
            "2": {
                "name": "HelloResponse",
                "states": {
                    "2": "Done"
                }
            }
        }
    }
}