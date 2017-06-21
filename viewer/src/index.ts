import { ComponentModelParser } from "./componentModelParser";
import { DrawComponent } from "./drawComponent";

const component = {
  model: document.currentScript.getAttribute("model"),
  graphical: document.currentScript.getAttribute("graphical")
};
const parser = new ComponentModelParser(component);
parser.parse()
  .then(() => {
    const drawComponent = new DrawComponent();
    drawComponent.draw(parser.getLinkDataArray(), parser.getNodeDataArray(), "diagram");
  })
  .catch((err) => {
    console.error("Parsing error");
    console.error(err);
  });