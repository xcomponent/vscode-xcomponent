import * as TypeMoq from "typemoq";
import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ComponentCompletionItemProvider } from "../src/completion/componentCompletionItemProvider";
import * as chai from "chai";
import { parseStringSync } from "xml2js-parser";
import * as deepEql from "deep-eql";

const should = chai.should();

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");

const cxmlFileName = "TechTest.cxml";

describe("StateMachineCompletionItemProvider Tests", () => {

    const stateMchineIdCompletionTests = [
        { position: new vscode.Position(4, 10), hasSuggestion: true, expectedId: 3 }
    ];

    stateMchineIdCompletionTests.forEach(test => {
        it(`should provide a state machine id suggestion depending on the position in the cxml file`, () => {
            return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
                return vscode.window.showTextDocument(document);
            })
                .then(editor => {
                    const completionProvider = new ComponentCompletionItemProvider();
                    return completionProvider.provideCompletionItems(editor.document, test.position, null);
                }).then(completionItems => {
                    if (test.hasSuggestion) {
                        completionItems.length.should.eql(1);
                        completionItems[0].label.should.eql("3");
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

    it(`should provide StateMachineData property suggestion when autocomplete is triggered in a StateMachineData tag`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(4, 13), null);
            }).then(completionItems => {
                completionItems.length.should.eql(4);
                completionItems[0].label.should.eql("Id");
                completionItems[1].label.should.eql("Name");
                completionItems[2].label.should.eql("PublicMember");
                completionItems[3].label.should.eql("InternalMember");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

});