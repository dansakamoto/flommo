import { EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { coolGlow } from "thememirror";
import "./codeEditor.css";

const language = new Compartment();
const tabSize = new Compartment();

const hydraEditorState = EditorState.create({
  doc: "osc().out()",
  extensions: [
    language.of(javascript()),
    tabSize.of(EditorState.tabSize.of(2)),
    coolGlow,
  ],
});

const p5EditorState = EditorState.create({
  doc: "// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}",
  extensions: [
    language.of(javascript()),
    tabSize.of(EditorState.tabSize.of(2)),
    coolGlow,
  ],
});

export const hydraEditor = new EditorView({
  parent: document.querySelector("#hydraeditor"),
  extensions: [javascript()],
  state: hydraEditorState,
  lineNumbers: false,
});

export const p5Editor = new EditorView({
  parent: document.querySelector("#p5editor"),
  extensions: [javascript()],
  state: p5EditorState,
  lineNumbers: false,
});
