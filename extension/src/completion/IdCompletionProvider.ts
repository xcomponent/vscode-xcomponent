import { CompletionProvider } from "./completionProvider";
import * as vscode from "vscode";

export class IdCompletionProvider implements CompletionProvider {

    private tagName: string;
    constructor(tagName: string) {
        this.tagName = tagName;
    }

    public createSuggestion(document: vscode.TextDocument): vscode.CompletionItem[] {
        const newId = this.getNewId(document);
        return [new vscode.CompletionItem(newId.toString())];
    }

    private getNewId(document: vscode.TextDocument): number {
        const regexToGetIds = new RegExp(`<${this.tagName}[\\s\\S]*? Id="(.*?)" [\\s\\S]*?>`, "g");
        const content = document.getText();
        let match = regexToGetIds.exec(content);
        const ids = [];
        while (match !== null) {
            const existingId = Number(match[1]);
            if (existingId) {
                ids.push(existingId);
            }
            match = regexToGetIds.exec(content);
        }
        return Math.max(...ids) + 1;
    }
}