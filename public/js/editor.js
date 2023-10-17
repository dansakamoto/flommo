var cmEditor = CodeMirror(document.querySelector('#editor'), {
  lineNumbers: true,
  tabSize: 2,
  value: 'f.'
});

// Code upload listener (deprecated - non-codemirror textarea version)
document.getElementById("codeUpload").addEventListener("keypress", (e) => {
  if(e.which === 13 && e.shiftKey) {
    e.preventDefault();
    uploadCode();
  }
})

// Keyboard commands
document.getElementById("editor").addEventListener("keypress", (e) => {
  if(e.which === 13 && e.shiftKey) {
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
