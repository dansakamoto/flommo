import { EditorView } from "codemirror";
import { EditorState, Compartment } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";
import { coolGlow } from "thememirror";

const language = new Compartment();
const tabSize = new Compartment();

export function createEditorInstance(parentId, doc) {
  return new EditorView({
    parent: document.getElementById(parentId),
    extensions: [javascript()],
    state: EditorState.create({
      doc: doc,
      extensions: [
        language.of(javascript()),
        tabSize.of(EditorState.tabSize.of(2)),
        coolGlow,
      ],
    }),
    lineNumbers: false,
  });
}
