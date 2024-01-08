import { sources } from "../models/sources.js";
import { togglePanel } from "../controllers/panels.js";
import { activePanel } from "../models/panels.js";
import { createEditorInstance } from "../utils/cmInstance.js";
import { updateSrc } from "../services/data.js";

export function resizeEditor() {
  const editorHeight =
    window.innerHeight - document.querySelector("#menu").offsetHeight;
  const editors = document.querySelectorAll(".cm-editor");

  for (const e of editors) {
    e.style.height = editorHeight + "px";
  }
  document.querySelector("#videoeditor").style.height = editorHeight + "px";
  for (const v of document.querySelectorAll(".addedVideoEditor")) {
    v.style.height = editorHeight + "px";
  }
}

export function checkPanelReset() {
  if (typeof activePanel === "number" && activePanel + 1 > sources.length) {
    togglePanel("none");
  }
}

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
    if (activePanel === i) {
      div.style = "display:flex";
    } else {
      div.style = "display:none";
    }
    document.querySelector("#addededitors").appendChild(div);
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
}
