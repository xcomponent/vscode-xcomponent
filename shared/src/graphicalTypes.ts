export interface Graphical {
    ComponentGraphicalData: ComponentGraphicalData;
}

export interface ComponentGraphicalData {
    Links: Array<Links>;
    States: States;
    TransitionPatternStates: Array<TransitionPatternStates>;
    TransversalLinks: Array<TransversalLinks>;
}

export interface Links {
    TransitionGraphicalData: Array<TransitionGraphicalDataElement>;
}

export interface TransitionGraphicalDataElement {
    $: Properties;
    Points: Array<TransitionGraphicalDataPointElement>;
    IsNameDisplayed: string;
}

export interface TransitionGraphicalDataPointElement {
    Point: Array<PointGraphical>;
}

export interface PointGraphical {
    X: string;
    Y: string;
}

export interface States {
    StateGraphicalData: Array<Attribute<StateGraphicalDataElement>>;
}

export interface StateGraphicalDataElement {
    Id: string;
    CenterX: string;
    CenterY: string;
}

export interface TransitionPatternStates {
    StateGraphicalData: Array<Attribute<StateGraphicalDataElement>>;
}

export interface TransversalLinks {
    TransitionGraphicalData: Array<TransitionGraphicalDataElement>;
}

export interface Properties {
    Color: string;
    Curviness: string;
    Id: string;
}

export interface Attribute<T> {
    $: T;
}