// Utility - return name of active textArea
function textAreaActive() {
    const a = document.activeElement.tagName;
    return a.toLowerCase() === "textarea";
  }

// Code execution
function execHydra(index) {
  console.log("execHydra: " + index)
  const code = document.getElementById("hIn" + index).value;
  eval("hydraInstances[" + index + "]." + code)
}

// Window resize handler
function resizeMain() {
  document.getElementById("out1").width = window.innerWidth;
  document.getElementById("out1").height = window.innerHeight;
  document.getElementById("nocursor").style.height = window.innerHeight + "px";
  document.getElementById("srcPreviews").style.width = `${Math.max(720,720 * Math.floor(window.innerWidth / 720))}px`;
}
resizeMain();
window.addEventListener('resize', resizeMain);
