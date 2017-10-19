import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export const build = (terminal: vscode.Terminal): void => {
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
    const buildCommand = `mono ${xcbuildPath}--compilationmode=Release --build --framework=Framework452 --env=Dev --vs=VS2015 --monoPath=“${monoPath}” --project=“${xcmlPath}”`;
    terminal.show();
    terminal.sendText(buildCommand);
};