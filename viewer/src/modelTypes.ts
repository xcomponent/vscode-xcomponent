export interface Model {
    ComponentViewModelData: ComponentViewModelData;
}

export interface ComponentViewModelData {
    ComponentViewModelData: ComponentViewModelData;
    $: ModelProperties;
    Links: Array<ModelLinks>;
    StateMachines: Array<StateMachines>;
    States: Array<State>;
    TransitionPatternStates: Array<TransitionPatternStates>;
    TransversalTransitionData: Array<$<TransversalTransitionData>>;
    TransversalLinks: Array<TransversalTransitionData>;
}

export interface TransversalTransitionData {
    TransversalTransitionData: Array<$<TransversalTransitionDataProterties>>;
}

export interface TransversalTransitionDataProterties {
    FromKey: string;
    Id: string;
    Name: string;
    SelectAllTransitions: string;
    ToId: string;
    Type: string;
}

export interface TransitionPatternStates {
    TransitionPatternStateData: Array<TransitionPatternStateData>;
}

export interface TransitionPatternStateData {
    $: TransitionPatternStateDataProperties;
    SelectedStatesKeys: Array<SelectedStatesKeysProperties>;
}

export interface SelectedStatesKeysProperties {
    string: Array<string>;
}

export interface TransitionPatternStateDataProperties {
    Id: string;
    Name: string;
    SelectAllStates: string;
    SubGraphKey: string;
}

export interface State {
    StateData: Array<$<StateData>>;
}

export interface StateData {
    Id: string;
    IsEntryPoint: string;
    Name: string;
    SubGraphKey: string;
}

export interface StateMachines {
    StateMachineData: Array<$<StateMachineData>>;
}

export interface StateMachineData {
    Id: string;
    Name: string;
    PublicMember: string;
}

export interface ModelLinks {
    TransitionData: Array<$<TransitionData>>;
}

export interface TransitionData {
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

export interface ModelProperties {
    Name: string;
    Version: string;
}

export interface $<T> {
    $: T;
}