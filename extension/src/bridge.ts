import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export const launchBridge = (terminal: vscode.Terminal): void => {
    const rootPath = vscode.workspace.rootPath;
    const config = vscode.workspace.getConfiguration();
    const port = (config.xcwebsocketbridge.port) ? config.xcwebsocketbridge.port : 443;
    const isWindowsPlatform = /^win/.test(process.platform);
    const mono = (isWindowsPlatform) ? "" : "mono";
    const bridge = (fs.existsSync(config.xcwebsocketbridge.path)) ? config.xcwebsocketbridge.path : "XCWebSocketBridge.exe";
    terminal.show();
    const launchRuntimeCommand = `${mono} ${bridge} --unsecure --apiPath="${rootPath}${path.sep}output${path.sep}xcassemblies" --port=${config.xcwebsocketbridge.port}`;
    terminal.sendText(launchRuntimeCommand);
};