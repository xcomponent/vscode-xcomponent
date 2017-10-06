import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { parseStringSync } from "xml2js-parser";
// import * as X from "xml2js-parser";
// import * as parser from "json-xml-parser";
import { to_json as toJson, to_xml as toXml } from "xmljson";
import * as promisify from "es6-promisify";
import * as xmlFormatter from "xml-formatter";
// import * as xml2js from "xml2js";
import { ComponentModelProvider, ComponentRawModel, cxmlExtension } from "./componentModelProvider";

interface TransitionParameter {
    name: string;
    triggeringEvent: string;
    component: string;
    stateSource: string;
    stateMahineSource: string;
    stateTarget: string;
    stateMahineTarget: string;
}

export class ComponentViewerProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private context: vscode.ExtensionContext;
    private transitionToCreate: TransitionParameter | undefined;
    private uri: vscode.Uri;

    public constructor(context: vscode.ExtensionContext, uri: vscode.Uri) {
        this.context = context;
        this.uri = uri;
    }

    public createTransition(args: Array<string>) {
        this.transitionToCreate = {
            name: args[0],
            triggeringEvent: args[1],
            component: args[2],
            stateSource: args[3],
            stateMahineSource: args[4],
            stateTarget: args[5],
            stateMahineTarget: args[6]
        };
    }

    private getStateId(states, stateMachines, stateName, stateMachineName) {
        let stateId = undefined, stateMachineId = undefined;
        for (let i in stateMachines) {
            if (stateMachines[i].$.Name === stateMachineName) {
                stateMachineId = stateMachines[i].$.Id;
                break;
            }
        }
        if (stateMachineId === undefined) {
            throw new Error(`StateMachine ${stateMachineName} not found`)
        }
        for (let i in states) {
            if (states[i].$.Name === stateName && states[i].$.SubGraphKey === `StateMachine${stateMachineId}`) {
                stateId = states[i].$.Id;
                break;
            }
        }
        if (stateId === undefined) {
            throw new Error(`State ${stateName} not found`)
        }
        return stateId;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const componentModelProvider = new ComponentModelProvider();
        if (this.transitionToCreate !== undefined) {
            const rootPath = vscode.workspace.rootPath;
            const component = this.transitionToCreate.component;
            const fileName = `${rootPath}${path.sep}${component}${path.sep}${component}${cxmlExtension}`;
            let data;
            promisify(fs.readFile)(fileName)
                .then(data => promisify(toJson)(data))
                .then(componentModelJson => {
                    const states = componentModelJson.ComponentData.States.StateData;
                    const stateMachines = componentModelJson.ComponentData.StateMachines.StateMachineData;
                    const sourceStateId = this.getStateId(states, stateMachines, this.transitionToCreate.stateSource, this.transitionToCreate.stateMahineSource);
                    const targetStateId = this.getStateId(states, stateMachines, this.transitionToCreate.stateTarget, this.transitionToCreate.stateMahineTarget);
                    let links = componentModelJson.ComponentData.Links.TransitionData;
                    if (links === undefined) {
                        componentModelJson.ComponentData.Links.TransitionData = {};
                    } else if (links[0] === undefined) {
                        componentModelJson.ComponentData.Links.TransitionData = {
                            0: links
                        };
                    }
                    let max = -1;
                    for (let i in componentModelJson.ComponentData.Links.TransitionData) {
                        let id = parseInt(componentModelJson.ComponentData.Links.TransitionData[i].$.Id);
                        if (id > max) {
                            max = id;
                        }
                    }
                    componentModelJson.ComponentData.Links.TransitionData[Object.keys(componentModelJson.ComponentData.Links.TransitionData).length] = {
                        $: {
                            Id: `${max + 1}`,
                            Name: `${this.transitionToCreate.name}`,
                            FromKey: `State${sourceStateId}`,
                            ToKey: `State${targetStateId}`,
                            Type: "Standard",
                            ExecutionDelay: "0",
                            SetCustomTimeout: "false",
                            TriggeringEvent: `${this.transitionToCreate.triggeringEvent}`,
                            UserSpecificRule: "false"
                        }
                    };
                    return promisify(toXml)(JSON.stringify(componentModelJson));
                })
                .then((xml) => {
                    const extra = '<data>';
                    const xmlUpdate = xmlFormatter(xml.substring(extra.length, xml.length - extra.length - 1));
                    fs.writeFileSync(fileName, xmlUpdate, "utf8");
                    this.transitionToCreate = undefined;
                    this.update(this.uri);
                })
                .catch((err) => {
                    console.error(err.message);
                    vscode.window.showErrorMessage(err.message);
                    this.transitionToCreate = undefined;
                });
        }
        const body = componentModelProvider.isCxmlDocument() ? this.previewSnippet(componentModelProvider.getRawModel()) : this.errorSnippet("Cannot preview the file");

        const html = `<!DOCTYPE html><html>${body}</html>`;
        return html;
    }

    private errorSnippet(error: string): string {
        return `<body>${error}</body>`;
    }

    private previewSnippet(rawModel: ComponentRawModel): string {
        const container = `<div id="diagram" style="
					  	min-height: 100%;
                        display: block;
						background-color: white;">
                        <h1 style="color:#000000;"
                        id ="error"></h1>
					</div>`;
        const style = `<style type="text/css">
					html, body {
						height: 100%;
						margin: 0;
					}
   				</style>`;
        const script = `<script type="text/javascript" src="file:///${this.getBundlePath("out/viewer/bundle.js")}" model='${rawModel.model}' graphical='${rawModel.graphical}'></script>`;
        return `
				${style}
				<body>
  					${container}
					${script}
				</body>`;
    }

    private getBundlePath(p: string): string {
        return path.join(this.context.extensionPath, p);
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }
}