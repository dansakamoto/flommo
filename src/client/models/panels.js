import { createEditorInstance } from "../utils/cmInstance";

const hydraDefault = "osc().out()";
const p5Default =
  "// running in instance mode - functions must start with f.\n\nf.setup = () => " +
  "{\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}";

export var activePanel;
export const hydraEditor = createEditorInstance("hydraeditor", hydraDefault);
export const p5Editor = createEditorInstance("p5editor", p5Default);

export function setActivePanel(val) {
  activePanel = val;
}
