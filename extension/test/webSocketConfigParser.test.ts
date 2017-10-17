import * as path from "path";
import { getServerUrl } from "../src/webSocketConfigParser";
import * as chai from "chai";
import * as deepEql from "deep-eql";

describe("webSocketConfigParser test", () => {
    it(`Given a configuration file as input , should get the right websocket server url as output`, () => {
        const inputPath = path.join(__dirname, "..", "..", "test", "inputs", "HelloWorld_Deployment_Configuration.xml");
        const serverUrl = getServerUrl(inputPath);
        deepEql(serverUrl, "wss://localhost:443").should.equal(true);        
    });
});