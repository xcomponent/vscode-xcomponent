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
import { getServerUrl } from "./webSocketConfigParser";

const xcmlExtension = ".xcml";
const cxmlExtension = ".cxml";
const openBrowserTimeOut = 2000;

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

    const terminal = vscode.window.createTerminal("xcomponent");
    context.subscriptions.push(terminal);

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

    const disposableBuild = vscode.commands.registerCommand("xcomponent.build.project", () => {
        const xcbuildPath = vscode.workspace.getConfiguration()["xcbuild"];
        if (!fs.existsSync(xcbuildPath)) {
            vscode.window.showErrorMessage(`xcbuild.exe not found. Please specify xcbuild path in vscode settings`);
            return;
        }
        const rootPath = vscode.workspace.rootPath;
        const baseName = path.basename(rootPath);
        const xcmlPath = `${rootPath}${path.sep}${baseName}_Model.xcml`;
        if (!fs.existsSync(xcmlPath)) {
            vscode.window.showErrorMessage(`Build error. File ${xcmlPath} not found`);
            return;
        }
        const isWindowsPlatform = /^win/.test(process.platform);
        if (isWindowsPlatform) {
            const buildCommand = `${xcbuildPath} --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=${xcmlPath}`;
            terminal.show();
            terminal.sendText(buildCommand);
            return;
        }
        const monoPath = vscode.workspace.getConfiguration()["mono"];
        if (!fs.existsSync(monoPath)) {
            vscode.window.showErrorMessage(`mono not found. Please specify mono path in vscode settings`);
            return;
        }
        const buildCommand = `mono ${xcbuildPath}--compilationmode=Release --build --framework=Framework452 --env=Dev --vs=VS2015 --monoPath=“${monoPath}” --project=“${xcmlPath}”`
        terminal.show();
        terminal.sendText(buildCommand);
    });


    promisify(freeport)()
        .then((port: number) => {
            const disposableSpy = vscode.commands.registerCommand("xcomponent.launch.spy", () => {
                const rootPath = vscode.workspace.rootPath;
                const baseName = path.basename(rootPath);
                const configurationFilePath = `${rootPath}${path.sep}Configuration.${baseName}${path.sep}Dev${path.sep}${baseName}_Deployment_Configuration.xml`;
                const serverUrl = getServerUrl(configurationFilePath);
                const binPath = path.join(context.extensionPath, "out/spy/bin");
                const runSpyServercommand = `serve --single --port ${port} ${binPath}`;
                const promiseCheckPortStatus = promisify(portscanner.checkPortStatus);
                const urlParams = (serverUrl === undefined) ? "" : `/form?serverUrl=${serverUrl}`;
                const url = `http://localhost:${port}${urlParams}`;
                promiseCheckPortStatus(port, "localhost")
                    .then((status: string) => {
                        if (status === "closed") {
                            terminal.show();
                            terminal.sendText(runSpyServercommand);
                            setTimeout(() => opn(url), openBrowserTimeOut);
                        } else if (status === "open") {
                            setTimeout(() => opn(url), openBrowserTimeOut);
                        }
                    });
            });
            context.subscriptions.push(disposableSpy);
        })
        .catch((err) => {
            console.error(err);
        });

    context.subscriptions.push(disposableComposition, compositionRegistration);
    context.subscriptions.push(disposable, registration);
    context.subscriptions.push(disposableBuild);
}