import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ComponentModelProvider } from "../src/componentModelProvider";
import * as chai from "chai";
const should = chai.should();

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");

const cxmlFileName = "TechTest.cxml";
const graphicalFileName = "TechTest_Graphical.xml";

const cxmlWithoutGraphicalFileName = "ModelWithoutGraphical.cxml";

const otherInputFileName = "other_input.txt";

interface GetModelInputData {
    input: string;
    expectModel: boolean;
    expectedGraphical?: string;
}

describe("ComponentModelProvider Tests", () => {

    const getModelTests: Array<GetModelInputData> = [
        { input: cxmlFileName, expectModel: true, expectedGraphical: graphicalFileName },
        { input: cxmlWithoutGraphicalFileName, expectModel: true },
        { input: otherInputFileName, expectModel: false }
    ];

    getModelTests.forEach(test => {
        const graphicalTestLabel = test.expectedGraphical === undefined ? "" : ` with graphical details (${test.expectedGraphical})`;
        it(`Given ${test.input} as input file, getModel should return ${test.expectModel ? "the model as string" : "undefined"} ${graphicalTestLabel}`, () => {
            return vscode.workspace.openTextDocument(path.join(inputPath, test.input)).then(document => {
                return vscode.window.showTextDocument(document);
            }).then(editor => {
                let componentModelProvider = new ComponentModelProvider();
                const rawModel = componentModelProvider.getRawModel();
                if (test.expectModel) {
                    const expectedModel = fs.readFileSync(path.join(inputPath, test.input)).toString();
                    rawModel.model.should.equal(expectedModel);
                    if (test.expectedGraphical) {
                        const expectedGraphicalModel = fs.readFileSync(path.join(inputPath, test.expectedGraphical)).toString();
                        rawModel.graphical.should.equal(expectedGraphicalModel);
                    }
                    else {
                        should.not.exist(rawModel.graphical);
                    }
                }
                else {
                    should.not.exist(rawModel);
                }
            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });

    const isCxmlDocumentTests = [
        { input: cxmlFileName, expect: true },
        { input: otherInputFileName, expect: false }
    ];

    isCxmlDocumentTests.forEach(test => {
        it(`Given ${test.input} as input file, isCxml should return ${test.expect}`, () => {
            return vscode.workspace.openTextDocument(path.join(inputPath, test.input)).then(document => {
                return vscode.window.showTextDocument(document);
            }).then(editor => {
                let componentModelProvider = new ComponentModelProvider();
                componentModelProvider.isCxmlDocument().should.equal(test.expect);
            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });

    it("If no document is opened, isCxml should return false", () => {
        return vscode.commands.executeCommand("workbench.action.closeAllEditors")
            .then(() => {
                let componentModelProvider = new ComponentModelProvider();
                componentModelProvider.isCxmlDocument().should.be.false;
            }, reason => {
                should.fail(reason, undefined);
            });
    });
});