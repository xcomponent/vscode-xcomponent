import * as path from "path";
import * as fs from "fs";
import * as vscode from "vscode";
import { parseStringSync } from "xml2js-parser";

export const getServerUrl = (configurationFilePath: string): string => {
    let serverUrl = undefined;
    if (fs.existsSync(configurationFilePath)) {
        const json = parseStringSync(fs.readFileSync(configurationFilePath).toString());
        const websocketConfig = json.deployment.configuration[0].gateways[0].websocket[0];
        const s = (websocketConfig.$.type === "Secure") ? "s" : "";
        serverUrl = `ws${s}://${websocketConfig.$.host}:${websocketConfig.$.bridgeport}`;
    } else {
        vscode.window.showWarningMessage(`File ${configurationFilePath} not found`);
    }
    return serverUrl;
};

export const isSecure = (configurationFilePath: string): boolean => {
    if (fs.existsSync(configurationFilePath)) {
        const json = parseStringSync(fs.readFileSync(configurationFilePath).toString());
        const websocketConfig = json.deployment.configuration[0].gateways[0].websocket[0];
        return websocketConfig.$.type === "Secure";
    } else {
        vscode.window.showWarningMessage(`File ${configurationFilePath} not found`);
        return false;
    }
};
