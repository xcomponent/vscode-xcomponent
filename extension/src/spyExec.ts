import * as vscode from "vscode";
import * as path from "path";
import { getServerUrl } from "./webSocketConfigParser";
import * as promisify from "es6-promisify";
import * as opn from "opn";
import * as portscanner from "portscanner";

const openBrowserTimeOut = 2000;

export const spyExec = (terminal: vscode.Terminal, port: number, extensionPath: string): void => {
    const rootPath = vscode.workspace.rootPath;
    const baseName = path.basename(rootPath);
    const configurationFilePath = `${rootPath}${path.sep}Configuration.${baseName}${path.sep}Dev${path.sep}${baseName}_Deployment_Configuration.xml`;
    const serverUrl = getServerUrl(configurationFilePath);
    const binPath = path.join(extensionPath, "spyxcomponent", "build");
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
};