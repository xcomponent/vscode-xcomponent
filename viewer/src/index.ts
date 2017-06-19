import { Parser } from "./parser";
import { DrawComponent } from "./drawComponent";

const component = {
  model: document.currentScript.getAttribute("model"),
  graphical: document.currentScript.getAttribute("graphical")
};
const parser = new Parser(component);
parser.parse((err, p) => {
  if (err) {
    console.error(err);
    return;
  }
  const drawComponent = new DrawComponent();
  drawComponent.draw(p, "diagram");
});
