import * as vscode from "vscode";
import * as path from "path";
import { ComponentViewerProvider } from "./componentViewerProvider";
import { CompositionViewerProvider } from "./compositionViewerProvider";
import * as promisify from "es6-promisify";
import * as freeport from "freeport";
import { OutputChannel } from "vscode";
import * as fs from "fs";
import { build } from "./projectBuilder";
import { spyExec } from "./spyExec";
import { launchRuntime } from "./runtime";
import { launchBridge } from "./bridge";
import { ComponentCompletionItemProvider } from "./completion/componentCompletionItemProvider";

const xcmlExtension = ".xcml";
const cxmlExtension = ".cxml";

interface DataUrl {
    componentName: string;
    api: string;
}


export function activate(context: vscode.ExtensionContext) {
    const previewUri = vscode.Uri.parse("xc-preview://xcomponent/component-preview");
    const previewUriComposition = vscode.Uri.parse("xc-preview-composition://xcomponent/composition-preview");

    const compositionProvider = new CompositionViewerProvider(context);
    const compositionRegistration = vscode.workspace.registerTextDocumentContentProvider("xc-preview-composition", compositionProvider);

    const componentProvider = new ComponentViewerProvider(context);
    const registration = vscode.workspace.registerTextDocumentContentProvider("xc-preview", componentProvider);

    const buildTerminal = "build";
    const webSocketBridgeTerminal = "webSocketBridge";
    const spyTerminal = "spy";
    const terminalNames = [buildTerminal, webSocketBridgeTerminal, spyTerminal];
    const terminals: Map<string, vscode.Terminal> = new Map<string, vscode.Terminal>();

    terminalNames.forEach(name => {
        terminals[name] = undefined;
    });
    vscode.window.onDidCloseTerminal(e => {
        terminals[e.name] = undefined;
    });
    const createTerminal = (name: string): void => {
        if (terminals[name] === undefined) {
            terminals[name] = vscode.window.createTerminal(name);
            context.subscriptions.push(terminals[name]);
        }
    };

    const update = (e) => {
        if (e && e.document === vscode.window.activeTextEditor.document) {
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

    const completionRegistration = vscode.languages.registerCompletionItemProvider([{ pattern: "**/*.cxml", scheme: "file" }],
        new ComponentCompletionItemProvider(), "\"");

    const disposable = vscode.commands.registerCommand("xcomponent.preview.component", () => {
        return vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Component preview").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    const disposableComposition = vscode.commands.registerCommand("xcomponent.preview.composition", () => {
        return vscode.commands.executeCommand("vscode.previewHtml", previewUriComposition, vscode.ViewColumn.Two, "Composition preview").then((success) => {
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

    const disposableBuild = vscode.commands.registerCommand("xcomponent.build.project", () => {
        createTerminal(buildTerminal);
        build(terminals[buildTerminal]);
    });

    const disposableRuntime = vscode.commands.registerCommand("xcomponent.launch.runtime", () => {
        launchRuntime(terminals);
    });

    const disposableBridge = vscode.commands.registerCommand("xcomponent.launch.webSocketBridge", () => {
        createTerminal(webSocketBridgeTerminal);
        launchBridge(terminals[webSocketBridgeTerminal]);
    });

    promisify(freeport)()
        .then((port: number) => {
            const disposableSpy = vscode.commands.registerCommand("xcomponent.launch.spy", () => {
                createTerminal(spyTerminal);
                spyExec(terminals[spyTerminal], port, context.extensionPath);
            });
            context.subscriptions.push(disposableSpy);
        })
        .catch((err) => {
            console.error(err);
        });

    context.subscriptions.push(disposableComposition, compositionRegistration);
    context.subscriptions.push(disposable, registration);
    context.subscriptions.push(completionRegistration);
    context.subscriptions.push(disposableBuild);
}