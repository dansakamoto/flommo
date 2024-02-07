import { addSrc } from "../services/data";
import { resizeEditors } from "./editors";
import { resizeRenderer } from "./renderer";
import session from "../session";

export { togglePanel };

togglePanel("title");
document.querySelector("#videouploader").onsubmit = (e) => {
  e.preventDefault();
  addSrc("video", e.target.elements.vidUpload.value);
  document.querySelector("#vidUpload").value = "";
};
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
    addSrc("hydra", session.newHydraEditor.state.doc.toString());
  }
});
document.querySelector("#p5editor").addEventListener("keypress", (e) => {
  if (e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    addSrc("p5", session.newP5Editor.state.doc.toString());
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

function togglePanel(active) {
  if (active === "hide") {
    const currentState = document.querySelector("#hud").style.visibility;
    document.querySelector("#hud").style =
      currentState === "hidden" ? "visibility:visible" : "visibility:hidden";
    document.querySelector("#interface").style.cursor =
      currentState === "hidden" ? "auto" : "none";
    return;
  }

  if (active !== session.activePanel) session.setActivePanel(active);
  else session.setActivePanel("none");

  const srcButtons = document.getElementById("srcbuttons").children;
  for (const s of srcButtons) {
    s.classList.remove("active");
  }
  const addedEditors = document.getElementById("addededitors").children;
  for (const a of addedEditors) {
    a.style = "display:none";
  }
  document.querySelector("#hydrabutton").classList.remove("active");
  document.querySelector("#p5button").classList.remove("active");
  document.querySelector("#videobutton").classList.remove("active");
  document.querySelector("#infobutton").classList.remove("active");
  document.querySelector("#titlebutton").classList.remove("active");
  document.querySelector("#hydraeditor").style = "display:none;";
  document.querySelector("#p5editor").style = "display:none;";
  document.querySelector("#videoeditor").style = "display:none;";
  document.querySelector("#welcome-panel").style = "display:none;";
  document.querySelector("#manual").style = "display:none;";
  document.querySelector("#empty").style = "display:none;";
  document.querySelector("#addededitors").style = "display:none";

  if (session.activePanel === "hydra") {
    document.querySelector("#hydrabutton").classList.add("active");
    document.querySelector("#hydraeditor").style = "display:block";
    resizeEditors();
    document.querySelector("#hydraeditor").querySelector(".cm-content").focus();
  } else if (session.activePanel === "p5") {
    document.querySelector("#p5button").classList.add("active");
    document.querySelector("#p5editor").style = "display:block";
    resizeEditors();
    document.querySelector("#p5editor").querySelector(".cm-content").focus();
  } else if (session.activePanel === "video") {
    document.querySelector("#videobutton").classList.add("active");
    document.querySelector("#videoeditor").style = "display:flex";
    resizeEditors();
    document.querySelector("#vidUpload").focus();
  } else if (session.activePanel === "info") {
    document.querySelector("#infobutton").classList.add("active");
    document.querySelector("#manual").style = "display:flex";
    resizeRenderer();
  } else if (session.activePanel === "title") {
    document.querySelector("#titlebutton").classList.add("active");
    document.querySelector("#welcome-panel").style = "display:flex";
    resizeRenderer();
  } else if (session.activePanel === "none") {
    document.querySelector("#empty").style = "display:block";
    resizeRenderer();
  } else {
    document
      .querySelector("#additionalEditor" + session.activePanel)
      .classList.add("active");
    document.querySelector("#addededitors").style = "display:block";
    const sourceId = session.sources[session.activePanel].id;
    document.querySelector("#editor" + sourceId).style = "display:flex";
    resizeEditors();
  }
}
