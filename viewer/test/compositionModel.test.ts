import { CompositionModel } from "../src/compositionModel";
import * as fs from "fs-extra";
import { DrawComponentData } from "../src/gojsTemplates";
import { components, correctCompositionData } from "./compositionModel.expectation";
import { CompositionData } from "../src/compositionTypes";

import * as chai from "chai";
const should = chai.should();

describe("Test CompositionModel", () => {

    test("Should get the right data from the composition and the model files", (done) => {
        const compositionString = fs.readFileSync("./test/ressources/helloworld_Model.xcml").toString();
        const compositionModel = new CompositionModel(components, compositionString);

        compositionModel.load().then((data: CompositionData) => {
            data.should.eql(correctCompositionData);
            done();
        });
    });

    test("Should throw an error while parsing the composition file", (done) => {
        const compositionString = fs.readFileSync("./test/ressources/wrong_helloworld_Model.xcml").toString();
        const compositionModel = new CompositionModel(components, compositionString);
        compositionModel.load().then((data: CompositionData) => {
        }).catch((err) => {
            done();
        });
    });

});