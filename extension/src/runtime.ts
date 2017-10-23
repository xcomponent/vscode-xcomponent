import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const xcrExtension = ".xcr";

export const launchRuntime = (terminals: { [key: string]: vscode.Terminal }): void => {
    const rootPath = vscode.workspace.rootPath;
    const config = vscode.workspace.getConfiguration();
    const xcruntimePath = (fs.existsSync(config.xcruntime.path)) ? config.xcruntime.path : "xcruntime.exe";
    const isWindowsPlatform = /^win/.test(process.platform);
    const mono = (isWindowsPlatform) ? "" : "mono";
    const xcassemblies = `${rootPath}${path.sep}XCR${path.sep}xcassemblies`;
    let xcrFileFound = false;
    fs.readdirSync(xcassemblies).forEach(file => {
        const basename = path.basename(file);
        if (basename.endsWith(xcrExtension)) {
            if (terminals[basename] === undefined) {
                terminals[basename] = vscode.window.createTerminal(basename);
            }
            terminals[basename].show();
            terminals[basename].sendText(`${mono} ${xcruntimePath} ${xcassemblies}${path.sep}${file}`);
            xcrFileFound = true;
        }
    });
    if (!xcrFileFound) {
        vscode.window.showWarningMessage("No .xcr file has been found");
        return;
    }
};