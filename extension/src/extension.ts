import * as vscode from "vscode";
import * as path from "path";
import { ComponentViewerProvider } from "./componentViewerProvider";

export function activate(context: vscode.ExtensionContext) {
    let previewUri = vscode.Uri.parse("xc-preview://xcomponent/component-preview");

    let provider = new ComponentViewerProvider(context);
    let registration = vscode.workspace.registerTextDocumentContentProvider("xc-preview", provider);

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        if (e.document === vscode.window.activeTextEditor.document) {
            provider.update(previewUri);
        }
    });

    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
        provider.update(previewUri);
    });

    const disposable = vscode.commands.registerCommand("xcomponent.preview", () => {
        return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Component preview").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(disposable, registration);
}