import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export const getCommands = (xcbuildPath, rootPath, xcmlPath, monoFacadesPath, platform): string[] => {
    if (!fs.existsSync(xcmlPath)) {
        vscode.window.showErrorMessage(`Build error. File ${xcmlPath} not found`);
        return undefined;
    }

    const isWindowsPlatform = /^win/.test(platform);
    const mono = (isWindowsPlatform) ? "" : "mono";

    let buildCommand = `${xcbuildPath} --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=${xcmlPath}`;
    let exportRuntimesCommand = `${xcbuildPath} --exportRuntimes --compilationmode=Debug --env=Dev --output="${rootPath}${path.sep}XCR" --project=${xcmlPath}`;
    let exportInterfaceCommand = `${xcbuildPath} --compilationmode=Debug --exportInterface --env=Dev --output="${rootPath}${path.sep}output" --project=${xcmlPath}`;

    if (isWindowsPlatform) {
        return [buildCommand, exportRuntimesCommand, exportInterfaceCommand];
    }

    if (!fs.existsSync(monoFacadesPath)) {
        vscode.window.showErrorMessage(`mono facades path not found. Please specify mono facades path in vscode settings`);
        return undefined;
    }

    buildCommand = `mono ${buildCommand} --monoPath=“${monoFacadesPath}” --framework=Framework452 `;
    exportRuntimesCommand = `mono ${exportRuntimesCommand}`;
    exportInterfaceCommand = `mono ${exportInterfaceCommand}`;

    return [buildCommand, exportRuntimesCommand, exportInterfaceCommand];
};

export const build = (terminal: vscode.Terminal): void => {
    const rootPath = vscode.workspace.rootPath;
    const baseName = path.basename(rootPath);
    const xcmlPath = `${rootPath}${path.sep}${baseName}_Model.xcml`;
    const config = vscode.workspace.getConfiguration();
    const xcbuildPath = (fs.existsSync(config.xcbuild.path)) ? config.xcbuild.path : "xcbuild.exe";
    const monoFacadesPath = config.mono.facades.path;

    const commands = getCommands(xcbuildPath, rootPath, xcmlPath, monoFacadesPath, process.platform);
    if (!commands) {
        return;
    }
    terminal.show();
    commands.forEach(command => {
        terminal.sendText(command);
    });
};