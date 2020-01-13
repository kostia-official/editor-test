import _ from "lodash";
import { dinoSchema } from "./dinoSchema";

const uuid = require("uuid/v1");

export const toSlateFormat = transcripts => {
  return _.reduce(
    transcripts,
    (result, word, index) => {
      const node = {
        object: "text",
        text: word.content,
        key: word.uuid || uuid(),
        marks: [{ type: "word", data: word }]
      };
      const spaceNode = {
        object: "text",
        text: " ",
        key: uuid(),
        marks: [{ type: "space" }]
      };
      const isAddSpace = index !== 0 && word.type !== "punctuation";

      if (isAddSpace) {
        return [...result, spaceNode, node];
      }

      return [...result, node];
    },
    []
  );
};

export const toProsemirrorFormat = transcripts => {
  return _.reduce(
    transcripts,
    (result, word, index) => {
      const { content, start_time, end_time } = word;

      const node = dinoSchema.text(content, [
        dinoSchema.mark("span", { start_time, end_time })
      ]);

      const spaceNode = dinoSchema.text(" ");
      const isAddSpace = index !== 0 && word.type !== "punctuation";

      if (isAddSpace) {
        return [...result, spaceNode, node];
      }

      return [...result, node];
    },
    []
  );
};
