import * as vscode from "vscode";
import * as path from "path";
import { ComponentViewerProvider } from "./componentViewerProvider";
import { CompositionViewerProvider } from "./compositionViewerProvider";
import { exec, execSync } from "child_process";
import * as promisify from "es6-promisify";
import * as portscanner from "portscanner";
import * as opn from "opn";
import * as freeport from "freeport";
import * as stringArgv from "string-argv";

const xcmlExtension = ".xcml";
const cxmlExtension = ".cxml";

export function activate(context: vscode.ExtensionContext) {
    const previewUri = vscode.Uri.parse("xc-preview://xcomponent/component-preview");
    const previewUriComposition = vscode.Uri.parse("xc-preview-composition://xcomponent/composition-preview");

    const compositionProvider = new CompositionViewerProvider(context);
    const compositionRegistration = vscode.workspace.registerTextDocumentContentProvider("xc-preview-composition", compositionProvider);

    const componentProvider = new ComponentViewerProvider(context, previewUri);
    const registration = vscode.workspace.registerTextDocumentContentProvider("xc-preview", componentProvider);

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

    const disposableCreateTransition = vscode.commands.registerCommand("xcomponent.create.transition", () => {
        return vscode.window.showInputBox().then((success) => {
            const args = stringArgv(success);
            // newTransition XComponent.UserObject HelloWorld EntryPoint HelloWorldManager EntryPoint HelloWorldManager
            // transitionName transitionType ComponentName StateSource StateMachineSource StateTarget StateMachineTarget
            if (args.length === 7) {
                vscode.commands.executeCommand("vscode.previewHtml", previewUri, vscode.ViewColumn.Two, "Component preview").then((success) => {
                    componentProvider.createTransition(args);
                    componentProvider.update(previewUri);
                }, (reason) => {
                    console.error(reason);
                    vscode.window.showErrorMessage(reason);
                });
            } else {
                vscode.window.showErrorMessage("Incorrect arguments");
            }
        }, (reason) => {
            vscode.window.showErrorMessage(reason);
        });
    });

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

    promisify(freeport)()
        .then((port: number) => {
            const disposableSpy = vscode.commands.registerCommand("xcomponent.launch.spy", () => {
                const dirPath = path.parse(context.extensionPath);
                const serverPath = `${dirPath.dir}${path.sep}spy${path.sep}server.js`;
                const runSpyServercommand = `node ${serverPath}`;
                (<any>process.env.port) = port;
                const promiseCheckPortStatus = promisify(portscanner.checkPortStatus);
                promiseCheckPortStatus(port, "localhost")
                    .then((status: string) => {
                        if (status === "closed") {
                            exec(runSpyServercommand);
                        } else if (status === "open") {
                            opn(`http://localhost:${port}`);
                        }
                    });
            });
            context.subscriptions.push(disposableSpy, registration);
        })
        .catch((err) => {
            console.error(err);
        });

    context.subscriptions.push(disposableComposition, compositionRegistration);
    context.subscriptions.push(disposable, registration);
}