import { parseString } from "xml2js";
import * as promisify from "es6-promisify";
import { ComponentGraphicalModel } from "parserObjects";
import { Model } from "modelTypes";
import { Graphical } from "graphicalTypes";

export class Parser {
    private promisifyParseString: any;

    constructor() {
        this.promisifyParseString = promisify(parseString);
    }

    parseModel(model: string): Promise<Model> {
        return this.promisifyParseString(model);
    }

    parseGraphical(graphical: string): Promise<Graphical> {
        return this.promisifyParseString(graphical);
    }
}

