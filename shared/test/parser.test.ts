import * as fs from "fs-extra";
import { correctNodeDataArray, correctLinkDataArray, correctLinkDataArrayWithoutGraphical, correctNodeDataArrayWithoutGraphical, correctLinkDataArrayWithExtraData, correctNodeDataArrayWithExtraData } from "./componentModel.expectation";
import * as chai from "chai";
import * as parser from "../src/parser";
import { Model } from "../src/modelTypes";
import { Graphical } from "../src/graphicalTypes";
const should = chai.should();

describe("Test Parser", () => {

    test("Should get data from the model files", (done) => {
        let model = fs.readFileSync("./test/ressources/WorldHello.cxml").toString();
        parser.parseModel(model).then((data: Model) => {
            data.ComponentViewModelData.StateMachines[0].StateMachineData.length.should.eql(2);
            data.ComponentViewModelData.States[0].StateData.length.should.eql(5);
            done();
        });
    });

    test("Should get data from the graphical files", (done) => {
        let graphical = fs.readFileSync("./test/ressources/WorldHello_Graphical.xml").toString();
        parser.parseGraphical(graphical).then((data: Graphical) => {
            data.ComponentViewModelGraphicalData.States[0].StateGraphicalData.length.should.eql(5);
            data.ComponentViewModelGraphicalData.TransitionPatternStates.length.should.eql(1);
            done();
        });
    });
});