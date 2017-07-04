import * as vscode from "vscode";
import * as path from "path";
import { ComponentViewerProvider } from "./componentViewerProvider";
import { CompositionViewerProvider } from "./compositionViewerProvider";

const xcmlExtension = ".xcml";
const cxmlExtension = ".cxml";

export function activate(context: vscode.ExtensionContext) {
    const previewUri = vscode.Uri.parse("xc-preview://xcomponent/component-preview");
    const previewUriComposition = vscode.Uri.parse("xc-preview-composition://xcomponent/composition-preview");

    const compositionProvider = new CompositionViewerProvider(context);
    const compositionRegistration = vscode.workspace.registerTextDocumentContentProvider("xc-preview-composition", compositionProvider);

    const componentProvider = new ComponentViewerProvider(context);
    const registration = vscode.workspace.registerTextDocumentContentProvider("xc-preview", componentProvider);

    const update = (e) => {
        if (e.document === vscode.window.activeTextEditor.document) {
            if (e.document.fileName.endsWith(cxmlExtension)) {
                componentProvider.update(previewUri);
            } else if (e.document.fileName.endsWith(xcmlExtension)) {
                 compositionProvider.update(previewUriComposition);
            }
        }
    };

    vscode.workspace.onDidChangeTextDocument((e: vscode.TextDocumentChangeEvent) => {
        update(e);        
    });

    vscode.window.onDidChangeActiveTextEditor((e: vscode.TextEditor) => {
        update(e);
    });

    const disposable = vscode.commands.registerCommand("xcomponent.preview", () => {
        return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Component preview").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    const disposableComposition = vscode.commands.registerCommand("composition.preview", () => {
        return vscode.commands.executeCommand("vscode.previewHtml", previewUriComposition, vscode.ViewColumn.Two, "Composition preview").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    context.subscriptions.push(disposableComposition, compositionRegistration);
    context.subscriptions.push(disposable, registration);
}