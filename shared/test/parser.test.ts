import * as fs from "fs-extra";
import { correctNodeDataArray, correctLinkDataArray, correctLinkDataArrayWithoutGraphical, correctNodeDataArrayWithoutGraphical, correctLinkDataArrayWithExtraData, correctNodeDataArrayWithExtraData } from "./componentModel.expectation";
import * as chai from "chai";
import * from "../src/parser";
import { Model } from "../src/modelTypes";
const should = chai.should();

describe("Test Parser", () => {

    test("Should get the right data from the model files", (done) => {
        let model;
        model = fs.readFileSync("./test/ressources/WorldHello.cxml").toString();

        parseModel(model).then((data: Model) => {
            console.log(data);
            done();
        });
    });
/*
    test("Should throw an error while parsing invalid model files.", (done) => {
        let componentModel: ComponentModel;
        let model, graphical;
        model = fs.readFileSync("./test/ressources/Wrong_WorldHello.cxml").toString();
        graphical = fs.readFileSync("./test/ressources/Wrong_WorldHello_Graphical.xml").toString();
        componentModel = new ComponentModel({ model, graphical });
        componentModel.load().catch((err) => {
            done();
        });
    });

    test("Should parse without graphical file", (done) => {
        let componentModel: ComponentModel;
        let model, graphical = undefined;
        model = fs.readFileSync("./test/ressources/WorldHello_without_graphical.cxml").toString();
        componentModel = new ComponentModel({ model, graphical });
        componentModel.load().then((data: DrawComponentData) => {
            correctLinkDataArrayWithoutGraphical.should.eql(data.linkDataArray);
            correctNodeDataArrayWithoutGraphical.should.eql(data.nodeDataArray);
            done();
        });
    });

    test("Should parse a cxml file with extra data", (done) => {
        let componentModel: ComponentModel;
        let model, graphical = undefined;
        model = fs.readFileSync("./test/ressources/WorldHello_with_extra_data.cxml").toString();
        componentModel = new ComponentModel({ model, graphical });
        componentModel.load().then((data: DrawComponentData) => {
            correctNodeDataArrayWithExtraData.should.eql(data.nodeDataArray);
            correctLinkDataArrayWithExtraData.should.eql(data.linkDataArray);
            done();
        });
    });
*/

});