import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ComponentModelProvider } from "../src/componentModelProvider";
import * as chai from "chai";
import { CompositionModelProvider } from "../src/compositionModelProvider";
import { parseStringSync } from "xml2js-parser";
import * as deepEql from "deep-eql";

const should = chai.should();

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");
const outputPath = path.join(__dirname, "..", "..", "test", "outputs");


const xcmlFileName = "helloworld_Model.xcml";
const componentsFileName = "expectedComponentData.json";
const otherInputFileName = "other_input.txt";

interface GetCompositionInputData {
    input: string;
    expectComposition: boolean;
    expectedComponentsData?: string;
}

describe("CompositionModelProvider Tests", () => {

    const getModelTests: Array<GetCompositionInputData> = [
        { input: xcmlFileName, expectedComponentsData: componentsFileName, expectComposition: true },
        { input: otherInputFileName, expectComposition: false }
    ];

    getModelTests.forEach(test => {
        it(`Given ${test.input} as input file, getComposition and getComponentsData should return the right data`, () => {
            return vscode.workspace.openTextDocument(path.join(inputPath, test.input)).then(document => {
                return vscode.window.showTextDocument(document);
            }).then(editor => {
                const componentModelProvider = new CompositionModelProvider();
                const composition = componentModelProvider.getComposition();
                const componentsData = componentModelProvider.getComponentsData();

                if (test.expectComposition) {
                    const compositionJson = parseStringSync(composition);
                    const expectedComposition = fs.readFileSync(path.join(inputPath, test.input)).toString();
                    const expectedCompositionJson = parseStringSync(expectedComposition);
                    deepEql(compositionJson, expectedCompositionJson).should.equal(true);
                    const expectedComponentsData = JSON.parse(fs.readFileSync(path.join(outputPath, test.expectedComponentsData)).toString());
                    deepEql(componentsData, expectedComponentsData).should.equal(true);
                } else {
                    should.not.exist(composition);
                    should.not.exist(componentsData);
                }
            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });

    const isCxmlDocumentTests = [
        { input: xcmlFileName, expect: true },
        { input: otherInputFileName, expect: false }
    ];

    isCxmlDocumentTests.forEach(test => {
        it(`Given ${test.input} as input file, isXcmlDocument should return ${test.expect}`, () => {
            return vscode.workspace.openTextDocument(path.join(inputPath, test.input)).then(document => {
                return vscode.window.showTextDocument(document);
            }).then(editor => {
                const componentModelProvider = new CompositionModelProvider();
                componentModelProvider.isXcmlDocument().should.equal(test.expect);
            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });

    it("If no document is opened, isXcmlDocument should return false", () => {
        return vscode.commands.executeCommand("workbench.action.closeAllEditors")
            .then(() => {
                const componentModelProvider = new CompositionModelProvider();
                componentModelProvider.isXcmlDocument().should.be.false;
            }, reason => {
                should.fail(reason, undefined);
            });
    });
});