import { parseString } from "xml2js";
import * as promisify from "es6-promisify";
import { Composition, LinkedComponent, ApiPortCounter, LinkDataArrayElement, Components, CompositionData } from "xcomponent-shared";

export class CompositionModel {

    private components: Components;
    private compositionString: string;

    constructor(components: Components, compositionString: string) {
        this.components = components;
        this.compositionString = compositionString;
    }

    load(): Promise<CompositionData> {
        const promiseParseString = promisify(parseString);
        return promiseParseString(this.compositionString).then((compositionJson: Composition) => {
            const data = this.getData(compositionJson, this.components);
            return {
                linkDataArray: data.linkDataArray,
                apiPortCounter: data.apiPortCounter,
                components: this.components
            };
        });
    }

    private getStateNameFromId(stateId: string, stateName: string): string {
        if (stateId === "-1") {
            return "";
        } else {
            return "&" + stateName;
        }
    }

    private getText(fromStateMachine: string, fromState: string, toStateMachine: string, toState: string): string {
        const from = (fromState === undefined) ? fromStateMachine : fromState;
        const to = (toState === undefined) ? toStateMachine : toState;
        return `${from} to ${to}`;
    }

    private getXCToApiLinks(linkedComponent: LinkedComponent, apiPortCounter: ApiPortCounter, linkDataArray: Array<LinkDataArrayElement>, components: Components): void {
        const componentName = linkedComponent.$.name;
        const xcToApiLinks = linkedComponent.XCToApiLinks[0].XCToApiLink;
        xcToApiLinks.forEach(xcToApiLink => {
            const stateMachine = components[componentName][xcToApiLink.$.stateMachineIdFrom];
            const stateMachineName = stateMachine.name;
            const stateName = this.getStateNameFromId(xcToApiLink.$.stateIdFrom, stateMachine.states[xcToApiLink.$.stateIdFrom]);
            const apiName = xcToApiLink.$.linkTo;
            if (apiPortCounter[apiName] === undefined) {
                apiPortCounter[apiName] = { in: 1, out: 1 };
            }
            const from = componentName;
            const fromPort = `${componentName}&${stateMachineName}${stateName}&out`;
            const to = apiName;
            const toPort = `${apiPortCounter[apiName].in}&in`;
            const text = this.getText(stateMachineName, stateMachine.states[xcToApiLink.$.stateIdFrom], apiName, apiName);
            linkDataArray.push({ from, fromPort, to, toPort, text });
            apiPortCounter[apiName].in++;
        });
    }

    private getXCToXCLinks(linkedComponent: LinkedComponent, apiPortCounter: ApiPortCounter, linkDataArray: Array<LinkDataArrayElement>, components: Components): void {
        const componentName = linkedComponent.$.name;
        const xcToXCLinks = linkedComponent.XCToXCLinks[0].XCToXCLink;
        if (xcToXCLinks === undefined)
            return;
        xcToXCLinks.forEach(xcToXCLink => {
            const stateMachine = components[componentName][xcToXCLink.$.stateMachineIdFrom];
            const stateMachineNameFrom = stateMachine.name;
            const stateNameFrom = this.getStateNameFromId(xcToXCLink.$.stateIdFrom, stateMachine.states[xcToXCLink.$.stateIdFrom]);
            const componentNameTo = xcToXCLink.$.linkTo;
            const stateMachineNameTo = stateMachine.name;
            const stateNameTo = this.getStateNameFromId(xcToXCLink.$.stateIdTo, stateMachine.states[xcToXCLink.$.stateIdTo]);
            const from = componentName;
            const fromPort = `${componentName}&${stateMachineNameFrom}${stateNameFrom}&out`;
            const to = componentNameTo;
            const toPort = `${componentNameTo}&${stateMachineNameTo}${stateNameTo}`;
            const text = this.getText(stateMachineNameFrom, stateMachine.states[xcToXCLink.$.stateIdFrom], stateMachineNameTo, stateMachine.states[xcToXCLink.$.stateIdTo]);
            linkDataArray.push({ from, fromPort, to, toPort, text });
        });

    }

