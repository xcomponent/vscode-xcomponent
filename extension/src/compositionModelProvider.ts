import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import { parseStringSync } from "xml2js-parser";

const xcmlExtension = ".xcml";
const cxmlExtension = ".cxml";

export interface CompositionModel {
    models: Array<string>;
    composition: string;
}

export class CompositionModelProvider {

    private editor: vscode.TextEditor;

    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }

    public isXcmlDocument(): boolean {
        return this.editor != null && this.editor.document != null && path.extname(this.editor.document.fileName) === xcmlExtension;
    }

    public getCompositionModel(): CompositionModel {
        if (!this.isXcmlDocument()) {
            return undefined;
        }

        return {
            models: this.getModels(),
            composition: this.editor.document.getText()
        };
    }

    private getComponentNames(): Array<string> {
        const compositionJson = parseStringSync(this.editor.document.getText());
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