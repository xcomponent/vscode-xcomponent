import { CompletionProvider } from "./completionProvider";
import * as vscode from "vscode";

export interface CompletionItem {
    value: string;
    description?: string;
}

export class BasicCompletionProvider implements CompletionProvider {

    private completionItems: CompletionItem[];
    constructor(completionItems: CompletionItem[]) {
        this.completionItems = completionItems;
    }

    public createSuggestion(document: vscode.TextDocument): vscode.CompletionItem[] {
        return this.completionItems.map(item => {
            const completionItem = new vscode.CompletionItem(item.value);
            if (item.description) {
                completionItem.documentation = item.description;
            }
            return completionItem;
        });
    }

}