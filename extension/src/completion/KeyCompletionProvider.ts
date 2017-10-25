import { CompletionProvider } from "./completionProvider";
import * as vscode from "vscode";

interface StateMachineDetails {
    id: string;
    name: string;
}

export class KeyCompletionProvider implements CompletionProvider {

    private tag: string;
    private idAttribute: string;
    private descriptionAttribute: string;
    private keyPrefix: string;

    constructor(tag: string, idAttribute: string, descriptionAttribute: string, keyPrefix: string) {
        this.tag = tag;
        this.idAttribute = idAttribute;
        this.descriptionAttribute = descriptionAttribute;
        this.keyPrefix = keyPrefix;
    }

    public createSuggestion(document: vscode.TextDocument): vscode.CompletionItem[] {
        return this.getStateMachineDetails(document)
            .map(details => {
                const item = new vscode.CompletionItem(details.name);
                item.insertText = `${this.keyPrefix}${details.id}`;
                item.filterText = item.insertText;
                item.detail = "Key value:";
                item.documentation = item.insertText;
                return item;
            });
    }

    private getStateMachineDetails(document: vscode.TextDocument): StateMachineDetails[] {
        return this.getDetailsFromDocument(document, false).concat(this.getDetailsFromDocument(document, true));
    }

    private getDetailsFromDocument(document: vscode.TextDocument, reverseOrder: boolean) {
        const firstAttribute = reverseOrder ? this.descriptionAttribute : this.idAttribute;
        const secondAttribute = reverseOrder ? this.idAttribute : this.descriptionAttribute;
        const regexToGetStm = new RegExp(`<${this.tag}[^>]*${firstAttribute}="(.*?)"[^>]*${secondAttribute}="(.*?)"[\\s\\S]*?>`, "g");
        const content = document.getText();
        let match = regexToGetStm.exec(content);
        const details: StateMachineDetails[] = [];
        while (match !== null) {
            const idValue = reverseOrder ? match[2] : match[1];
            const nameValue = reverseOrder ? match[1] : match[2];
            details.push({
                id: idValue,
                name: nameValue
            });
            match = regexToGetStm.exec(content);
        }
        return details;
    }
}