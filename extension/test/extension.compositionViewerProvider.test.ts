import * as TypeMoq from "typemoq";
import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as chai from "chai";
import { CompositionViewerProvider } from "../src/compositionViewerProvider";
import { HtmlDiffer } from "html-differ";


const htmlDiffer = new HtmlDiffer({});

const should = chai.should();


const inputPath = path.join(__dirname, "..", "..", "test", "inputs");
const outputPath = path.join(__dirname, "..", "..", "test", "outputs");

const xcmlFileName = "helloworld_Model.xcml";
const expectedPreviewHtmlFileName = "expectedCompositionPreview.html";
const otherInputFileName = "other_input.txt";
const expectedErrorHtmlFileName = "expectedError.html";


describe("CompositionViewerProvider Tests", () => {

    const providerTests = [
        { input: xcmlFileName, expected: expectedPreviewHtmlFileName },
        { input: otherInputFileName, expected: expectedErrorHtmlFileName }
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
                htmlDiffer.isEqual(htmlPreview, expectedHtml).should.eql(true);

            }, reason => {
                should.fail(reason, undefined);
            });
        });
    });
});