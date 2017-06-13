import { Parser } from "parser";
import { DrawComponent } from "drawComponent";

const component = {
  model: document.currentScript.getAttribute("model"),
  graphical: document.currentScript.getAttribute("graphical")
};
const parser = new Parser(component);
parser.parse();
const drawComponent = new DrawComponent();
drawComponent.draw(parser, "diagram");