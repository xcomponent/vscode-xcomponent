import { graphicalTags, modelTags } from "configurationParser";
import { LinkLabelTemplate, TransitionTemplate, TriggerableTransitionTemplate, StateMachineTemplate, StateTemplate, LinkDataArrayTemplate, NodeDataArrayTemplate } from "gojsTemplates";
import { Point, Curve, StateMachine, State, ComponentGraphicalModel } from "parserObjects";
import { finalStateColor, stateColor, transitionPatternStateColor, entryPointStateColor } from "graphicColors";
import { parseString } from "xml2js";
import * as promisify from "es6-promisify";

export class Parser {
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
    private stateMachineNames: Array<string>;
    private linkDataArray: Array<LinkDataArrayTemplate>;
    private nodeDataArray: Array<NodeDataArrayTemplate>;

    constructor(componentGraphicalModel: ComponentGraphicalModel) {
        this.componentGraphicalModel = componentGraphicalModel;
    }

    private parseGraphical(graphicalJson): void {
        this.locations = {};
        let stateGraphicalData = graphicalJson.ComponentViewModelGraphicalData.States[0].StateGraphicalData;
        for (let i = 0; i < stateGraphicalData.length; i++) {
            const id = stateGraphicalData[i].$.Id;
            this.locations[id] = {
                x: parseFloat(stateGraphicalData[i].$.CenterX),
                y: parseFloat(stateGraphicalData[i].$.CenterY)
            };
        }

        stateGraphicalData = graphicalJson.ComponentViewModelGraphicalData.TransitionPatternStates[0].StateGraphicalData;
        stateGraphicalData = (stateGraphicalData === undefined) ? [] : stateGraphicalData;
        for (let i = 0; i < stateGraphicalData.length; i++) {
            const id = stateGraphicalData[i].$.Id;
            this.locations[id] = {
                x: parseFloat(stateGraphicalData[i].$.CenterX),
                y: parseFloat(stateGraphicalData[i].$.CenterY)
            };
        }

        let transitionGraphicalData;

        transitionGraphicalData = graphicalJson.ComponentViewModelGraphicalData.Links[0].TransitionGraphicalData;
        this.controlPointTransition = this.getControlPointTransition(transitionGraphicalData);

        transitionGraphicalData = graphicalJson.ComponentViewModelGraphicalData.TransversalLinks[0].TransitionGraphicalData;
        this.controlPointTriggerable = this.getControlPointTransition(transitionGraphicalData);
    }

    parse(parseListener: (error: Error, parser: Parser) => void) {
        const promisifyParserString = promisify(parseString);
        const thisObject = this;
        promisifyParserString(thisObject.componentGraphicalModel.graphical).then((result) => {
            thisObject.parseGraphical(result);
            return promisifyParserString(thisObject.componentGraphicalModel.model);
        }).then((result) => {
            thisObject.parseModel(result);
            parseListener(null, thisObject);
        }).catch((err) => {
            console.error("Parsing error");
            console.error(err);
            parseListener(err, null);
        });
    }

    private parseModel(modelJson): void {
        this.setComponentName(modelJson);
        this.setStateMachines(modelJson);
        this.setStates(modelJson);
        this.setLinks(modelJson);
        this.finalStates = this.setFinalStates();
        this.entryPointState = this.getEntyPointState();
        this.nodeDataArray = this.setNodeDataArray();
        this.nodeDataArray = this.nodeDataArray.concat(this.linksLabel);
        this.addControlPoint();
    }

    private setComponentName(modelJson): void {
        this.componentName = modelJson.ComponentViewModelData.$.Name;
    }

