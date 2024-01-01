import "./style.css";
import "./style-editor.css";
import logo from "./FLOMMO_LOGO.png";

document.querySelector("#title").innerHTML = `<img
style="width: 300px"
src="${logo}"
alt="Flommo"
/><span style="font-family: 'Courier New', Courier, monospace"
>0.2.0</span
>`;
