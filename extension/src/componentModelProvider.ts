import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export const cxmlExtension = ".cxml";
export const graphicalFileSuffix = "_Graphical";
export const graphicalFileExtension = ".xml";

export interface ComponentRawModel {
    model: string;
    graphical?: string;
}

export class ComponentModelProvider {

    private editor: vscode.TextEditor;

    constructor() {
        this.editor = vscode.window.activeTextEditor;
    }

    public isCxmlDocument(): boolean {
        return this.editor != null && this.editor.document != null && path.extname(this.editor.document.fileName) === cxmlExtension;
    }

    public getRawModel(): ComponentRawModel | undefined {
        if (!this.isCxmlDocument()) {
            return undefined;
        }

        const rawModel = this.editor.document.getText();

        return {
            model: rawModel,
            graphical: this.getGraphicalRawModel()
        };
    }

    public getModelFilePath() {
        if (!this.isCxmlDocument()) {
            return undefined;
        }
        return this.editor.document.fileName;
    }

    private getGraphicalRawModel(): string | undefined {
        const graphicalFilePath = this.getGraphicalPath();
        if (fs.existsSync(graphicalFilePath)) {
            return fs.readFileSync(graphicalFilePath).toString();
        }
        return undefined;
    }

    private getGraphicalPath(): string {
        let parsedFile = path.parse(this.editor.document.fileName);
        parsedFile.base = `${parsedFile.name}${graphicalFileSuffix}${graphicalFileExtension}`;
        return path.format(parsedFile);
    }
}