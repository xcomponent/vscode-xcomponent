import { LinkLabelTemplate, TransitionTemplate, TriggerableTransitionTemplate, StateMachineTemplate, StateTemplate, LinkDataArrayTemplate, NodeDataArrayTemplate } from "gojsTemplates";
import { finalStateColor, stateColor, transitionPatternStateColor, entryPointStateColor } from "graphicColors";
import { Graphical, Attribute, StateGraphicalDataElement, TransitionGraphicalDataElement, Model, Point, Curve, StateMachine, State, ComponentGraphicalModel } from "xcomponent-shared";
import { DrawComponentData } from "gojsTemplates";
import * as shared from "xcomponent-shared";

const parseModel = shared["xcomponent-shared"].parseModel;
const parseGraphical = shared["xcomponent-shared"].parseGraphical;
const modelTags = shared["xcomponent-shared"].modelTags; 
const graphicalTags = shared["xcomponent-shared"].graphicalTags; 


export class ComponentModel {
    private locations: { [key: string]: Point };
    private controlPointTransition: { [key: string]: Curve };
    private controlPointTriggerable: { [key: string]: Curve };
    private stateMachines: { [key: string]: StateMachine };
    private states: { [key: string]: State };
    private transitionPatternStates: { [key: string]: State };
    private linksLabel: Array<LinkLabelTemplate>;
    private componentGraphicalModel: ComponentGraphicalModel;

    private componentName: string;
    private finalStates: Array<String>;
    private entryPointState: string;
    private entryPointStateMachine: string;
    private linkDataArray: Array<LinkDataArrayTemplate>;
    private nodeDataArray: Array<NodeDataArrayTemplate>;

    constructor(componentGraphicalModel: ComponentGraphicalModel) {
        this.componentGraphicalModel = componentGraphicalModel;
    }

    public load(): Promise<DrawComponentData> {
        const modelContent = this.componentGraphicalModel.model;
        const graphicalContent = this.componentGraphicalModel.graphical;
        let parsedModel: Promise<Model>;

        if (graphicalContent) {
            parsedModel = parseGraphical(graphicalContent).then((graphical: Graphical) => {
                this.loadGraphical(graphical);
                return parseModel(modelContent);
            });
        } else {
            parsedModel = parseModel(modelContent);
        }

        return parsedModel.then((model: Model) => {
            this.loadModel(model);
            return {
                nodeDataArray: this.nodeDataArray,
                linkDataArray: this.linkDataArray
            };
        });
    }

    public getLocationState(graphicalJson: Graphical): { [key: string]: Point } {
        const locations = {};
        let stateGraphicalData: Array<Attribute<StateGraphicalDataElement>> = graphicalJson.ComponentViewModelGraphicalData.States[0].StateGraphicalData;
        for (let i = 0; i < stateGraphicalData.length; i++) {
            const id = stateGraphicalData[i].$.Id;
            locations[id] = {
                x: parseFloat(stateGraphicalData[i].$.CenterX),
                y: parseFloat(stateGraphicalData[i].$.CenterY)
            };
        }

        stateGraphicalData = graphicalJson.ComponentViewModelGraphicalData.TransitionPatternStates[0].StateGraphicalData;
        stateGraphicalData = (stateGraphicalData === undefined) ? [] : stateGraphicalData;
        for (let i = 0; i < stateGraphicalData.length; i++) {
            const id = stateGraphicalData[i].$.Id;
            locations[id] = {
                x: parseFloat(stateGraphicalData[i].$.CenterX),
                y: parseFloat(stateGraphicalData[i].$.CenterY)
            };
        }

        return locations;
    }

    private loadGraphical(graphicalJson: Graphical): void {
        this.locations = this.getLocationState(graphicalJson);
        this.controlPointTransition = this.getControlPointTransition(graphicalJson.ComponentViewModelGraphicalData.Links[0].TransitionGraphicalData);
        this.controlPointTriggerable = this.getControlPointTransition(graphicalJson.ComponentViewModelGraphicalData.TransversalLinks[0].TransitionGraphicalData);
    }

    private loadModel(modelJson: Model): void {
        this.componentName = this.getComponentName(modelJson);
        this.setStateMachines(modelJson);
        this.setStates(modelJson);
        this.setLinks(modelJson);
        this.finalStates = this.setFinalStates();
        this.nodeDataArray = this.setNodeDataArray();
        this.nodeDataArray = this.nodeDataArray.concat(this.linksLabel);
        const graphical = this.componentGraphicalModel.graphical;
        if (graphical) {
            this.addControlPoint();
        }
    }

