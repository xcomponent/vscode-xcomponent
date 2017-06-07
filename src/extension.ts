import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs-extra";
import { ComponentGraphicalModel } from "parserObjects";
import { TextDocument } from "vscode";

class TextDocumentContentProvider implements vscode.TextDocumentContentProvider {
	public constructor(private context: vscode.ExtensionContext, private componentGraphicalModel: ComponentGraphicalModel) {

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
}

export function activate(context: vscode.ExtensionContext) {
	let controller = new Controller(context);
	context.subscriptions.push(controller);
}

class Controller {

	private disposable: vscode.Disposable;
	private context: vscode.ExtensionContext;
	private componentsUri: string[] = [];
	private allUri: string[] = [];

	constructor(context: vscode.ExtensionContext) {
		this.context = context;
		// subscribe to selection change and editor activation events
		let subscriptions: vscode.Disposable[] = [];
		vscode.window.onDidChangeActiveTextEditor(this.onEvent, this, subscriptions);
		vscode.workspace.onDidCloseTextDocument(this.onDidCloseTextDocument, this, subscriptions);
		// create a combined disposable from both event subscriptions
		this.disposable = vscode.Disposable.from(...subscriptions);
		this.draw();
	}

	onDidCloseTextDocument(e: vscode.TextDocument) {
		const index = this.componentsUri.indexOf(e.uri.toString());
		if (index > -1) {
			this.componentsUri.splice(index, 1);
		}
	}

	draw() {
		const modelFile = vscode.window.activeTextEditor.document.fileName;
		if (/.cxml$/.test(modelFile)) {
			const tmp = modelFile.split("\\");
			const componentView = (tmp[tmp.length - 1]).replace(".cxml", "");
			const uri = `${componentView}://authority/${componentView}`;
			const index = this.componentsUri.indexOf(uri);
			if (index > -1) {
				return;
			}
			const graphicalFile = modelFile.replace(".cxml", "") + "_Graphical.xml";
			const componentGraphicalModel = {
				model: fs.readFileSync(modelFile).toString(),
				graphical: fs.readFileSync(graphicalFile).toString()
			};
			const previewHtmlCommand = "vscode.previewHtml";
			this.componentsUri.push(uri);
			this.allUri.push(uri);
			let previewUri = vscode.Uri.parse(uri);
			let provider = new TextDocumentContentProvider(this.context, componentGraphicalModel);
			let registration = vscode.workspace.registerTextDocumentContentProvider(componentView, provider);
			let disposable = vscode.commands.executeCommand(previewHtmlCommand, previewUri, vscode.ViewColumn.Three, componentView).then((success) => {
			}, (reason) => {
				vscode.window.showErrorMessage(reason);
			});
		}
	}

	dispose() {
		this.disposable.dispose();
	}

	private onEvent() {
		if (vscode.window.activeTextEditor) {
			this.draw();
		}
	}
}