import { EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { coolGlow } from "thememirror";
import { uploadHydra, uploadP5 } from "../utils/sourceManager.js";
import { resizeRenderer } from "./renderer.js";
import "./codeEditor.css";

var activePanel;

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
const hydraEditor = new EditorView({
  parent: document.querySelector("#hydraeditor"),
  extensions: [javascript()],
  state: hydraEditorState,
  lineNumbers: false,
});
const p5EditorState = EditorState.create({
  doc: "// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}",
  extensions: [
    language.of(javascript()),
    tabSize.of(EditorState.tabSize.of(2)),
    coolGlow,
  ],
});
const p5Editor = new EditorView({
  parent: document.querySelector("#p5editor"),
  extensions: [javascript()],
  state: p5EditorState,
  lineNumbers: false,
});

toggleEditor("title");
resizeEditor();
window.addEventListener("resize", resizeEditor);
document.addEventListener(
  "keydown",
  (event) => {
    if (event.code == "Space" && event.ctrlKey) {
      toggleEditor("hide");
    }
  },
  false
);

export function initEditor() {
  document.querySelector("#hydraeditor").addEventListener("keypress", (e) => {
    if (e.which === 13 && e.ctrlKey) {
      e.preventDefault();
      uploadHydra(hydraEditor.state.doc.toString());
    }
  });
  document.querySelector("#p5editor").addEventListener("keypress", (e) => {
    if (e.which === 13 && e.ctrlKey) {
      e.preventDefault();
      uploadP5(p5Editor.state.doc.toString());
    }
  });
  document.querySelector("#videobutton").onclick = () => {
    toggleEditor("video");
  };
  document.querySelector("#hydrabutton").onclick = () => {
    toggleEditor("hydra");
  };
  document.querySelector("#p5button").onclick = () => {
    toggleEditor("p5");
  };
  document.querySelector("#titlebutton").onclick = () => {
    toggleEditor("title");
  };
  document.querySelector("#infobutton").onclick = () => {
    toggleEditor("info");
  };
}

function resizeEditor() {
  const editorHeight =
    window.innerHeight - document.querySelector("#menu").offsetHeight;
  const editors = document.querySelectorAll(".cm-editor");

  for (const e of editors) {
    e.style.height = editorHeight + "px";
  }
  document.querySelector("#videoeditor").style.height = editorHeight + "px";
}

function toggleEditor(active) {
  if (active === "hide") {
    if (document.querySelector("#hud").style.visibility == "hidden") {
      document.querySelector("#hud").style = "visibility:visible";
      document.querySelector("#interface").style.cursor = "auto";
    } else {
      document.querySelector("#hud").style = "visibility:hidden";
      document.querySelector("#interface").style.cursor = "none";
    }
    return;
  }

  if (active === activePanel) active = "none";

  activePanel = active;

  document.querySelector("#hydrabutton").classList.remove("active");
  document.querySelector("#p5button").classList.remove("active");
  document.querySelector("#videobutton").classList.remove("active");
  document.querySelector("#infobutton").classList.remove("active");
  document.querySelector("#titlebutton").classList.remove("active");
  document.querySelector("#hydraeditor").style = "display:none;";
  document.querySelector("#p5editor").style = "display:none;";
  document.querySelector("#videoeditor").style = "display:none;";
  document.querySelector("#nocursor").style = "display:none;";
  document.querySelector("#manual").style = "display:none;";
  document.querySelector("#empty").style = "display:none;";

  if (active === "hydra") {
    document.querySelector("#hydrabutton").classList.add("active");
    document.querySelector("#hydraeditor").style = "display:block";
    resizeEditor();
  } else if (active === "p5") {
    document.querySelector("#p5button").classList.add("active");
    document.querySelector("#p5editor").style = "display:block";
    resizeEditor();
  } else if (active === "video") {
    document.querySelector("#videobutton").classList.add("active");
    document.querySelector("#videoeditor").style = "display:flex";
    resizeEditor();
  } else if (active === "info") {
    document.querySelector("#infobutton").classList.add("active");
    document.querySelector("#manual").style = "display:flex";
    resizeRenderer();
  } else if (active === "title") {
    document.querySelector("#titlebutton").classList.add("active");
    document.querySelector("#nocursor").style = "display:flex";
    resizeRenderer();
  } else if (active === "none") {
    document.querySelector("#empty").style = "display:block";
    resizeRenderer();
  }
}
