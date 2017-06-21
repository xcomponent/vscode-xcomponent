import * as expect from "expect";
import { ComponentModelParser } from "../src/componentModelParser";
import * as fs from "fs-extra";
import { correctNodeDataArray, correctLinkDataArray, correctLinkDataArrayWithoutGraphical, correctNodeDataArrayWithoutGraphical, correctNodeDataArrayWithExtraState } from "./parser.expectation";
import { DrawComponentData } from "../src/gojsTemplates";

describe("Test Parser", () => {

    test("Should get the right data from the model and graphical files", (done) => {
        let parser: ComponentModelParser;
        let model, graphical;
        model = fs.readFileSync("./test/ressources/WorldHello.cxml").toString();
        graphical = fs.readFileSync("./test/ressources/WorldHello_Graphical.xml").toString();
        parser = new ComponentModelParser({ model, graphical });

        parser.parse().then((data: DrawComponentData) => {
            expect(data.nodeDataArray).toEqual(correctNodeDataArray);
            expect(data.linkDataArray).toEqual(correctLinkDataArray);
            done();
        });
    });

    test("Should throw an error while parsing invalid model files.", (done) => {
        let parser: ComponentModelParser;
        let model, graphical;
        model = fs.readFileSync("./test/ressources/Wrong_WorldHello.cxml").toString();
        graphical = fs.readFileSync("./test/ressources/Wrong_WorldHello_Graphical.xml").toString();
        parser = new ComponentModelParser({ model, graphical });
        parser.parse().catch((err) => {
            done();
        });
    });

    test("Should parse without graphical file", (done) => {
        let parser: ComponentModelParser;
        let model, graphical = undefined;
        model = fs.readFileSync("./test/ressources/WorldHello_without_graphical.cxml").toString();
        parser = new ComponentModelParser({ model, graphical });
        parser.parse().then((data) => {
            expect(correctLinkDataArrayWithoutGraphical).toEqual(data.linkDataArray);
            expect(correctNodeDataArrayWithoutGraphical).toEqual(data.nodeDataArray);
            done();
        });
    });

    test("Should parse a cxml file with extra data and without graphical file", (done) => {
        let parser: ComponentModelParser;
        let model, graphical = undefined;
        model = fs.readFileSync("./test/ressources/WorldHello_with_extra_data.cxml").toString();
        parser = new ComponentModelParser({ model, graphical });
        parser.parse().then((data) => {
            expect(correctLinkDataArrayWithoutGraphical).toEqual(data.linkDataArray);
            expect(correctNodeDataArrayWithExtraState).toEqual(data.nodeDataArray);
            done();
        });
    });


});