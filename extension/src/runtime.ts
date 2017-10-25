import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

const xcrExtension = ".xcr";

export const launchRuntime = (terminals: Map<string, vscode.Terminal>): void => {
    const rootPath = vscode.workspace.rootPath;
    const config = vscode.workspace.getConfiguration();
    const xcruntimePath = (fs.existsSync(config.xcruntime.path)) ? config.xcruntime.path : "xcruntime.exe";
    const isWindowsPlatform = /^win/.test(process.platform);
    const mono = (isWindowsPlatform) ? "" : "mono";
    const xcassemblies = `${rootPath}${path.sep}XCR${path.sep}xcassemblies`;
    const xcrFiles = fs.readdirSync(xcassemblies)
        .filter(file => file.endsWith(xcrExtension))
        .map(file => {
            if (!terminals.has(file)) {
                terminals[file] = vscode.window.createTerminal(file);
            }
            terminals[file].show();
            terminals[file].sendText(`${mono} ${xcruntimePath} ${xcassemblies}${path.sep}${file}`);
        });

    if (xcrFiles.length === 0) {
        vscode.window.showWarningMessage("No .xcr file has been found");
    }
};