    private addControlPoint(): void {
        for (let i = 0; i < this.linkDataArray.length; i++) {
            if (this.linkDataArray[i].triggerable) {
                const keyLink = this.linkDataArray[i].key;
                const firstPoint = this.controlPointTriggerable[keyLink].firstPoint;
                const lastPoint = this.controlPointTriggerable[keyLink].lastPoint;
                const firstControlPoint = this.controlPointTriggerable[keyLink].firstControlPoint;
                const secondControlPoint = this.controlPointTriggerable[keyLink].secondControlPoint;
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y, lastPoint.x, lastPoint.y];
            } else {
                const keyLink = this.linkDataArray[i].key;
                const firstPoint = this.controlPointTransition[keyLink].firstPoint;
                const lastPoint = this.controlPointTransition[keyLink].lastPoint;
                const firstControlPoint = this.controlPointTransition[keyLink].firstControlPoint;
                const secondControlPoint = this.controlPointTransition[keyLink].secondControlPoint;
                this.linkDataArray[i].controls = [firstControlPoint.x, firstControlPoint.y, secondControlPoint.x, secondControlPoint.y];
            }
        }
    }

    private setNodeDataArray(): Array<NodeDataArrayTemplate> {
        const nodeDataArray: Array<NodeDataArrayTemplate> = [];
        let ids, state, stateMachine, id;
        ids = Object.keys(this.stateMachines);
        for (let i = 0; i < ids.length; i++) {
            stateMachine = this.stateMachines[ids[i]];
            nodeDataArray.push({
                "key": stateMachine.name,
                "text": stateMachine.name + " (0)",
                "isGroup": true,
                "numberOfInstances": 0
            });
        }
        ids = Object.keys(this.states).concat(Object.keys(this.transitionPatternStates));
        for (let j = 0; j < ids.length; j++) {
            console.error(this.locations);
            state = this.states[ids[j]];
            let loc, color, text;
            if (!this.states[ids[j]]) {
                id = ids[j].substring(modelTags.TP_State.length, ids[j].length);
                loc = this.locations[id].x + " " + this.locations[id].y;
                color = transitionPatternStateColor;
                state = this.transitionPatternStates[ids[j]];
                text = state.name;
            } else {
                id = ids[j].substring(modelTags.State.length, ids[j].length);
                loc = this.locations[id].x + " " + this.locations[id].y;
                text = state.name + " (0)";
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


    private getControlPointTransition(transitionGraphicalData: Array<any>): { [key: string]: Curve } {
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

    private setFinalStates(): Array<String> {
        const finalStates = [];
        for (let id in this.states) {
            if (this.states[id].isFinal) {
                finalStates.push(this.states[id].key);
            }
        }
        return finalStates;
    }

    private getEntyPointState(): string {
        for (let id in this.states) {
            if (this.states[id].isEntryPoint) {
                return this.states[id].key;
            }
        }
    }

    private setLinks(modelJson): void {
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
            this.linkDataArray.push({
                "key": key,
                "from": from.key,
                "stateMachineTarget": from.group,
                "to": to.key,
                "text": text,
                "messageType": linksJson[i].$.TriggeringEvent,
                "labelKeys": [key],
                "triggerable": false,
                "controls": null
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
                "controls": null
            });
        }
    }

    private setStates(modelJson): void {
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

    private setStateMachines(modelJson): void {
        const stateMachineJson = modelJson.ComponentViewModelData.StateMachines[0].StateMachineData;
        const stateMachines = {};
        const stateMachineNames = [];
        let id, name;
        for (let i = 0; i < stateMachineJson.length; i++) {
            id = stateMachineJson[i].$.Id;
            name = stateMachineJson[i].$.Name;
            stateMachines[modelTags.StateMachine + id] = {
                name: name,
                publicMember: stateMachineJson[i].$.PublicMember
            };
            stateMachineNames.push(name);
        }
        this.stateMachines = stateMachines;
        this.stateMachineNames = stateMachineNames;
    }

    public getFinalStates(): Array<String> {
        return this.finalStates;
    }

    public getEntryPointState(): string {
        return this.entryPointState;
    }

    public getEntryPointStateMachine(): string {
        return this.entryPointStateMachine;
    }

    public getStateMachineNames(): Array<string> {
        return this.stateMachineNames;
    }

    public getLinkDataArray(): Array<LinkDataArrayTemplate> {
        return this.linkDataArray;
    }

    public getNodeDataArray(): Array<NodeDataArrayTemplate> {
        return this.nodeDataArray;
    }

    public getComponentName(): string {
        return this.componentName;
    }
}