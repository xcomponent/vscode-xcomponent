import { parseString as parseStringCallback } from "xml2js";
import * as promisify from "es6-promisify";
import { ComponentGraphicalModel } from "parserObjects";
import { Model } from "modelTypes";
import { Graphical } from "graphicalTypes";

let parseString = promisify(parseStringCallback);

export function parseModel(content: string): Promise<Model> {
        return parseString(content);
}

export function parseGraphical(content: string): Promise<Graphical> {
        return parseString(content);
}