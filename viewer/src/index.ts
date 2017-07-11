import { ComponentModel } from "./componentModel";
import { DrawComponent } from "./drawComponent";
import { DrawComponentData } from "gojsTemplates";
import { CompositionModel } from "compositionModel";
import { DrawComposition } from "drawComposition";
import { CompositionData } from "xcomponent-shared";

const drawComposition = () => {
  const components = JSON.parse(document.currentScript.getAttribute("components"));
  const compositionString = document.currentScript.getAttribute("composition");
  const compositionModelParser = new CompositionModel(components, compositionString);
  compositionModelParser.load()
    .then((data: CompositionData) => {
      new DrawComposition().draw(data, "diagram");
    })
    .catch(err => errorListener(err));
};

const drawComponent = () => {
  const model = document.currentScript.getAttribute("model");
  let graphical = document.currentScript.getAttribute("graphical");
  graphical = (graphical === "undefined") ? undefined : graphical;
  new ComponentModel({ model, graphical }).load()
    .then((data: DrawComponentData) => {
      new DrawComponent().draw(data, "diagram");
    })
    .catch(err => errorListener(err));
};

const errorListener = (err) => {
  const messageError = "Error while parsing invalid file";
  document.getElementById("error").innerHTML = messageError;
  console.error(err);
};

if (document.currentScript.getAttribute("composition")) {
  drawComposition();
} else {
  drawComponent();
}