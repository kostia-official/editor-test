import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { Prosemirror } from "./Prosemirror";
import * as serviceWorker from "./serviceWorker";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

import { dinoSchema } from "./dinoSchema";
import { response } from "./transcripts";
import { toProsemirrorFormat } from "./utils";
import { schema } from "prosemirror-schema-basic";
import _ from "lodash";

const { Plugin } = require("prosemirror-state");

let startDoc = dinoSchema.node("doc", null, [
  dinoSchema.node("paragraph", null, toProsemirrorFormat(response.transcripts))
]);

let state = EditorState.create({
  schema: dinoSchema,
  doc: startDoc
});

let view = new EditorView(document.body, {
  state,
  dispatchTransaction(transaction) {
    let newState = view.state.apply(transaction);
    view.updateState(newState);
  }
});

function apply(tr) {
  let newState = view.state.apply(tr);
  view.updateState(newState);
}

let count = 0;
setInterval(() => {
  apply(view.state.tr.addMark(count, count + 5, dinoSchema.mark("strong")));
  count += 5;
}, 500);
