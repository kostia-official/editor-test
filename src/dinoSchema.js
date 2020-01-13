import { nodes, marks } from "prosemirror-schema-basic";
import { Schema } from "prosemirror-model";

marks.span = {
  attrs: {
    start_time: { default: 0 },
    end_time: { default: 0 },
    isBold: { default: false }
  },
  inline: true,
  group: "inline",
  draggable: true,
  toDOM: node => [
    "span",
    {
      start_time: node.attrs.start_time,
      end_time: node.attrs.end_time,
      style: node.attrs.isBold ? `font-weight: bold` : `font-weight: none`
    }
  ],
  parseDOM: [
    {
      tag: "span[start_time]",
      getAttrs: dom => {
        let start_time = dom.getAttribute("start_time");
        let end_time = dom.getAttribute("end_time");
        return { start_time, end_time, isBold: true };
      }
    }
  ]
};

marks.small = {
  excludes: "_", // Prevent any other mark from being applied to this mark
  parseDOM: [{ tag: "small" }],
  toDOM: function toDOM(node) {
    return ["small", { style: "font-size:10px;color:dodgerblue" }];
  }
};

console.log("marks", marks);

export const dinoSchema = new Schema({
  nodes,
  marks
});
