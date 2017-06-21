import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";
import { ComponentViewerProvider } from "./componentViewerProvider";

const fileUriProviders = {};

export function activate(context: vscode.ExtensionContext) {
    const openfile = vscode.commands.registerCommand("component-viewer", (uri) => {
        if (!(uri instanceof vscode.Uri)) {
            return;
        }

        const filePath = uri.fsPath;
        if (!/.cxml$/.test(uri.fsPath)) {
            vscode.window.showWarningMessage("Selected file is not a cxml document");
            return;
        }
        const tmp = filePath.split(path.sep);
        const title = tmp[tmp.length - 1].replace(".cxml", "");
        const htmlUri = `${title}://authority/${title}`;
        const previewUri = vscode.Uri.parse(htmlUri);

        if (!fileUriProviders[htmlUri]) {
            fileUriProviders[htmlUri] = getFileUriProvider(context, filePath, title);
        } else {
            fileUriProviders[htmlUri].provider.update(vscode.Uri.parse(htmlUri));
        }
        return openPreview(previewUri, title);
    });

    context.subscriptions.push(openfile);
}

export function deactivate() {
    for (let htmlUri in fileUriProviders) {
        fileUriProviders[htmlUri].registration.dispose();
    }
}

function getFileUriProvider(context: vscode.ExtensionContext, filePath: string, title: string) {
    const graphicalFile = filePath.replace(".cxml", "") + "_Graphical.xml";
    const model = fs.readFileSync(filePath).toString();
    let graphicalModel = undefined;
    try {
        graphicalModel = fs.readFileSync(graphicalFile).toString();
    } catch (e) {
        vscode.window.showWarningMessage("Graphical file not found");
    }
    const provider = new ComponentViewerProvider(context, model, graphicalModel);
    const registration = vscode.workspace.registerTextDocumentContentProvider(title, provider);
    return {
        provider: provider,
        registration: registration
    };
}

function openPreview(uri: vscode.Uri, title: string) {
    return vscode.commands.executeCommand("vscode.previewHtml", uri, vscode.ViewColumn.One, title).then((success) => {
    }, (reason) => {
        vscode.window.showErrorMessage(reason);
    });
}