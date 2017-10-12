import * as vscode from "vscode";
import * as path from "path";
import { ComponentViewerProvider } from "./componentViewerProvider";
import { CompositionViewerProvider } from "./compositionViewerProvider";
import { exec, execSync } from "child_process";
import * as promisify from "es6-promisify";
import * as portscanner from "portscanner";
import * as opn from "opn";
import * as freeport from "freeport";
import xcomponentapi from "reactivexcomponent.js";

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

    const getCommandToRunSpy = (serverPath) => {
        const os = execSync("uname -s").toString().toLowerCase();
        if (os.indexOf("darwin") !== -1) {
            return `osascript -e 'tell application "Terminal" to do script "node ${serverPath}"'`;
        } else if (os.indexOf("linux") !== -1) {
            return `xterm -e node ${serverPath}`;
        } else {
            return `START cmd.exe /K node ${serverPath}`;
        }
    };

    promisify(freeport)()
        .then((port: number) => {
            const disposableSpy = vscode.commands.registerCommand("xcomponent.launch.spy", () => {
                const dirPath = path.parse(context.extensionPath);
                const serverPath = `${dirPath.dir}${path.sep}spy${path.sep}server.js`;
                const runSpyServercommand = getCommandToRunSpy(serverPath);
                (<any>process.env.port) = port;
                const promiseCheckPortStatus = promisify(portscanner.checkPortStatus);
                const webSocketUrl = "wss://localhost:443";
                const getXcApiListPromise = new Promise((resolve, reject) =>
                    xcomponentapi.getXcApiList(webSocketUrl, (err, apiList) => (err) ? reject(err) : resolve(apiList))
                );
                getXcApiListPromise
                    .then(apiList =>
                        new Promise((resolve, reject) =>
                            xcomponentapi.getModel(apiList[0], webSocketUrl, (err, model) =>
                                (err)
                                    ? reject(err)
                                    : resolve({ componentName: model.components[0].name, api: apiList[0] }))
                        ))
                    .catch(err => {
                        console.error(err);
                        return undefined;
                    })
                    .then((data: DataUrl) => {
                        const url = (data === undefined)
                            ? `http://localhost:${port}`
                            : `http://localhost:${port}/app?serverUrl=${webSocketUrl}&api=${data.api}&currentComponent=${data.componentName}`;
                        (<any>process.env.url) = url;
                        promiseCheckPortStatus(port, "localhost")
                            .then((status: string) => {
                                if (status === "closed") {
                                    exec(runSpyServercommand);
                                } else if (status === "open") {
                                    opn(url);
                                }
                            });
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