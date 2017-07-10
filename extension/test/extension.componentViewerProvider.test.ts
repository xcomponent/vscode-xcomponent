import * as TypeMoq from "typemoq";
import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import * as path from "path";
import * as fs from "fs";
import { ComponentViewerProvider } from "../src/componentViewerProvider";
import * as chai from "chai";
const should = chai.should();

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");
const outputPath = path.join(__dirname, "..", "..", "test", "outputs");

const cxmlFileName = "TechTest.cxml";
const expectedPreviewHtmlFileName = "expectedPreview.html";
const otherInputFileName = "other_input.txt";
const expectedErrorHtmlFileName = "expectedError.html";

describe("ComponentViewerProvider Tests", () => {

    const providerTests = [
        { input: otherInputFileName, expected: expectedErrorHtmlFileName },
        { input: cxmlFileName, expected: expectedPreviewHtmlFileName }
    ];

    providerTests.forEach(test => {
        it(`Given ${test.input} as input file, should display ${test.expected} as html output`, () => {
            const expectedHtml = fs.readFileSync(path.join(outputPath, expectedErrorHtmlFileName)).toString().replace(/\r/g, "");
            return vscode.workspace.openTextDocument(path.join(inputPath, otherInputFileName)).then(document => {
                return vscode.window.showTextDocument(document);
            }).then(editor => {
                const extensionContextMock: TypeMoq.IMock<vscode.ExtensionContext> = TypeMoq.Mock.ofType<vscode.ExtensionContext>();
                extensionContextMock.setup(x => x.extensionPath).returns(() => "/test/extensionpath");
                const provider = new ComponentViewerProvider(extensionContextMock.object);
                const htmlPreview = provider.provideTextDocumentContent(null).replace(/\r/g, "");
                htmlPreview.should.equal(expectedHtml);
            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });
});