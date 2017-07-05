import * as go from "gojs";
import { parseString } from "xml2js";
import * as promisify from "es6-promisify";
import { CompositionData, LinkDataArrayElement, NodeDataArrayElement, Components, StateMachines } from "compositionTypes";

export class DrawComposition {
    private $: any;

    draw(data: CompositionData, divId: string): void {
        this.$ = go.GraphObject.make;
        const diagram = this.createDiagram(divId);
        const nodeDataArray = [];
        for (let componentName in data.components) {
            this.setStateMachinePanels(diagram, nodeDataArray, componentName, data.components);
        }
        this.setApiPanels(diagram, data, nodeDataArray);
        diagram.layout = this.$(go.LayeredDigraphLayout, { columnSpacing: 10 });
        diagram.initialContentAlignment = go.Spot.Center;
        diagram.linkTemplate = this.getLinkTemplate();
        diagram.model = this.getModel(nodeDataArray, data.linkDataArray);
    }

    private getPanel(column: number, row: number, text: string, portId: string, spot: go.Spot, leftMargin: number, rightMargin: number = 0, top: number = 5): go.Panel {
        const $ = this.$;
        return $(go.Panel, "Horizontal",
            { column: column, row: row, margin: new go.Margin(top, 0, 0, 0) },
            $(go.Shape, "Ellipse",
                { width: 6, height: 6, portId: portId, toSpot: spot, fromSpot: spot, margin: new go.Margin(0, rightMargin, 0, leftMargin), fill: "white", stroke: "white" }),
            $(go.TextBlock, text, { margin: new go.Margin(0, 0, 0, 5), stroke: "white" })
        );
    }

    private getRootPanel(): go.Panel {
        const $ = this.$;
        return $(go.Panel, "Table",
            $(go.RowColumnDefinition,
                { column: 0, alignment: go.Spot.Left }),
            $(go.RowColumnDefinition,
                { column: 2, alignment: go.Spot.Right }),
            $(go.TextBlock,
                {
                    column: 0, row: 0, columnSpan: 3, alignment: go.Spot.Center,
                    font: "bold 10pt sans-serif"
                },
                new go.Binding("text", "key"), { stroke: "white", margin: new go.Margin(10, 100, 0, 100) }));
    }

    private setStatePanels(componentName: string, stateMachineName: string, stateMachines: StateMachines, stateMachineCode: string, row: number, rootPanel: go.Panel): number {
        const states = stateMachines[stateMachineCode].states;
        for (let stateCode in states) {
            const stateName = states[stateCode];
            const statePortId = `${componentName}&${stateMachineName}&${stateName}`;
            rootPanel.add(this.getPanel(0, row, stateName, statePortId, go.Spot.Left, 20));
            rootPanel.add(this.getPanel(2, row++, "", `${statePortId}&out`, go.Spot.Right, 10, 10));
        }
        return row;
    }

    private setStateMachinePanels(diagram: go.Diagram, nodeDataArray: Array<NodeDataArrayElement>, componentName: string, components: Components): void {
        nodeDataArray.push({ key: componentName, category: componentName });
        const rootPanel = this.getRootPanel();
        let row = 1;
        const stateMachines = components[componentName];
        for (let stateMachineCode in stateMachines) {
            const stateMachineName = stateMachines[stateMachineCode].name;
            const portId = `${componentName}&${stateMachineName}`;
            rootPanel.add(this.getPanel(0, row, stateMachineName, portId, go.Spot.Left, 10, 0, 15));
            rootPanel.add(this.getPanel(2, row++, "", `${portId}&out`, go.Spot.Right, 10, 0, 15));
            row = this.setStatePanels(componentName, stateMachineName, stateMachines, stateMachineCode, row, rootPanel);
        }
        diagram.nodeTemplateMap.add(componentName, this.$(go.Node, "Auto",
            this.$(go.Shape, "Rectangle", { fill: "lightblue", stroke: "lightblue" }),
            rootPanel
        ));
    }

    private setApiPanels(diagram: go.Diagram, data: CompositionData, nodeDataArray: Array<NodeDataArrayElement>): void {
        for (let apiName in data.apiPortCounter) {
            const rootPanel = this.getRootPanel();
            for (let i = 1; i <= data.apiPortCounter[apiName].in; i++) {
                rootPanel.add(this.getPanel(0, i, "", `${i}&in`, go.Spot.Left, 10, 0));
            }
            for (let j = 1; j <= data.apiPortCounter[apiName].out; j++) {
                rootPanel.add(this.getPanel(2, j, "", `${j}&out`, go.Spot.Right, 10, 0));
            }
            diagram.nodeTemplateMap.add(apiName, this.$(go.Node, "Auto",
                this.$(go.Shape, "Rectangle", { fill: "green", stroke: "green" }),
                rootPanel
            ));
            nodeDataArray.push({ key: apiName, category: apiName });
        }
    }

    private getModel(nodeDataArray: Array<NodeDataArrayElement>, linkDataArray: Array<LinkDataArrayElement>): go.Model {
        return this.$(go.GraphLinksModel, {
            linkFromPortIdProperty: "fromPort",
            linkToPortIdProperty: "toPort",
            nodeDataArray: nodeDataArray,
            linkDataArray: linkDataArray
        });
    }

    private getLinkTemplate(): go.Link {
        const $ = this.$;
        return $(go.Link,
            { routing: go.Link.AvoidsNodes },
            $(go.Shape),
            $(go.Shape, { toArrow: "Standard" }),
            $(go.TextBlock, new go.Binding("text", "text"))
        );
    }

    private createDiagram(divId: string): go.Diagram {
        return this.$(go.Diagram, divId, {
            contentAlignment: go.Spot.Center,
            "animationManager.isInitial": false,
            "undoManager.isEnabled": true
        });
    }
}