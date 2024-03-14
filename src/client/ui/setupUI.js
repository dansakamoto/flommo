import { updateMixer } from "./mixer";
import { updateMenu } from "./menu";
import { updateEditors, resizeEditors } from "./editors";
import { updateRenderer, resizeRenderer } from "./renderer";

let isChrome = navigator.userAgent.indexOf("Chrome") > -1;
let warningDiv = document.querySelector("#browser-warning");

export function setupUI() {
  if (!isChrome) warningDiv.style = "display:block";

  updateRenderer();
  updateMixer();
  updateEditors();
  updateMenu();
  resizeRenderer();
  resizeEditors();
}
