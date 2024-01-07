import { EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { coolGlow } from "thememirror";
import { sources, updateSrc } from "../services/sourceManager";
import { getActivePanel } from "../views/uiController";

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

export function refreshEditors() {
  while (document.querySelector("#addededitors").firstChild) {
    document
      .querySelector("#addededitors")
      .removeChild(document.querySelector("#addededitors").firstChild);
  }

  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    const div = document.createElement("div");
    div.id = "editor" + s.id;
    if (getActivePanel() === i) {
      div.style = "display:flex";
    } else {
      div.style = "display:none";
    }
    document.querySelector("#addededitors").appendChild(div);
    if (s.type === "p5" || s.type === "hydra") {
      addEditor(s);
      div.addEventListener("keypress", (e) => {
        if (e.which === 13 && e.ctrlKey) {
          e.preventDefault();
          updateSrc(s.id, s.editor.state.doc.toString());
        }
      });
    } else {
      div.classList.add("addedVideoEditor");
      div.innerHTML = `<form id="videouploader${s.id}">
      <label for="vidUpload${s.id}">video URL</label><br />
      <input
        type="text"
        size="80"
        id="vidUpload${s.id}"
        name="vidUpload${s.id}"
        autocomplete="off"
        value="${s.data}"
      />
      <input class="submitButton" type="submit" />
    </form>`;
      const form = document.getElementById(`videouploader${s.id}`);
      form.onsubmit = (e) => {
        e.preventDefault();
        updateSrc(s.id, e.target.elements[`vidUpload${s.id}`].value);
      };
    }
  }

  function addEditor(source) {
    source.editorState = EditorState.create({
      doc: source.data,
      extensions: [
        language.of(javascript()),
        tabSize.of(EditorState.tabSize.of(2)),
        coolGlow,
      ],
    });
    source.editor = new EditorView({
      parent: document.querySelector("#editor" + source.id),
      extensions: [javascript()],
      state: source.editorState,
      lineNumbers: false,
    });
  }
}
