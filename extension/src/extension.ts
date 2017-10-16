import * as vscode from "vscode";
import * as path from "path";
import { ComponentViewerProvider } from "./componentViewerProvider";
import { CompositionViewerProvider } from "./compositionViewerProvider";
import { exec, execSync } from "child_process";
import * as promisify from "es6-promisify";
import * as portscanner from "portscanner";
import * as opn from "opn";
import * as freeport from "freeport";
import { OutputChannel } from "vscode";
import * as fs from "fs";
import { parseStringSync } from "xml2js-parser";

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

    const getServerUrl = () => {
        const baseName = path.basename(vscode.workspace.rootPath);
        const configurationFile = `${vscode.workspace.rootPath}${path.sep}Configuration.${baseName}${path.sep}Dev${path.sep}${baseName}_Deployment_Configuration.xml`;
        let serverUrl = undefined;
        if (fs.existsSync(configurationFile)) {
            const json = parseStringSync(fs.readFileSync(configurationFile).toString());
            const websocketConfig = json.deployment.configuration[0].gateways[0].websocket[0];
            const s = (websocketConfig.$.type === "Secure") ? "s" : "";
            serverUrl = `ws${s}://${websocketConfig.$.host}:${websocketConfig.$.bridgeport}`;
        } else {
            vscode.window.showWarningMessage(`File ${configurationFile} not found`);
        }
        return serverUrl;
    };

    promisify(freeport)()
        .then((port: number) => {
            const disposableSpy = vscode.commands.registerCommand("xcomponent.launch.spy", () => {
                const serverUrl = getServerUrl();
                const dirPath = path.parse(context.extensionPath);
                const spyPath = `${dirPath.dir}${path.sep}spy`;
                const binPath = `${dirPath.dir}${path.sep}spy${path.sep}bin`;
                const runSpyServercommand = `webpack-dev-server --content-base ${binPath} --port ${port}`;
                const promiseCheckPortStatus = promisify(portscanner.checkPortStatus);
                const urlParams = (serverUrl === undefined) ? "" : `/form?serverUrl=${serverUrl}`;
                const url = `http://localhost:${port}${urlParams}`;
                promiseCheckPortStatus(port, "localhost")
                    .then((status: string) => {
                        if (status === "closed") {
                            const terminal = vscode.window.createTerminal("xcomponent");
                            context.subscriptions.push(terminal);
                            terminal.show();
                            terminal.sendText(`cd ${spyPath}`);
                            terminal.sendText(runSpyServercommand);
                            opn(url);
                        } else if (status === "open") {
                            opn(url);
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