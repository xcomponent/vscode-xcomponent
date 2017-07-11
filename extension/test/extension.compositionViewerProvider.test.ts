import * as TypeMoq from "typemoq";
import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as chai from "chai";
import { CompositionViewerProvider } from "../src/compositionViewerProvider";
import { parseStringSync } from "xml2js-parser";
import * as deepEql from "deep-eql";

const should = chai.should();


const inputPath = path.join(__dirname, "..", "..", "test", "inputs");
const outputPath = path.join(__dirname, "..", "..", "test", "outputs");

const xcmlFileName = "helloworld_Model.xcml";
const expectedPreviewHtmlFileName = "expectedCompositionPreview.html";
const otherInputFileName = "other_input.txt";
const expectedErrorHtmlFileName = "expectedError.html";

const todo = (htmlPreviewJson, htmlExpectedJson) => {
    const previewComponentsJson = JSON.parse(htmlPreviewJson.html.body[0].script[0].$.components);
    const previewCompositionJson = parseStringSync(htmlPreviewJson.html.body[0].script[0].$.composition);
    const expectedComponentsJson = JSON.parse(htmlExpectedJson.html.body[0].script[0].$.components);
    const expectedCompositionJson = parseStringSync(htmlExpectedJson.html.body[0].script[0].$.composition);
    deepEql(previewComponentsJson, expectedComponentsJson).should.equal(true);
    deepEql(previewCompositionJson, expectedCompositionJson).should.equal(true);
};

const todoError = (htmlPreviewJson, htmlExpectedJson) => {
    deepEql(htmlPreviewJson, htmlExpectedJson).should.equal(true);
};

describe("CompositionViewerProvider Tests", () => {

    const providerTests = [
        { input: xcmlFileName, expected: expectedPreviewHtmlFileName, todo: todo },
        { input: otherInputFileName, expected: expectedErrorHtmlFileName, todo: todoError }
    ];

    providerTests.forEach(test => {
        it(`Given ${test.input} as input file, should display ${test.expected} as html output`, () => {
            const expectedHtml = fs.readFileSync(path.join(outputPath, test.expected)).toString();
            return vscode.workspace.openTextDocument(path.join(inputPath, test.input)).then(document => {
                return vscode.window.showTextDocument(document);
            }).then(editor => {
                const extensionContextMock: TypeMoq.IMock<vscode.ExtensionContext> = TypeMoq.Mock.ofType<vscode.ExtensionContext>();
                extensionContextMock.setup(x => x.extensionPath).returns(() => "/test/extensionpath");
                const provider = new CompositionViewerProvider(extensionContextMock.object);
                const htmlPreview = provider.provideTextDocumentContent(null);
                const htmlPreviewJson = parseStringSync(htmlPreview);
                const htmlExpectedJson = parseStringSync(expectedHtml);
                test.todo(htmlPreviewJson, htmlExpectedJson);
            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });
});