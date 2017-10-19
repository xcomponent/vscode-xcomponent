import * as TypeMoq from "typemoq";
import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ComponentCompletionItemProvider } from "../src/completion/ComponentCompletionItemProvider";
import * as chai from "chai";
import { parseStringSync } from "xml2js-parser";
import * as deepEql from "deep-eql";

const should = chai.should();

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");

const cxmlFileName = "TechTest.cxml";

describe("ComponentCompletionItemProvider Tests", () => {

    const stateIdCompletionTests = [
        { position: new vscode.Position(18, 20), hasSuggestion: true, expectedId: 18 },
        { position: new vscode.Position(19, 25), hasSuggestion: false }
    ];

    stateIdCompletionTests.forEach(test => {
        it(`should provide an id suggestion depending on the position in the cxml file`, () => {
            return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
                return vscode.window.showTextDocument(document);
            })
                .then(editor => {
                    const completionProvider = new ComponentCompletionItemProvider();
                    return completionProvider.provideCompletionItems(editor.document, test.position, null);
                }).then(completionItems => {
                    if (test.hasSuggestion) {
                        completionItems.length.should.eql(1);
                        completionItems[0].label.should.eql("18");
                    }
                    else {
                        should.fail(completionItems, undefined, "unexpected suggestion result");
                    }
                }, reason => {
                    if (test.hasSuggestion) {
                        console.error(reason);
                        should.fail(reason, undefined);
                    }
                });
        });
    });
});