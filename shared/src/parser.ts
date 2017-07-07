import { parseString as parseStringCallback } from "xml2js";
import * as promisify from "es6-promisify";
import { ComponentGraphicalModel } from "parserObjects";
import { Model } from "modelTypes";
import { Graphical } from "graphicalTypes";
import { CompositionData } from "compositionTypes";

const parseString = promisify(parseStringCallback);

export const parseModel = (content: string): Promise<Model> => {
        return parseString(content);
};

export const parseGraphical = (content: string): Promise<Graphical> => {
        return parseString(content);
};

export const parseComposition = (content: string): Promise<CompositionData> => {
        return parseString(content);
};