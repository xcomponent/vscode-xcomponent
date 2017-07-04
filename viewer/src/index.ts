import { ComponentModelParser } from "./componentModelParser";
import { DrawComponent } from "./drawComponent";
import { DrawComponentData } from "gojsTemplates";

const composition = document.currentScript.getAttribute("composition");
if (composition) {
  console.log(composition);
  const models = JSON.parse(document.currentScript.getAttribute("models"));
  console.log(models);
} else {
  const model = document.currentScript.getAttribute("model");
  let graphical = document.currentScript.getAttribute("graphical");
  graphical = (graphical === "undefined") ? undefined : graphical;
  const parser = new ComponentModelParser({ model, graphical });
  parser.parse()
    .then((data: DrawComponentData) => {
      const drawComponent = new DrawComponent();
      drawComponent.draw(data, "diagram");
    })
    .catch((err) => {
      const messageError = "Error while parsing invalid cxml file";
      document.getElementById("error").innerHTML = messageError;
      console.error(err);
    });
}
