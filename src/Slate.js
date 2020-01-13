import React from "react";
import "./App.css";
import { Editor, findNode } from "slate-react";
import { Value, Node, Inline } from "slate";
import _ from "lodash";
import { response } from "./transcripts";
import { toSlateFormat } from "./utils";

// Create our initial value...
const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: toSlateFormat(response.transcripts)
      }
    ]
  }
});

class Slate extends React.Component {
  // Set the initial value when the app is first constructed.
  state = {
    value: initialValue
  };

  // On change, update the app's React state with the new editor value.
  onChange = ({ value, operations, ...dsf }) => {
    const documentBefore = this.state.value.document;
    const documentAfter = value.document;
    const ops = operations.toJSON();

    const removed = _.find(ops, { type: "remove_node" });
    const removedNode = _.find(this.state.value.texts.toArray(), {
      key: _.get(removed, "node.key")
    });
    if (_.get(removedNode, "text") === " ") {
      const previousNode = documentAfter.getNode(
        documentBefore.getPreviousNode(removedNode.key).key
      );
      const nextNode = documentAfter.getNode(
        documentBefore.getNextNode(removedNode.key).key
      );
      const mark = previousNode.marks.first().data.mergeDeep({});
      console.log(mark);
      return (
        this.editor
          // .setMarkByKey(previousNode.key, 0, 100, {})
          .mergeNodeByKey(nextNode.key)
      );
    }
    this.setState({ value });
  };

  onKeyDown = (event, editor, next) => {
    if (!event.ctrlKey) return next();

    // Decide what to do based on the key code...
    switch (event.key) {
      // When "B" is pressed, add a "bold" mark to the text.
      case "b": {
        event.preventDefault();
        this.setState(state => {
          const value = state.value.toJSON({ preserveSelection: true });
          value.document.nodes[0].nodes[0].marks.push({ type: "bold" });
          console.log(value.document.nodes[0].nodes);
          return { value: Value.fromJSON(value) };
        });
        break;
      }
      // Otherwise, let other plugins handle it.
      default: {
        return next();
      }
    }
  };

  renderMark = (props, editor, next) => {
    switch (props.mark.type) {
      case "bold":
        return <BoldMark {...props} />;
      case "word":
        return props.children;
      default:
        return next();
    }
  };

  renderInline = (props, editor, next) => {
    console.log("inline");
    switch (props.node.type) {
      default:
        return next();
    }
  };

  renderBlock = (props, editor, next) => {
    const { node, attributes, children } = props;

    switch (node.type) {
      default:
        console.log(node.type);
        return next();
    }
  };

  // Render the editor.
  render() {
    return (
      <Editor
        ref={editor => (this.editor = editor)}
        value={this.state.value}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        renderMark={this.renderMark}
        renderBlock={this.renderBlock}
        renderInline={this.renderInline}
      />
    );
  }
}

function BoldMark(props) {
  return <strong>{props.children}</strong>;
}

export default Slate;
