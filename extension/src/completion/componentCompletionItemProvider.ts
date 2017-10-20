import { IdCompletionProvider } from "./IdCompletionProvider";
import * as vscode from "vscode";
export class ComponentCompletionItemProvider implements vscode.CompletionItemProvider {

    private completionProviders = [
        { tag: "StateData", attribute: "Id", provider: new IdCompletionProvider("StateData") }
    ];

    public provideCompletionItems(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.CompletionItem[]> {
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            const documentTextRange = new vscode.Range(new vscode.Position(position.line, 0), position);
            const textBeforeCursor = document.getText(documentTextRange);
            const tagName = this.getTagName(textBeforeCursor);
            const attribute = this.getAttributeName(textBeforeCursor);

            if (tagName && attribute) {
                const providerDetail = this.completionProviders.find(e => e.tag === tagName && e.attribute === attribute);
                if (providerDetail) {
                    const suggestions = providerDetail.provider.createSuggestion(document);
                    if (suggestions.length === 0) {
                        reject();
                        return;
                    }
                    resolve(suggestions);
                    return;
                }
            }

            reject();
        });
    }

    private getTagName(textBeforeCursor: string): string {
        const regex: RegExp = /<(\S*?)[\s|>]/;
        const matches = textBeforeCursor.match(regex);
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return undefined;
    }

    private getAttributeName(textBeforeCursor: string): string {
        const regex: RegExp = /\s(\S*?)="/g;
        let match = regex.exec(textBeforeCursor);
        let attribute = undefined;
        while (match !== null) {
            attribute = match[1];
            match = regex.exec(textBeforeCursor);
        }

        return attribute;
    }

}