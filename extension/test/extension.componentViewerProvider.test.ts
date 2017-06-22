import * as TypeMoq from "typemoq";
import * as vscode from "vscode";
import { ExtensionContext } from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { ComponentViewerProvider } from "../src/componentViewerProvider";
import * as chai from "chai";
const should = chai.should();


const cxmlFile = path.join(__dirname, "..", "..", "test", "inputs", "TechTest.cxml");
const expectedPreviewHtmlFile = path.join(__dirname, "..", "..", "test", "outputs", "expectedPreview.html");
const otherInputFile = path.join(__dirname, "..", "..", "test", "inputs", "other_input.txt");
const expectedErrorHtmlFile = path.join(__dirname, "..", "..", "test", "outputs", "expectedError.html");

suite("ComponentViewerProvider Tests", () => {

    const testProvideTextDocumentContent = (modelFilePath: string) => {
        const expectedHtml = fs.readFileSync(expectedErrorHtmlFile).toString();
        return vscode.workspace.openTextDocument(otherInputFile).then(document => {
            return vscode.window.showTextDocument(document);
        }).then(editor => {
            const extensionContextMock: TypeMoq.IMock<vscode.ExtensionContext> = TypeMoq.Mock.ofType<vscode.ExtensionContext>();
            extensionContextMock.setup(x => x.extensionPath).returns(() => "/test/extensionpath");
            const provider = new ComponentViewerProvider(extensionContextMock.object);
            return provider.provideTextDocumentContent(null);
        });
    };

    test("Show preview command on non cxml document should display an error html", () => {
        const expectedHtml = fs.readFileSync(expectedErrorHtmlFile).toString();
        return testProvideTextDocumentContent(expectedErrorHtmlFile).then(htmlPreview => {
            htmlPreview.should.equal(expectedHtml);
        }, reason => {
            should.fail(reason, undefined, "Viewer provider failed", "");
        });
    });

    test("Show preview command on cxml document should display a preview html", () => {
        const expectedHtml = fs.readFileSync(expectedPreviewHtmlFile).toString();
        return vscode.workspace.openTextDocument(cxmlFile).then(document => {
            return vscode.window.showTextDocument(document);
        }).then(editor => {
            const extensionContextMock: TypeMoq.IMock<vscode.ExtensionContext> = TypeMoq.Mock.ofType<vscode.ExtensionContext>();
            extensionContextMock.setup(x => x.extensionPath).returns(() => "/test/extensionpath");
            const provider = new ComponentViewerProvider(extensionContextMock.object);
            const htmlPreview = provider.provideTextDocumentContent(null);
            htmlPreview.should.equal(expectedHtml);
        }, reason => {
            should.fail(reason, undefined, "Viewer provider failed", "");
        });
    });
});