import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import { CompositionModelProvider } from "./compositionModelProvider";

export class CompositionViewerProvider implements vscode.TextDocumentContentProvider {

    private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
    private context: vscode.ExtensionContext;

    public constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public provideTextDocumentContent(uri: vscode.Uri): string {
        const compositionModelProvider = new CompositionModelProvider();
        let composition, components;
        try {
            composition = compositionModelProvider.getComposition();
            components = compositionModelProvider.getComponentsData();
        } catch (e) {
            console.error(e);
            composition = undefined;
            components = undefined;
        }
        let body;
        if (composition === undefined || components === undefined) {
            body = this.errorSnippet("Cannot preview the file");
        } else {
            body = this.previewSnippet(composition, JSON.stringify(components));
        }
        const html = `<!DOCTYPE html><html>${body}</html>`;
        return html;
    }

    private errorSnippet(error: string): string {
        return `<body>${error}</body>`;
    }

    private previewSnippet(composition: string, components: string): string {
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
        const script = `<script type="text/javascript" src="file:///${this.getBundlePath("out/viewer/bundle.js")}" components='${components}' composition='${composition}'></script>`;
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