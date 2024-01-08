import { togglePanel } from "./menuListeners.js";
import { createEditorInstance } from "../utils/cmInstance.js";
import { updateSrc } from "../services/data.js";
import * as f from "../model.js";

export function resizeEditors() {
  const editorHeight =
    window.innerHeight - document.querySelector("#menu").offsetHeight;

  const codeEditors = document.querySelectorAll(".cm-editor");
  const videoEditors = document.querySelectorAll(".addedVideoEditor");

  for (const e of codeEditors) {
    e.style.height = editorHeight + "px";
  }
  for (const v of videoEditors) {
    v.style.height = editorHeight + "px";
  }
  document.querySelector("#videoeditor").style.height = editorHeight + "px";
}

export function updateEditors() {
  if (
    typeof f.activePanel === "number" &&
    f.activePanel + 1 > f.sources.length
  ) {
    togglePanel("none");
  }

  const addedEditors = document.querySelector("#addededitors");
  while (addedEditors.firstChild) {
    addedEditors.removeChild(addedEditors.firstChild);
  }

  for (let i = 0; i < f.sources.length; i++) {
    const s = f.sources[i];
    const div = document.createElement("div");
    div.id = "editor" + s.id;
    if (f.activePanel === i) {
      div.style = "display:flex";
    } else {
      div.style = "display:none";
    }
    addedEditors.appendChild(div);
    if (s.type === "p5" || s.type === "hydra") {
      s.editor = createEditorInstance("editor" + s.id, s.data);
      div.addEventListener("keypress", (e) => {
        if (e.which === 13 && e.ctrlKey) {
          e.preventDefault();
          updateSrc(s.id, { src: s.editor.state.doc.toString() });
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
        updateSrc(s.id, { src: e.target.elements[`vidUpload${s.id}`].value });
      };
    }
  }
  resizeEditors();
}
