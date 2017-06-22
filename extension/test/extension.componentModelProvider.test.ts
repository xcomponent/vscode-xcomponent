import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { ComponentModelProvider } from "../src/componentModelProvider";
import * as chai from "chai";
const should = chai.should();

const cxmlFile = path.join(__dirname, "..", "..", "test", "inputs", "TechTest.cxml");
const graphicalFile = path.join(__dirname, "..", "..", "test", "inputs", "TechTest_Graphical.xml");

const cxmlWithoutGraphicalFile = path.join(__dirname, "..", "..", "test", "inputs", "ModelWithoutGraphical.cxml");

const otherInputFile = path.join(__dirname, "..", "..", "test", "inputs", "other_input.txt");

suite("ComponentModelProvider Tests", () => {

    const testGetModel = (modelFilePath: string) => {
        return vscode.workspace.openTextDocument(modelFilePath).then(document => {
            return vscode.window.showTextDocument(document);
        }).then(editor => {
            let componentModelProvider = new ComponentModelProvider();
            return componentModelProvider.getRawModel();
        });
    };

    test("Given a cxml files opened in vscode associated with a graohical file, getModel should return models as string", () => {
        const expectedModel = fs.readFileSync(cxmlFile).toString();
        const expectedGraphicalModel = fs.readFileSync(graphicalFile).toString();

        return testGetModel(cxmlFile).then(rawModel => {
            rawModel.model.should.equal(expectedModel);
            rawModel.graphical.should.equal(expectedGraphicalModel);
        }, reason => {
            should.fail(reason, undefined, "Raw model provider failed", "");
        });
    });

    test("Given a cxml files opened in vscode without a graohical file, getModel should return a component model as string without graphical", () => {
        const expectedModel = fs.readFileSync(cxmlWithoutGraphicalFile).toString();

        return testGetModel(cxmlWithoutGraphicalFile).then(rawModel => {
            rawModel.model.should.equal(expectedModel);
            should.not.exist(rawModel.graphical);
        }, reason => {
            should.fail(reason, undefined, "Raw model provider failed", "");
        });
    });

    test("Given a non cxml files opened in vscode without a graohical file, getModel should return undefined", () => {
        return testGetModel(otherInputFile).then(rawModel => {
            should.not.exist(rawModel);
        }, reason => {
            should.fail(reason, undefined, "Raw model provider failed", "");
        });
    });

    const testIsCxmlDocument = (modelFilePath: string, expectedValue: boolean) => {
        return vscode.workspace.openTextDocument(modelFilePath).then(document => {
            return vscode.window.showTextDocument(document);
        }).then(editor => {
            let componentModelProvider = new ComponentModelProvider();
            componentModelProvider.isCxmlDocument().should.equal(expectedValue);
        }, reason => {
            should.fail(reason, undefined, "Raw model provider failed", "");
        });
    };

    test("Given a cxml files opened in vscode, isCxml should return true", () => {
        return testIsCxmlDocument(cxmlFile, true);
    });

    test("Given a non cxml files opened in vscode, isCxml should return false", () => {
        return testIsCxmlDocument(otherInputFile, false);
    });

    test("If no document is opened, isCxml should return false", () => {
        return vscode.commands.executeCommand("workbench.action.closeAllEditors")
            .then(() => {
                let componentModelProvider = new ComponentModelProvider();
                componentModelProvider.isCxmlDocument().should.be.false;
            }, reason => {
                should.fail(reason, undefined, "Raw model provider failed", "");
            });
    });
});