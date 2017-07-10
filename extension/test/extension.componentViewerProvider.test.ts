import * as TypeMoq from "typemoq";
import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ComponentViewerProvider } from "../src/componentViewerProvider";
import * as chai from "chai";
import { parseStringSync } from "xml2js-parser";
import * as deepEql from "deep-eql";

const should = chai.should();

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");
const outputPath = path.join(__dirname, "..", "..", "test", "outputs");

const cxmlFileName = "TechTest.cxml";
const expectedPreviewHtmlFileName = "expectedPreview.html";
const otherInputFileName = "other_input.txt";
const expectedErrorHtmlFileName = "expectedError.html";

const todo = (htmlPreviewJson, htmlExpectedJson) => {
    const previewModelJson = parseStringSync(htmlPreviewJson.html.body[0].script[0].$.model);
    const expectedModelJson = parseStringSync(htmlExpectedJson.html.body[0].script[0].$.model);
    const expectedGraphicalJson = parseStringSync(htmlExpectedJson.html.body[0].script[0].$.graphical);
    const previewGraphicalJson = parseStringSync(htmlPreviewJson.html.body[0].script[0].$.graphical);
    deepEql(previewModelJson, expectedModelJson).should.equal(true);
    deepEql(previewGraphicalJson, expectedGraphicalJson).should.equal(true);
};

const todoError = (htmlPreviewJson, htmlExpectedJson) => {
    deepEql(htmlPreviewJson, htmlExpectedJson).should.equal(true);
};

describe("ComponentViewerProvider Tests", () => {

    const providerTests = [
        { input: otherInputFileName, expected: expectedErrorHtmlFileName, todo: todoError },
        { input: cxmlFileName, expected: expectedPreviewHtmlFileName, todo: todo }
    ];

    providerTests.forEach(test => {
        it(`Given ${test.input} as input file, should display ${test.expected} as html output`, () => {
            const expectedHtml = fs.readFileSync(path.join(outputPath, test.expected)).toString();
            return vscode.workspace.openTextDocument(path.join(inputPath, test.input)).then(document => {
                return vscode.window.showTextDocument(document);
            }).then(editor => {
                const extensionContextMock: TypeMoq.IMock<vscode.ExtensionContext> = TypeMoq.Mock.ofType<vscode.ExtensionContext>();
                extensionContextMock.setup(x => x.extensionPath).returns(() => "/test/extensionpath");
                const provider = new ComponentViewerProvider(extensionContextMock.object);
                const htmlPreview = provider.provideTextDocumentContent(null).replace(/\r/g, "");
                const htmlPreviewJson = parseStringSync(htmlPreview);
                const htmlExpectedJson = parseStringSync(expectedHtml);
                test.todo(htmlPreviewJson, htmlExpectedJson);
            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });
});