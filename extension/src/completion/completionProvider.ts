import * as vscode from "vscode";

export interface CompletionProvider {
    createSuggestion(document: vscode.TextDocument): vscode.CompletionItem[];
}