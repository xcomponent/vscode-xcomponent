import { CompletionProvider } from "./completionProvider";
import { IdCompletionProvider } from "./IdCompletionProvider";
import * as vscode from "vscode";
import { SubGraphKeyCompletionProvider } from "./SubGraphKeyCompletionProvider";
import { BasicCompletionProvider } from "./BasicCompletionProvider";
import { AttributeBasedCompletionProvider } from "./AttributeBasedCompletionProvider";

interface CompletionProviderDetail {
    tag: string;
    attribute?: string;
    provider: CompletionProvider;
}
export class ComponentCompletionItemProvider implements vscode.CompletionItemProvider {

    private completionProviders: CompletionProviderDetail[] = [
        { tag: "StateData", attribute: "Id", provider: new IdCompletionProvider("StateData") },
        { tag: "StateData", attribute: "SubGraphKey", provider: new SubGraphKeyCompletionProvider() },
        {
            tag: "StateData", provider: new BasicCompletionProvider([
                { value: "Id", description: "State Id" },
                { value: "Name", description: "State Name" },
                { value: "IsEntryPoint", description: "Property used to define an entry point state" },
                { value: "SubGraphKey", description: "Key (StateMachine + Id) of the state machine that contains this state" }
            ])
        },
        { tag: "TriggeredMethodData", attribute: "TransitionName", provider: new AttributeBasedCompletionProvider("TransitionData", "Name") },
        { tag: "TriggeredMethodData", attribute: "TriggeringEvent", provider: new AttributeBasedCompletionProvider("TransitionData", "TriggeringEvent") },
        {
            tag: "TriggeredMethodData", provider: new BasicCompletionProvider([
                { value: "IsNodeInitializer" },
                { value: "IsSelected" },
                { value: "TransitionName", description: "Transition name" },
                { value: "TriggeringEvent", description: "Triggering event" },
                { value: "IsExternal" }
            ])
        },
        { tag: "StateMachineData", attribute: "Id", provider: new IdCompletionProvider("StateMachineData") },
        {
            tag: "StateMachineData", provider: new BasicCompletionProvider([
                { value: "Id" },
                { value: "Name" },
                { value: "PublicMember" },
                { value: "InternalMember" }
            ])
        },
        { tag: "TransitionData", attribute: "Id", provider: new IdCompletionProvider("TransitionData") },
        {
            tag: "TransitionData", provider: new BasicCompletionProvider([
                { value: "Id" },
                { value: "Name" },
                { value: "FromKey" },
                { value: "ToKey" },
                { value: "Type" },
                { value: "ExecutionDelay" },
                { value: "SetCustomTimeout" },
                { value: "TriggeringEvent" },
                { value: "UserSpecificRule" }
            ])
        },
    ];

    public provideCompletionItems(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.CompletionItem[]> {
        return new Promise<vscode.CompletionItem[]>((resolve, reject) => {
            const currentLineTextRange = new vscode.Range(new vscode.Position(position.line, 0), position);
            const allTextRange = new vscode.Range(new vscode.Position(0, 0), position);
            const textLineBeforeCursor = document.getText(currentLineTextRange);
            const allTextBeforeCursor = document.getText(allTextRange);
            console.error(textLineBeforeCursor);
            const tagName = this.getTagName(allTextBeforeCursor);
            const attribute = this.getAttributeName(textLineBeforeCursor);

            if (tagName) {
                const providerDetail = attribute ? this.completionProviders.find(e => e.tag === tagName && e.attribute === attribute)
                    : this.completionProviders.find(e => e.tag === tagName && e.attribute === undefined);
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

    private getTagName(allTextBeforeCursor: string): string {
        const regex: RegExp = /<([^/]\S*?)[\s|>]/g;
        let match = regex.exec(allTextBeforeCursor);
        let tag = undefined;
        while (match !== null) {
            tag = match[1];
            match = regex.exec(allTextBeforeCursor);
        }
        return tag;
    }

    private getAttributeName(textBeforeCursor: string): string {
        const regex: RegExp = /\s(\S*?)="/g;
        let match = regex.exec(textBeforeCursor);
        let attribute = undefined;
        while (match !== null) {
            attribute = match[1];
            match = regex.exec(textBeforeCursor);
        }

        return this.checkIfEditingAttribute(textBeforeCursor, attribute) ? attribute : undefined;
    }

    private checkIfEditingAttribute(textBeforeCursor: string, attribute: string): boolean {
        if (attribute) {
            const regexContext: RegExp = new RegExp(`${attribute}="[^"]*"`);
            const contextMatch = textBeforeCursor.match(regexContext);
            if (contextMatch !== null && contextMatch.length > 0) {
                return false;
            }
            return true;
        }
        return false;
    }

}