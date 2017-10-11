import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { parseStringSync } from "xml2js-parser";

const xcmlExtension = ".xcml";
const cxmlExtension = ".cxml";

export class CompositionModelProvider {

    private editor: vscode.TextEditor;

    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }

    public isXcmlDocument(): boolean {
        return this.editor != null && this.editor.document != null && path.extname(this.editor.document.fileName) === xcmlExtension;
    }

    public getComposition(): string {
        if (!this.isXcmlDocument()) {
            return undefined;
        }
        return this.editor.document.getText();
    }

    public getComponentsData() {
        if (!this.isXcmlDocument()) {
            return undefined;
        }
        const models = this.getModels();
        if (models === undefined)
            return undefined;
        const components = {};
        models.forEach(model => {
            let modelJson;
            modelJson = parseStringSync(model);
            const stateMachines = {};
            modelJson.ComponentData.$.Name;
            modelJson.ComponentData.StateMachines[0].StateMachineData.forEach(stateMachine => {
                stateMachines[stateMachine.$.Id] = { name: stateMachine.$.Name, states: {} };
            });
            modelJson.ComponentData.States[0].StateData.forEach(state => {
                const stateMachineId = state.$.SubGraphKey.substring("StateMachine".length, state.$.SubGraphKey.length);
                stateMachines[stateMachineId].states[state.$.Id] = state.$.Name;
            });
            components[modelJson.ComponentData.$.Name] = stateMachines;
        });
        return components;
    }

    private getComponentNames(): Array<string> {
        let compositionJson;
        compositionJson = parseStringSync(this.editor.document.getText());
        const linkedComponents = compositionJson.LinkingSchema.LinkedComponents[0].LinkedComponent;
        const componentNames = [];
        linkedComponents.forEach(linkedComponent => {
            componentNames.push(linkedComponent.$.name);
        });
        return componentNames;
    }

    private getModels(): Array<string> {
        const models = [];
        const componentNames = this.getComponentNames();
        for (let i = 0; i < componentNames.length; i++) {
            const modelPath = this.getModelPath(componentNames[i]);
            if (fs.existsSync(modelPath)) {
                models.push(fs.readFileSync(modelPath).toString());
            } else {
                vscode.window.showWarningMessage(`${modelPath} not found`);
                return undefined;
            }
        }
        return models;
    }

    private getModelPath(componentName): string {
        const compositionPath = this.editor.document.fileName;
        const parsedFile = path.parse(this.editor.document.fileName);
        const modelPath = `${parsedFile.dir}${path.sep}${componentName}${path.sep}${componentName}${cxmlExtension}`;
        return modelPath;
    }
}