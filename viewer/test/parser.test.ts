import * as expect from "expect";
import { ComponentModelParser } from "../src/componentModelParser";
import * as fs from "fs-extra";
import { correctNodeDataArray, correctLinkDataArray } from "./parser.expectation";
import {DrawComponentData } from "../src/gojsTemplates";

describe("Test Parser", () => {

    test("Should get the right data from the model and graphical files", (done) => {
        let parser: ComponentModelParser;
        let componentGraphicalModel, model, graphical;
        model = fs.readFileSync("./test/ressources/WorldHello.cxml").toString();
        graphical = fs.readFileSync("./test/ressources/WorldHello_Graphical.xml").toString();
        parser = new ComponentModelParser({ model, graphical });

        parser.parse().then((data: DrawComponentData) => {
            expect(data.nodeDataArray).toEqual(correctNodeDataArray);
            expect(data.linkDataArray).toEqual(correctLinkDataArray);
            done();
        });
    });

    test("Should throw an error while parsing", (done) => {
        let parser: ComponentModelParser;
        let componentGraphicalModel, model, graphical;
        model = fs.readFileSync("./test/ressources/Wrong_WorldHello.cxml").toString();
        graphical = fs.readFileSync("./test/ressources/Wrong_WorldHello_Graphical.xml").toString();
        parser = new ComponentModelParser({ model, graphical });
        parser.parse().catch((err) => {
            done();
        });
    });

});