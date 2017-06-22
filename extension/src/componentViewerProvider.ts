import * as vscode from "vscode";
import * as path from "path";

export class ComponentViewerProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private context: vscode.ExtensionContext;
    private model: string;
    private graphicalModel: string;

    public constructor(context: vscode.ExtensionContext, model: string, graphicalModel: string) {
        this.context = context;
        this.model = model;
        this.graphicalModel = graphicalModel;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
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
        const script = `<script type="text/javascript" src="file:///${this.getPath("out/viewer/bundle.js")}" model='${this.model}' graphical='${this.graphicalModel}'}></script>`;
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