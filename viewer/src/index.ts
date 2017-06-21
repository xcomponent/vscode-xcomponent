import { ComponentModelParser } from "./componentModelParser";
import { DrawComponent } from "./drawComponent";
import { DrawComponentData } from "gojsTemplates";

const component = {
  model: document.currentScript.getAttribute("model"),
  graphical: document.currentScript.getAttribute("graphical")
};
const parser = new ComponentModelParser(component);
parser.parse()
  .then((data: DrawComponentData) => {
    const drawComponent = new DrawComponent();
    drawComponent.draw(data, "diagram");
  })
  .catch((err) => {
    console.error("Parsing error");
    console.error(err);
  });