    private getApiToXCLinks(compositionJson: Composition, apiPortCounter: ApiPortCounter, linkDataArray: Array<LinkDataArrayElement>, components: Components): void {
        const linkedClientApis = compositionJson.LinkingSchema.LinkedClientApis[0].LinkedClientApi;
        linkedClientApis.forEach(linkedClientApi => {
            const apiToXCLinks = linkedClientApi.ApiToXCLinks[0].ApiToXCLink || [];
            apiToXCLinks.forEach(apiToXCLink => {
                const apiName = linkedClientApi.$.name;
                if (apiPortCounter[apiName] === undefined) {
                    apiPortCounter[apiName] = { in: 1, out: 1 };
                }
                const componentNameTo = apiToXCLink.$.linkTo;
                const stateMachine = components[componentNameTo][apiToXCLink.$.stateMachineIdTo];
                const stateMachineNameTo = stateMachine.name;
                const stateNameTo = this.getStateNameFromId(apiToXCLink.$.stateIdTo, stateMachine.states[apiToXCLink.$.stateIdTo]);
                const from = linkedClientApi.$.name;
                const fromPort = `${apiPortCounter[apiName].out}&out`;
                const to = componentNameTo;
                const toPort = `${componentNameTo}&${stateMachineNameTo}${stateNameTo}`;
                const text = this.getText(from, from, stateMachineNameTo, stateMachine.states[apiToXCLink.$.stateIdTo]);
                const linkData = { from, fromPort, to, toPort, text };
                linkDataArray.push(linkData);
                apiPortCounter[apiName].out++;
            });
        });
    }

    private getData(compositionJson: Composition, components: Components) {
        const linkDataArray = [];
        const apiPortCounter = {};
        const linkedComponents = compositionJson.LinkingSchema.LinkedComponents[0].LinkedComponent;
        linkedComponents.forEach(linkedComponent => {
            this.getXCToApiLinks(linkedComponent, apiPortCounter, linkDataArray, components);
            this.getXCToXCLinks(linkedComponent, apiPortCounter, linkDataArray, components);
        });
        this.getApiToXCLinks(compositionJson, apiPortCounter, linkDataArray, components);
        return {
            linkDataArray,
            apiPortCounter
        };
    }
}


interface Model {
    ComponentData: ComponentData;
}

interface ComponentData {
    ComponentData: ComponentData;
    $: ModelProperties;
    Links: Array<ModelLinks>;
    StateMachines: Array<StateMachines>;
    States: Array<State>;
    TransitionPatternStates: Array<TransitionPatternStates>;
    TransversalTransitionData: Array<Attribute<TransversalTransitionData>>;
    TransversalLinks: Array<TransversalTransitionData>;
}

interface TransversalTransitionData {
    TransversalTransitionData: Array<Attribute<TransversalTransitionDataProterties>>;
}

interface TransversalTransitionDataProterties {
    FromKey: string;
    Id: string;
    Name: string;
    SelectAllTransitions: string;
    ToId: string;
    Type: string;
}

interface TransitionPatternStates {
    TransitionPatternStateData: Array<TransitionPatternStateData>;
}

interface TransitionPatternStateData {
    $: TransitionPatternStateDataProperties;
    SelectedStatesKeys: Array<SelectedStatesKeysProperties>;
}

interface SelectedStatesKeysProperties {
    string: Array<string>;
}

interface TransitionPatternStateDataProperties {
    Id: string;
    Name: string;
    SelectAllStates: string;
    SubGraphKey: string;
}

interface State {
    StateData: Array<Attribute<StateData>>;
}

interface StateData {
    Id: string;
    IsEntryPoint: string;
    Name: string;
    SubGraphKey: string;
}

interface StateMachines {
    StateMachineData: Array<Attribute<StateMachineData>>;
}

interface StateMachineData {
    Id: string;
    Name: string;
    PublicMember: string;
}

interface ModelLinks {
    TransitionData: Array<Attribute<TransitionData>>;
}

interface TransitionData {
    ExecutionDelay: string;
    FromKey: string;
    Id: string;
    Name: string;
    SetCustomTimeout: string;
    ToKey: string;
    TriggeringEvent: string;
    Type: string;
    UserSpecificRule: string;
}

interface ModelProperties {
    Name: string;
    Version: string;
}

interface Attribute<T> {
    $: T;
}
