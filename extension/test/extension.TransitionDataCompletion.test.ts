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

describe("TransitionDataCompletionItemProvider Tests", () => {

    it(`should provide a transition id suggestion`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(71, 24), null);
            }).then(completionItems => {
                completionItems.length.should.eql(1);
                completionItems[0].label.should.eql("16");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

    it(`should provide TransitionData property suggestion when autocomplete is triggered in a TransitionData tag`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(71, 27), null);
            }).then(completionItems => {
                completionItems.length.should.eql(9);
                completionItems[0].label.should.eql("Id");
                completionItems[1].label.should.eql("Name");
                completionItems[2].label.should.eql("FromKey");
                completionItems[3].label.should.eql("ToKey");
                completionItems[4].label.should.eql("Type");
                completionItems[5].label.should.eql("ExecutionDelay");
                completionItems[6].label.should.eql("SetCustomTimeout");
                completionItems[7].label.should.eql("TriggeringEvent");
                completionItems[8].label.should.eql("UserSpecificRule");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

    const keyTests = [
        { input: new vscode.Position(71, 58) },
        { input: new vscode.Position(71, 73) }
    ];

    keyTests.forEach(test => {
        it(`should provide FromKey/ToKey suggestion with state description when autocomplete is triggered in FromKey/ToKey attribute`, () => {
            return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
                return vscode.window.showTextDocument(document);
            })
                .then(editor => {
                    const completionProvider = new ComponentCompletionItemProvider();
                    return completionProvider.provideCompletionItems(editor.document, new vscode.Position(71, 58), null);
                }).then(completionItems => {
                    completionItems.length.should.eql(10);
                    completionItems[0].insertText.should.eql("State1");
                    completionItems[0].filterText.should.eql("State1");
                    completionItems[0].label.should.eql("EntryPoint");
                    completionItems[9].insertText.should.eql("State7");
                    completionItems[9].filterText.should.eql("State7");
                    completionItems[9].label.should.eql("SendingEmails");
                }, reason => {
                    console.error(reason);
                    should.fail(reason, undefined);
                });
        });
    });

});