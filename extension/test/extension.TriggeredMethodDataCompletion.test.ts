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

describe("ComponentCompletionItemProvider Tests", () => {

    it(`should provide transition name suggestion when autocomplete is triggered on TransitionName (TriggeredMethodData attribute)`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(16, 89), null);
            }).then(completionItems => {
                completionItems.length.should.eql(13);
                completionItems[0].label.should.eql("ChooseTestTech");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

    it(`should provide triggering event suggestion when autocomplete is triggered on TriggeringEvent (TriggeredMethodData attribute)`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(16, 129), null);
            }).then(completionItems => {
                completionItems.length.should.eql(10);
                completionItems[0].label.should.eql("XComponent.TechTest.UserObject.InputData");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });

    it(`should provide TriggeredMethodData property suggestion when autocomplete is triggered in a TriggeredMethodData tag`, () => {
        return vscode.workspace.openTextDocument(path.join(inputPath, cxmlFileName)).then(document => {
            return vscode.window.showTextDocument(document);
        })
            .then(editor => {
                const completionProvider = new ComponentCompletionItemProvider();
                return completionProvider.provideCompletionItems(editor.document, new vscode.Position(16, 112), null);
            }).then(completionItems => {
                completionItems.length.should.eql(4);
                completionItems[0].label.should.eql("IsNodeInitializer");
                completionItems[1].label.should.eql("IsSelected");
                completionItems[2].label.should.eql("TransitionName");
                completionItems[3].label.should.eql("TriggeringEvent");
            }, reason => {
                console.error(reason);
                should.fail(reason, undefined);
            });
    });
});