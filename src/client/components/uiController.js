import { uploadHydra, uploadP5 } from "../utils/sourceManager.js";
import { resizeRenderer } from "./renderer.js";
import { hydraEditor, p5Editor } from "./codeEditor.js";

var activePanel;

togglePanel("title");
resizeEditor();
window.addEventListener("resize", resizeEditor);

document.addEventListener(
  "keydown",
  (event) => {
    if (event.code == "Space" && event.ctrlKey) {
      togglePanel("hide");
    }
  },
  false
);

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
  togglePanel("video");
};
document.querySelector("#hydrabutton").onclick = () => {
  togglePanel("hydra");
};
document.querySelector("#p5button").onclick = () => {
  togglePanel("p5");
};
document.querySelector("#titlebutton").onclick = () => {
  togglePanel("title");
};
document.querySelector("#infobutton").onclick = () => {
  togglePanel("info");
};

function resizeEditor() {
  const editorHeight =
    window.innerHeight - document.querySelector("#menu").offsetHeight;
  const editors = document.querySelectorAll(".cm-editor");

  for (const e of editors) {
    e.style.height = editorHeight + "px";
  }
  document.querySelector("#videoeditor").style.height = editorHeight + "px";
}

export function togglePanel(active) {
  if (active === "hide") {
    const currentState = document.querySelector("#hud").style.visibility;
    document.querySelector("#hud").style =
      currentState === "hidden" ? "visibility:visible" : "visibility:hidden";
    document.querySelector("#interface").style.cursor =
      currentState === "hidden" ? "auto" : "none";
    return;
  }

  if (active !== activePanel) activePanel = active;
  else activePanel = "none";

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

  if (activePanel === "hydra") {
    document.querySelector("#hydrabutton").classList.add("active");
    document.querySelector("#hydraeditor").style = "display:block";
    resizeEditor();
    document.querySelector("#hydraeditor").querySelector(".cm-content").focus();
  } else if (activePanel === "p5") {
    document.querySelector("#p5button").classList.add("active");
    document.querySelector("#p5editor").style = "display:block";
    resizeEditor();
    document.querySelector("#p5editor").querySelector(".cm-content").focus();
  } else if (activePanel === "video") {
    document.querySelector("#videobutton").classList.add("active");
    document.querySelector("#videoeditor").style = "display:flex";
    resizeEditor();
    document.querySelector("#vidUpload").focus();
  } else if (activePanel === "info") {
    document.querySelector("#infobutton").classList.add("active");
    document.querySelector("#manual").style = "display:flex";
    resizeRenderer();
  } else if (activePanel === "title") {
    document.querySelector("#titlebutton").classList.add("active");
    document.querySelector("#nocursor").style = "display:flex";
    resizeRenderer();
  } else if (activePanel === "none") {
    document.querySelector("#empty").style = "display:block";
    resizeRenderer();
  }
}
