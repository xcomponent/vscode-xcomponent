import * as expect from "expect";
import { Parser } from "../src/parser";
import * as fs from "fs-extra";
import { expectedLocations, expectedControlPointTransition, expectedControlPointTriggerable, expectedStateMachines, expectedStates, expectedTransitionPatternStates, expectedLinkDataArray, expectedFinalState, componentName, entryPointStateMachine } from "./parser.expectation";

describe("Test Parser", () => {

    let parser: Parser;
    let componentGraphicalModel, model, graphical;
    beforeEach(() => {
        model = fs.readFileSync("./test/WorldHello.cxml").toString();
        graphical = fs.readFileSync("./test/WorldHello_Graphical.xml").toString();
        parser = new Parser({ model, graphical });
        parser.promisifyParserString()
    });

    test("Test getLocationState method: should get the right locations of the state", (done) => {
        parser.promisifyParserString(graphical).then((graphicalJson) => {
            expect(graphicalJson).toNotBe(null);
            const locations = parser.getLocationState(graphicalJson);
            expect(locations).toEqual(expectedLocations);
            done();
        });
    });
    test("Test getControlPointTransition method: should get the right control points of the triggerable transition", (done) => {
        parser.promisifyParserString(graphical).then((graphicalJson) => {
            expect(graphicalJson).toNotBe(null);
            const controlPointTriggerable = parser.getControlPointTransition(graphicalJson.ComponentViewModelGraphicalData.TransversalLinks[0].TransitionGraphicalData);
            expect(controlPointTriggerable).toEqual(expectedControlPointTriggerable);
            done();
        });
    });

    test("Test getControlPointTransition method: should get the right control points of the transition", (done) => {
        parser.promisifyParserString(graphical).then((graphicalJson) => {
            expect(graphicalJson).toNotBe(null);
            const controlPointTransition = parser.getControlPointTransition(graphicalJson.ComponentViewModelGraphicalData.Links[0].TransitionGraphicalData);
            expect(controlPointTransition).toEqual(expectedControlPointTransition);
            done();
        });
    });

    test("Should get the right information from the model file", (done) => {
        parser.promisifyParserString(graphical).then((graphicalJson) => {
            parser.parseGraphical(graphicalJson);
            return parser.promisifyParserString(model);
        }).then((modelJson) => {
            expect(parser.getComponentName(modelJson)).toEqual(componentName);
            parser.setStateMachines(modelJson);
            expect(parser.getStateMachines()).toEqual(expectedStateMachines);
            parser.setStates(modelJson);
            expect(parser.getStates()).toEqual(expectedStates);
            expect(parser.getTransitionPatternStates()).toEqual(expectedTransitionPatternStates);
            expect(parser.getEntryPointStateMachine()).toEqual(entryPointStateMachine);
            parser.setLinks(modelJson);
            expect(parser.setFinalStates()).toEqual(expectedFinalState);
            parser.addControlPoint();
            expect(parser.getLinkDataArray()).toEqual(expectedLinkDataArray);
            done();
        });
    });

});