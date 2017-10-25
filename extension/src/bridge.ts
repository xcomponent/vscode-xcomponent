import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { isSecure } from "./webSocketConfigParser";

export const launchBridge = (terminal: vscode.Terminal): void => {
    const rootPath = vscode.workspace.rootPath;
    const config = vscode.workspace.getConfiguration();
    const port = (config.xcwebsocketbridge.port) ? config.xcwebsocketbridge.port : 443;
    const isWindowsPlatform = /^win/.test(process.platform);
    const mono = (isWindowsPlatform) ? "" : "mono";
    const bridge = (fs.existsSync(config.xcwebsocketbridge.path)) ? config.xcwebsocketbridge.path : "XCWebSocketBridge.exe";
    const baseName = path.basename(rootPath);
    const configurationFilePath = `${rootPath}${path.sep}Configuration.${baseName}${path.sep}Dev${path.sep}${baseName}_Deployment_Configuration.xml`;
    const unsecure = isSecure(configurationFilePath) ? "" : "--unsecure";
    const launchRuntimeCommand = `${mono} ${bridge} --apiPath="${rootPath}${path.sep}output${path.sep}xcassemblies" --port=${config.xcwebsocketbridge.port} ${unsecure}`;
    terminal.show();
    terminal.sendText(launchRuntimeCommand);
};