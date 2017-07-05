export interface Composition {
    LinkingSchema: LinkingSchema;
};

export interface LinkingSchemaProperties {
    name: string;
};

export interface LinkingSchema {
    $: LinkingSchemaProperties;
    LinkedComponents: Array<LinkedComponentElement>;
    LinkedClientApis: Array<LinkedClientApis>;
};

export interface LinkedClientApis {
    LinkedClientApi: Array<LinkedClientApi>;
};

export interface LinkedClientApiAttribute {
    name: string;
};

export interface ApiToXCLink {
    linkFrom: string;
    linkTo: string;
    stateIdTo: string;
    stateMachineIdTo: string;
};

export interface ApiToXCLinks {
    ApiToXCLink: Array<Attribute<ApiToXCLink>>;
};

export interface LinkedClientApi {
    $: LinkedClientApiAttribute;
    ApiToXCLinks: Array<ApiToXCLinks>;
};

export interface LinkedComponentElement {
    LinkedComponent: Array<LinkedComponent>;
};

export interface LinkedComponentAttribute {
    name: string;
};
export interface XCToApiLinks {

    XCToApiLink: Array<Attribute<XCToApiLink>>;
};

export interface XCToApiLink {
    linkFrom: string;
    linkTo: string;
    stateIdFrom: string;
    stateMachineIdFrom: string;
};

export interface XCToXCLinks {
    XCToXCLink: Array<Attribute<XCToXCLink>>;
};

export interface XCToXCLink {
    linkFrom: string;
    linkTo: string;
    stateIdFrom: string;
    stateIdTo: string;
    stateMachineIdFrom: string;
    stateMachineIdTo: string;
};


export interface LinkedComponent {
    $: LinkedComponentAttribute;
    XCToApiLinks: Array<XCToApiLinks>;
    XCToXCLinks: Array<XCToXCLinks>;
};


export interface Attribute<T> {
    $: T
};

export type Components = { [componentName: string]: StateMachines };

export type StateMachines = { [stateMachineId: string]: StateMachineProperties };

export interface StateMachineProperties {
    name: string;
    states: States;
};
export type States = { [stateId: string]: string };

export interface LinkDataArrayElement {
    from: string;
    fromPort: string;
    to: string;
    toPort: string;
    text: string;
};

export interface NodeDataArrayElement {
    key: string;
    category: string;
};

export type ApiPortCounter = { [ApiName: string]: Counter };

export interface Counter {
    in: number;
    out: number;
};

export interface CompositionData {
    linkDataArray: Array<LinkDataArrayElement>;
    apiPortCounter: ApiPortCounter;
    components: Components;
};