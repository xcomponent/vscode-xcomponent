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

describe("TransversalTransitionDataCompletionItemProvider Tests", () => {

    it(`should provide a transversal transition id suggestion`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(112, 35), null);
            }).then(completionItems => {
                completionItems.length.should.eql(1);
                completionItems[0].label.should.eql("100");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

    it(`should provide TransversalTransitionData property suggestion when autocomplete is triggered in a TransversalTransitionData tag`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(112, 39), null);
            }).then(completionItems => {
                completionItems.length.should.eql(6);
                completionItems[0].label.should.eql("Id");
                completionItems[1].label.should.eql("Name");
                completionItems[2].label.should.eql("FromKey");
                completionItems[3].label.should.eql("ToId");
                completionItems[4].label.should.eql("SelectAllTransitions");
                completionItems[5].label.should.eql("Type");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

    it(`should provide state key suggestion when autocomplete is triggered in FromKey attribute`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(112, 56), null);
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

    it(`should provide transition id suggestion when autocomplete is triggered in ToId attribute`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(112, 70), null);
            }).then(completionItems => {
                completionItems.length.should.eql(13);
                completionItems[0].insertText.should.eql("2");
                completionItems[0].filterText.should.eql("2");
                completionItems[0].label.should.eql("ChooseTestTech");
                completionItems[12].insertText.should.eql("10");
                completionItems[12].filterText.should.eql("10");
                completionItems[12].label.should.eql("TranferInterviewInfos");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

});