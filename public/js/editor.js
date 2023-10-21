var activeEditor = "info";

var cmEditor = CodeMirror(document.querySelector('#hydraeditor'), {
  lineNumbers: true,
  tabSize: 2,
  theme: 'tomorrow-night-eighties',
  value: '// running in instance mode - functions must start with f.\n\nf.osc().out()'
});

var cmEditor2 = CodeMirror(document.querySelector('#p5editor'), {
  lineNumbers: true,
  tabSize: 2,
  theme: 'tomorrow-night-eighties',
  value: '// running in instance mode - functions must start with f.\n\nf.setup = () => {\n\tf.createCanvas(720,400)\n}\n\nf.draw = () => {\n\tf.background(f.sin(f.millis()/1000)*255,100,150)\n}'
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
  if(e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    uploadCode();
  } else if(e.which === 13 && e.ctrlKey) {
    e.preventDefault()
    const index = 0;
    const code = cmEditor.getValue();
    console.log(code)
    eval("hydraInstances[" + index + "]." + code)
  }
})

// Keyboard commands
document.getElementById("p5editor").addEventListener("keypress", (e) => {
  if(e.which === 13 && e.ctrlKey) {
    e.preventDefault();
    uploadCode();
  }
})

function textAreaActive() { // boolean check
    const a = document.activeElement.tagName;
    return a.toLowerCase() === "textarea";
  }

// Deprecated? More streamlined if all code execution is autosaved?
function execHydra(index) {
  console.log("execHydra: " + index)
  const code = document.getElementById("hIn" + index).value;
  eval("hydraInstances[" + index + "]." + code)
}

function resizeEditor() {
  const editorHeight = window.innerHeight - document.getElementById("menu").offsetHeight
  let editors = document.querySelectorAll(".CodeMirror");
  for (let e of editors){
    e.style.height = editorHeight + "px";
  }
  document.querySelector("#videoeditor").style.height = editorHeight + "px";
}
resizeEditor();
window.addEventListener('resize', resizeEditor);

function toggleEditor(active) {

  if(active == activeEditor){
      activeEditor = "none";

      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:none;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:block;";

      document.querySelector("#hydrabutton").classList.remove("active")
      document.querySelector("#p5button").classList.remove("active")
      document.querySelector("#videobutton").classList.remove("active")
      document.querySelector("#infobutton").classList.remove("active")
      document.querySelector("#titlebutton").classList.remove("active")

      resizeRenderer();

      return;
    }

  switch(active) {
    case "video":
      activeEditor = "video";
      document.querySelector("#menu").style = "diplay:flex";
      document.querySelector("#hydraeditor").style = "display:none;";
      document.querySelector("#p5editor").style = "display:none;";
      document.querySelector("#videoeditor").style = "display:flex;";
      document.querySelector("#nocursor").style = "display:none;";
      document.querySelector("#manual").style = "display:none;";
      document.querySelector("#empty").style = "display:none;";

      document.querySelector("#hydrabutton").classList.remove("active")
      document.querySelector("#p5button").classList.remove("active")
      document.querySelector("#videobutton").classList.add("active")
      document.querySelector("#infobutton").classList.remove("active")
      document.querySelector("#titlebutton").classList.remove("active")
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

      document.querySelector("#hydrabutton").classList.remove("active")
      document.querySelector("#p5button").classList.add("active")
      document.querySelector("#videobutton").classList.remove("active")
      document.querySelector("#infobutton").classList.remove("active")
      document.querySelector("#titlebutton").classList.remove("active")
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

      document.querySelector("#hydrabutton").classList.add("active")
      document.querySelector("#p5button").classList.remove("active")
      document.querySelector("#videobutton").classList.remove("active")
      document.querySelector("#infobutton").classList.remove("active")
      document.querySelector("#titlebutton").classList.remove("active")
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

      document.querySelector("#hydrabutton").classList.remove("active")
      document.querySelector("#p5button").classList.remove("active")
      document.querySelector("#videobutton").classList.remove("active")
      document.querySelector("#infobutton").classList.add("active")
      document.querySelector("#titlebutton").classList.remove("active")
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

      document.querySelector("#hydrabutton").classList.remove("active")
      document.querySelector("#p5button").classList.remove("active")
      document.querySelector("#videobutton").classList.remove("active")
      document.querySelector("#infobutton").classList.remove("active")
      document.querySelector("#titlebutton").classList.add("active")
      resizeRenderer();
      break;
    case "hide":
      if(document.querySelector("#hud").style.visibility == "hidden"){
        document.querySelector("#hud").style = "visibility:visible";
        document.querySelector("#interface").style.cursor = "auto"
      } else {
        document.querySelector("#hud").style = "visibility:hidden";
        document.querySelector("#interface").style.cursor = "none"
      }
  }
}
toggleEditor("title")