    public getComponentName(modelJson: Model): string {
        return modelJson.ComponentViewModelData.$.Name;
    }

    public addControlPoint(): void {
        for (let i = 0; i < this.linkDataArray.length; i++) {
            const keyLink = this.linkDataArray[i].key;
            const controlPoint = (this.linkDataArray[i].triggerable) ? this.controlPointTriggerable : this.controlPointTransition;
            if (controlPoint[keyLink] === undefined || controlPoint[keyLink] === undefined) {
                continue;
            }
            const firstPoint = controlPoint[keyLink].firstPoint;
            const lastPoint = controlPoint[keyLink].lastPoint;
            const firstControlPoint = controlPoint[keyLink].firstControlPoint;
            const secondControlPoint = controlPoint[keyLink].secondControlPoint;
            if (this.linkDataArray[i].triggerable) {
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y, lastPoint.x, lastPoint.y];
            } else {
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y];
            }
        }
    }

    public setNodeDataArray(): Array<NodeDataArrayTemplate> {
        const nodeDataArray: Array<NodeDataArrayTemplate> = [];
        let ids, state, stateMachine, id;
        ids = Object.keys(this.stateMachines);
        for (let i = 0; i < ids.length; i++) {
            stateMachine = this.stateMachines[ids[i]];
            nodeDataArray.push({
                "key": stateMachine.name,
                "text": stateMachine.name,
                "isGroup": true,
                "numberOfInstances": 0
            });
        }
        ids = Object.keys(this.states).concat(Object.keys(this.transitionPatternStates));
        for (let j = 0; j < ids.length; j++) {
            state = this.states[ids[j]];
            let loc, color, text;
            if (!this.states[ids[j]]) {
                id = ids[j].substring(modelTags.TP_State.length, ids[j].length);
                loc = (this.locations && this.locations[id]) ? this.locations[id].x + " " + this.locations[id].y : undefined;
                color = transitionPatternStateColor;
                state = this.transitionPatternStates[ids[j]];
                text = state.name;
            } else {
                id = ids[j].substring(modelTags.State.length, ids[j].length);
                loc = (this.locations && this.locations[id]) ? this.locations[id].x + " " + this.locations[id].y : undefined;
                text = state.name;
                if (state.isFinal) {
                    color = finalStateColor;
                } else if (!state.isEntryPoint) {
                    color = stateColor;
                } else {
                    color = entryPointStateColor;
                }
            }
            nodeDataArray.push({
                "key": state.key,
                "text": text,
                "group": state.group,
                "stateName": state.name,
                "numberOfStates": 0,
                "fill": color,
                "stroke": color,
                "loc": loc
            });
        }
        return nodeDataArray;
    }


    public getControlPointTransition(transitionGraphicalData: Array<TransitionGraphicalDataElement>): { [key: string]: Curve } {
        const controlPoints: { [key: string]: Curve } = {};
        for (let i = 0; i < transitionGraphicalData.length; i++) {
            const id = transitionGraphicalData[i].$.Id;
            const points = transitionGraphicalData[i].Points[0].Point;
            const firstPoint = {
                x: parseFloat(points[0].X[0]),
                y: parseFloat(points[0].Y[0])
            };
            const firstControlPoint = {
                x: parseFloat(points[1].X[0]),
                y: parseFloat(points[1].Y[0])
            };
            const secondControlPoint = {
                x: parseFloat(points[2].X[0]),
                y: parseFloat(points[2].Y[0])
            };
            const lastPoint = {
                x: parseFloat(points[3].X[0]),
                y: parseFloat(points[3].Y[0])
            };
            const controlPoint = {
                firstPoint,
                firstControlPoint,
                secondControlPoint,
                lastPoint
            };
            controlPoints[id] = controlPoint;
        }
        return controlPoints;
    }

    private getLocation(id: string): string {
        id = id.substring(modelTags.State.length, id.length);
        return this.locations[id].x + " " + this.locations[id].y;
    }

    public setFinalStates(): Array<String> {
        const finalStates = [];
        for (let id in this.states) {
            if (this.states[id].isFinal) {
                finalStates.push(this.states[id].key);
            }
        }
        return finalStates;
    }

    public setLinks(modelJson: Model): void {
        const linksJson = modelJson.ComponentViewModelData.Links[0].TransitionData;
        this.linkDataArray = [];
        this.linksLabel = [];
        let key,
            from,
            to,
            text;
        for (let i = 0; i < linksJson.length; i++) {
            from = this.states[linksJson[i].$.FromKey];
            if (!from) {
                from = this.transitionPatternStates[linksJson[i].$.FromKey];
                for (let k = 0; k < from.selectedStatesKeys.length; k++) {
                    this.states[from.selectedStatesKeys[k]].isFinal = false;
                }
            }
            from.isFinal = false;
            to = this.states[linksJson[i].$.ToKey];
            text = linksJson[i].$.Name;
            key = linksJson[i].$.Id;
            const isForkTransition = from.group === to.key.split(modelTags.Separator)[0];
            const color = (isForkTransition) ? "black" : "green";
            this.linkDataArray.push({
                "key": key,
                "from": from.key,
                "stateMachineTarget": from.group,
                "to": to.key,
                "text": text,
                "messageType": linksJson[i].$.TriggeringEvent,
                "labelKeys": [key],
                "triggerable": false,
                "controls": null,
                "strokeLink": color,
                "strokeArrow": color,
                "fillArrow": color
            });
            this.linksLabel.push({
                "key": key,
                "category": "LinkLabel",
                "text": text
            });
        }
        const triggerableLinksJson = modelJson.ComponentViewModelData.TransversalLinks[0].TransversalTransitionData;
        for (let j = 0; j < triggerableLinksJson.length; j++) {
            from = this.states[triggerableLinksJson[j].$.FromKey];
            if (!from)
                from = this.transitionPatternStates[triggerableLinksJson[j].$.FromKey];
            this.linkDataArray.push({
                "key": triggerableLinksJson[j].$.Id,
                "from": from.key,
                "to": triggerableLinksJson[j].$.ToId,
                "strokeLink": "red",
                "strokeArrow": "red",
                "fillArrow": "red",
                "triggerable": true,
                "controls": null,
                "dash": [3, 2]
            });
        }
    }

    public setStates(modelJson: Model): void {
        const statesJson = modelJson.ComponentViewModelData.States[0].StateData;
        const states = {};
        let id,
            group,
            name,
            isEntryPoint;
        let entryPointStateMachine;
        for (let i = 0; i < statesJson.length; i++) {
            id = statesJson[i].$.SubGraphKey;
            group = this.stateMachines[id].name;
            name = statesJson[i].$.Name;
            isEntryPoint = statesJson[i].$.IsEntryPoint === "true";
            states[modelTags.State + statesJson[i].$.Id] = {
                name: name,
                group: group,
                key: group + modelTags.Separator + name,
                isFinal: true,
                isEntryPoint: isEntryPoint
            };
            if (isEntryPoint) {
                entryPointStateMachine = group;
            }

        }
        // transition pattern state
        const transitionPatternStates = {};
        let transitionPatternStateDataJson = modelJson.ComponentViewModelData.TransitionPatternStates[0].TransitionPatternStateData;
        transitionPatternStateDataJson = (transitionPatternStateDataJson === undefined) ? [] : transitionPatternStateDataJson;
        for (let i = 0; i < transitionPatternStateDataJson.length; i++) {
            id = transitionPatternStateDataJson[i].$.SubGraphKey;
            group = this.stateMachines[id].name;
            name = transitionPatternStateDataJson[i].$.Name;
            const selectedStatesKeys = [];
            const selectedStatesKeysJson = transitionPatternStateDataJson[i].SelectedStatesKeys[0].string;
            for (let k = 0; k < selectedStatesKeysJson.length; k++) {
                selectedStatesKeys.push(selectedStatesKeysJson[k]);
            }
            transitionPatternStates[modelTags.TP_State + transitionPatternStateDataJson[i].$.Id] = {
                name: name,
                group: group,
                key: group + modelTags.Separator + name,
                isFinal: true,
                isPatternTransitionState: true,
                selectedStatesKeys: selectedStatesKeys
            };
        }
        this.states = states;
        this.transitionPatternStates = transitionPatternStates;
        this.entryPointStateMachine = entryPointStateMachine;
    }

    public setStateMachines(modelJson: Model): void {
        const stateMachineJson = modelJson.ComponentViewModelData.StateMachines[0].StateMachineData;
        const stateMachines = {};
        let id, name;
        for (let i = 0; i < stateMachineJson.length; i++) {
            id = stateMachineJson[i].$.Id;
            name = stateMachineJson[i].$.Name;
            stateMachines[modelTags.StateMachine + id] = {
                name: name,
                publicMember: stateMachineJson[i].$.PublicMember
            };
        }
        this.stateMachines = stateMachines;
    }
}