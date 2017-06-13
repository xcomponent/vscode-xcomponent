import * as vscode from "vscode";
import * as path from "path";
import { ComponentGraphicalModel } from "parserObjects";

export default class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private context: vscode.ExtensionContext;
    private componentGraphicalModel: ComponentGraphicalModel;

    public constructor(context: vscode.ExtensionContext, componentGraphicalModel: ComponentGraphicalModel) {
        this.context = context;
        this.componentGraphicalModel = componentGraphicalModel;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const container = `<div id="diagram" style="
					  	min-height: 100%;
                        display: block;
						background-color: white;">
					</div>`;
        const style = `<style type="text/css">
					html, body {
						height: 100%;
						margin: 0;
					}
   				</style>`;
        const script = `<script src="${this.getPath("dist/bundle.js")}" model='${this.componentGraphicalModel.model}' graphical='${this.componentGraphicalModel.graphical}'></script>`;
        const html = `<!DOCTYPE html>
				<html>
					${style}
				<body>
  					${container}
					${script}
				</body>
				</html>`;
        return html;
    }

    private getPath(p: string): string {
        return path.join(this.context.extensionPath, p);
    }

    get onDidChange(): vscode.Event<vscode.Uri> {
        return this._onDidChange.event;
    }

    public update(uri: vscode.Uri) {
        this._onDidChange.fire(uri);
    }
}