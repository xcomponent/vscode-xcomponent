import { CompletionProvider } from "./completionProvider";
import * as vscode from "vscode";

interface StateMachineDetails {
    id: string;
    name: string;
}

const IdAttribute = "Id";
const NameAttribute = "Name";

export class SubGraphKeyCompletionProvider implements CompletionProvider {

    public createSuggestion(document: vscode.TextDocument): vscode.CompletionItem[] {
        return this.getStateMachineDetails(document)
            .map(details => {
                const item = new vscode.CompletionItem(`StateMachine${details.id}`);
                item.documentation = details.name;
                return item;
            });
    }

    private getStateMachineDetails(document: vscode.TextDocument): StateMachineDetails[] {
        return this.getDetailsFromDocument(document, false).concat(this.getDetailsFromDocument(document, true));
    }

    private getDetailsFromDocument(document: vscode.TextDocument, reverseOrder: boolean) {
        const firstAttribute = reverseOrder ? NameAttribute : IdAttribute;
        const secondAttribute = reverseOrder ? IdAttribute : NameAttribute;
        const regexToGetStm = new RegExp(`<StateMachineData[^>]*${firstAttribute}="(.*?)"[^>]*${secondAttribute}="(.*?)"[\\s\\S]*?>`, "g");
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