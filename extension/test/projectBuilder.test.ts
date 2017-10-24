import * as path from "path";
import * as chai from "chai";
import * as deepEql from "deep-eql";
import { getCommands } from "../src/projectBuilder";

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");
const xcmlPath = path.join(inputPath,"helloworld_Model.xcml");
const xcbuildPath = "/xcbuild";
const rootPath = "/root/HelloWorld";
const monoFacadesPath = path.join(inputPath,"other_input.txt");
const windowsPlaform = "win";
const linuxPlaform = "linux";

describe("projectBuilder test", () => {
    it(`Given a wrongCxmlPath, getCommands should return undefined`, () => {
        const wrongCxmlPath = "";
        const commands = getCommands(xcbuildPath, wrongCxmlPath, rootPath, undefined, windowsPlaform);
        deepEql(commands, undefined).should.equal(true);
    });

    it(`Given a the right argument in a windows platform, getCommands should return the right commands`, () => {
        let buildCommand = `${xcbuildPath} --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=${xcmlPath}`;
        let exportRuntimesCommand = `${xcbuildPath} --exportRuntimes --compilationmode=Debug --env=Dev --output="${rootPath}${path.sep}XCR" --project=${xcmlPath}`;
        let exportInterfaceCommand = `${xcbuildPath} --compilationmode=Debug --exportInterface --env=Dev --output="${rootPath}${path.sep}output" --project=${xcmlPath}`;
        const expectedCommands = [buildCommand, exportRuntimesCommand, exportInterfaceCommand];
        const commands = getCommands(xcbuildPath, rootPath, xcmlPath, undefined, windowsPlaform);
        deepEql(commands, expectedCommands).should.equal(true);
    });

    it(`Given a the right argument in a linux platform, getCommands should return the right commands`, () => {
        const buildCommand = `mono ${xcbuildPath} --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=${xcmlPath} --monoPath=“${monoFacadesPath}” --framework=Framework452 `;
        const exportRuntimesCommand = `mono ${xcbuildPath} --exportRuntimes --compilationmode=Debug --env=Dev --output="${rootPath}${path.sep}XCR" --project=${xcmlPath}`;
        const exportInterfaceCommand = `mono ${xcbuildPath} --compilationmode=Debug --exportInterface --env=Dev --output="${rootPath}${path.sep}output" --project=${xcmlPath}`;
        const expectedCommands = [buildCommand, exportRuntimesCommand, exportInterfaceCommand];
        const commands = getCommands(xcbuildPath, rootPath, xcmlPath, monoFacadesPath, linuxPlaform);
        deepEql(commands, expectedCommands).should.equal(true);
    });

});