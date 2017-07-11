import { ComponentModel } from "../src/componentModel";
import * as fs from "fs-extra";
import { correctNodeDataArray, correctLinkDataArray, correctLinkDataArrayWithoutGraphical, correctNodeDataArrayWithoutGraphical, correctLinkDataArrayWithExtraData, correctNodeDataArrayWithExtraData } from "./componentModel.expectation";
import { DrawComponentData } from "../src/gojsTemplates";
import * as chai from "chai";
const should = chai.should();

describe("Test ComponentModel", () => {

    test("Should get the right data from the model and graphical files", (done) => {
        let componentModel: ComponentModel;
        let model, graphical;
        model = fs.readFileSync("./test/ressources/WorldHello.cxml").toString();
        graphical = fs.readFileSync("./test/ressources/WorldHello_Graphical.xml").toString();
        componentModel = new ComponentModel({ model, graphical });

        componentModel.load().then((data: DrawComponentData) => {
            data.nodeDataArray.should.eql(correctNodeDataArray);
            data.linkDataArray.should.eql(correctLinkDataArray);
            done();
        });
    });

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

});