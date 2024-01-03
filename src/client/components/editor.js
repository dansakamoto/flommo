import { EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { coolGlow } from "thememirror";
import { uploadHydra, uploadP5 } from "../utils/sourceManager.js";
import { resizeRenderer } from "../utils/renderer.js";
import "./editor.css";

var activeEditor = "info";

let language = new Compartment(),
  tabSize = new Compartment();

let hydraEditorState = EditorState.create({
  doc: "osc().out()",
  extensions: [
    language.of(javascript()),
    tabSize.of(EditorState.tabSize.of(2)),
    coolGlow,
  ],
});

var hydraEditor = new EditorView({
  parent: document.querySelector("#hydraeditor"),
  extensions: [javascript()],
  state: hydraEditorState,
  lineNumbers: false,
});

let p5EditorState = EditorState.create({
  doc: "// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}",
  extensions: [
    language.of(javascript()),
    tabSize.of(EditorState.tabSize.of(2)),
    coolGlow,
  ],
});

var p5Editor = new EditorView({
  parent: document.querySelector("#p5editor"),
  extensions: [javascript()],
  state: p5EditorState,
  lineNumbers: false,
});

// Code upload listener (deprecated - non-codemirror textarea version)
/*
document.getElementById("codeUpload").addEventListener("keypress", (e) => {
  if(e.which === 13 && e.shiftKey) {
    e.preventDefault();
    uploadCode();
  }
})
*/

// Keyboard commands
document.getElementById("hydraeditor").addEventListener("keypress", (e) => {
  if (e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    uploadHydra(hydraEditor.state.doc.toString());
  } /* else if (e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    const index = 0;
    const code = hydraEditor.getValue();
    console.log(code);
    eval("hydraInstances[" + index + "]." + code);
  } */
});

// Keyboard commands
document.getElementById("p5editor").addEventListener("keypress", (e) => {
  if (e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    uploadP5(p5Editor.state.doc.toString());
  }
});

/*
function textAreaActive() {
  // boolean check
  const a = document.activeElement.tagName;
  return a.toLowerCase() === "textarea";
}
*/

// Deprecated? More streamlined if all code execution is autosaved?
/*
function execHydra(index) {
  console.log("execHydra: " + index);
  const code = document.getElementById("hIn" + index).value;
  eval("hydraInstances[" + index + "]." + code);
}
*/

function resizeEditor() {
  const editorHeight =
    window.innerHeight - document.getElementById("menu").offsetHeight;
  let editors = document.querySelectorAll(".cm-editor");
  for (let e of editors) {
    e.style.height = editorHeight + "px";
  }
  document.querySelector("#videoeditor").style.height = editorHeight + "px";
}
resizeEditor();
window.addEventListener("resize", resizeEditor);

window.toggleEditor = (active) => {
  if (active == activeEditor) {
    activeEditor = "none";

    document.querySelector("#menu").style = "diplay:flex";
    document.querySelector("#hydraeditor").style = "display:none;";
    document.querySelector("#p5editor").style = "display:none;";
    document.querySelector("#videoeditor").style = "display:none;";
    document.querySelector("#nocursor").style = "display:none;";
    document.querySelector("#manual").style = "display:none;";
    document.querySelector("#empty").style = "display:block;";

    document.querySelector("#hydrabutton").classList.remove("active");
    document.querySelector("#p5button").classList.remove("active");
    document.querySelector("#videobutton").classList.remove("active");
    document.querySelector("#infobutton").classList.remove("active");
    document.querySelector("#titlebutton").classList.remove("active");

    resizeRenderer();

    return;
  }

  switch (active) {
    case "video":
      activeEditor = "video";
      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:flex;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.add("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeEditor();
      break;
    case "p5":
      activeEditor = "p5";
      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:block;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.add("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeEditor();
      break;
    case "hydra":
      activeEditor = "hydra";
      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:block;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.add("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeEditor();
      break;
    case "info":
      activeEditor = "info";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:flex;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.add("active");
      document.querySelector("#titlebutton").classList.remove("active");
      resizeRenderer();
      break;
    case "title":
      activeEditor = "title";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:flex;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active");
      document.querySelector("#p5button").classList.remove("active");
      document.querySelector("#videobutton").classList.remove("active");
      document.querySelector("#infobutton").classList.remove("active");
      document.querySelector("#titlebutton").classList.add("active");
      resizeRenderer();
      break;
    case "hide":
      if (document.querySelector("#hud").style.visibility == "hidden") {
        document.querySelector("#hud").style = "visibility:visible";
        document.querySelector("#interface").style.cursor = "auto";
      } else {
        document.querySelector("#hud").style = "visibility:hidden";
        document.querySelector("#interface").style.cursor = "none";
      }
  }
};
window.toggleEditor("title");
