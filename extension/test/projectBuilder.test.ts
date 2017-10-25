import * as path from "path";
import * as chai from "chai";
import * as deepEql from "deep-eql";
import { getCommands } from "../src/projectBuilder";

const inputPath = path.join(__dirname, "..", "..", "test", "inputs");
const xcmlPath = path.join(inputPath, "helloworld_Model.xcml");
const xcbuildPath = "/xcbuild";
const rootPath = "/root/HelloWorld";
const monoFacadesPath = path.join(inputPath, "other_input.txt");
const windowsPlaform = "win";
const linuxPlaform = "linux";

const expectedCommands = [
    {
        platform: "windows",
        commands: [
            `${xcbuildPath} --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=${xcmlPath}`,
            `${xcbuildPath} --exportRuntimes --compilationmode=Debug --env=Dev --output="${rootPath}${path.sep}XCR" --project=${xcmlPath}`,
            `${xcbuildPath} --compilationmode=Debug --exportInterface --env=Dev --output="${rootPath}${path.sep}output" --project=${xcmlPath}`
        ]
    },
    {
        platform: "linux",
        commands: [
            `mono ${xcbuildPath} --compilationmode=Debug --build --env=Dev --vs=VS2015 --project=${xcmlPath} --monoPath=“${monoFacadesPath}” --framework=Framework452 `,
            `mono ${xcbuildPath} --exportRuntimes --compilationmode=Debug --env=Dev --output="${rootPath}${path.sep}XCR" --project=${xcmlPath}`,
            `mono ${xcbuildPath} --compilationmode=Debug --exportInterface --env=Dev --output="${rootPath}${path.sep}output" --project=${xcmlPath}`
        ]
    }
];

describe("projectBuilder test", () => {
    it(`Given a wrongCxmlPath, getCommands should return undefined`, () => {
        const wrongCxmlPath = "";
        const commands = getCommands(xcbuildPath, wrongCxmlPath, rootPath, undefined, windowsPlaform);
        deepEql(commands, undefined).should.equal(true);
    });

    expectedCommands.forEach(test => {
        it(`Given a the right arguments in a ${test.platform} platform, getCommands should return the right commands`, () => {
            const commands = getCommands(xcbuildPath, rootPath, xcmlPath, monoFacadesPath, test.platform);
            deepEql(commands, test.commands).should.equal(true);
        });

    });

});