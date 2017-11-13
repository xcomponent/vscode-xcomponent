import { CompletionProvider } from "./completionProvider";
import * as vscode from "vscode";

export class AttributeBasedCompletionProvider implements CompletionProvider {

    private tagName: string;
    private attributeName: string;

    constructor(tagName: string, attributeName: string) {
        this.tagName = tagName;
        this.attributeName = attributeName;
    }

    public createSuggestion(document: vscode.TextDocument): vscode.CompletionItem[] {
        return this.getAttributeValues(document)
            .map(value => new vscode.CompletionItem(value));
    }

    private getAttributeValues(document: vscode.TextDocument): string[] {
        const regexToGetValues = new RegExp(`<${this.tagName}[\\s\\S]*?${this.attributeName}="(.*?)"[\\s\\S]*?>`, "g");
        const content = document.getText();
        let match = regexToGetValues.exec(content);
        const values = new Set<string>();
        while (match !== null) {
            values.add(match[1]);
            match = regexToGetValues.exec(content);
        }
        return Array.from(values);
    }
}