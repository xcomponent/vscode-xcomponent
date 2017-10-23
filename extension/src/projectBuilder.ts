import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export const build = (terminal: vscode.Terminal): void => {
    const config = vscode.workspace.getConfiguration();
    const xcbuildPath = (fs.existsSync(config.xcbuild.path)) ? config.xcbuild.path : "xcbuild.exe";
    const rootPath = vscode.workspace.rootPath;
    const baseName = path.basename(rootPath);
    const xcmlPath = `${rootPath}${path.sep}${baseName}_Model.xcml`;
    if (!fs.existsSync(xcmlPath)) {
        vscode.window.showErrorMessage(`Build error. File ${xcmlPath} not found`);
        return;
    }
    const isWindowsPlatform = /^win/.test(process.platform);
    const mono = (isWindowsPlatform) ? "" : "mono";

    let buildCommand = `${xcbuildPath} --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=${xcmlPath}`;
    let exportXCRCommand = `${xcbuildPath} --exportRuntimes --compilationmode=Debug --env=Dev --output="${rootPath}${path.sep}XCR" --project=${xcmlPath}`;
    let generateXCAssembliesCommand = `${xcbuildPath} --compilationmode=Debug --exportInterface --env=Dev --output="${rootPath}${path.sep}output" --project=${xcmlPath}`;

    if (isWindowsPlatform) {
        terminal.show();
        terminal.sendText(buildCommand);
        terminal.sendText(exportXCRCommand);
        terminal.sendText(generateXCAssembliesCommand);
        return;
    }
    const monoFacadesPath = config.mono.facades.path;
    if (!fs.existsSync(monoFacadesPath)) {
        vscode.window.showErrorMessage(`mono facades path not found. Please specify mono facades path in vscode settings`);
        return;
    }
    buildCommand = `mono ${buildCommand} --monoPath=“${monoFacadesPath}” --framework=Framework452 `;
    exportXCRCommand = `mono ${exportXCRCommand}`;
    generateXCAssembliesCommand = `mono ${generateXCAssembliesCommand}`;

    terminal.show();
    terminal.sendText(buildCommand);
    terminal.sendText(exportXCRCommand);
    terminal.sendText(generateXCAssembliesCommand);
};

/**
 * xcbuild.exe --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=c:\XComponentProjects\HelloWorld\HelloWorld_Model.xcml

xcbuild.exe --exportRuntimes --compilationmode=Debug --env=Dev --output="C:\XComponentProjects\HelloWorld\ABC" --project="c:\XComponentProjects\HelloWorld\
"

xcruntime.exe "C:\XComponentProjects\HelloWorld\ABC\xcassemblies\HelloWorld-microservice1.xcr"

xcbuild.exe --compilationmode=Debug --exportInterface --env=Dev --output="C:\XComponentProjects\HelloWorld\output" --project="c:\XComponentProjects\HelloWorld\HelloWorld_Model.xcml"

start XCWebSocketBridge --apiPath="C:\XComponentProjects\HelloWorld\output\xcassemblies" --port=9443
 */