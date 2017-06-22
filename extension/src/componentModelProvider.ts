import * as vscode from "vscode";
import * as fs from "fs-extra";
import * as path from "path";

const cxmlExtension = ".cxml";
const graphicalFileSuffix = "_Graphical.xml";

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

    private getGraphicalRawModel(): string | undefined {
        const graphicalFile = `${this.editor.document.fileName.replace(cxmlExtension, "")}${graphicalFileSuffix}`;
        if (fs.existsSync(graphicalFile)) {
            return fs.readFileSync(graphicalFile).toString();
        }
        return undefined;
    }
}