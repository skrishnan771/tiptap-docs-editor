import { Extension } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";

export interface TrailingNodeOptions {
  /**
   * Node types that already make a comfortable last block, so no trailing
   * paragraph is appended after them.
   */
  notAfter: string[];
}

/**
 * Keeps an empty paragraph at the end of the document, the way Notion always
 * leaves somewhere to click below the last block. Without it a document that
 * ends in a table, code block or image has no reachable insertion point.
 */
export const TrailingNode = Extension.create<TrailingNodeOptions>({
  name: "trailingNode",

  addOptions() {
    return { notAfter: ["paragraph"] };
  },

  addProseMirrorPlugins() {
    const key = new PluginKey(this.name);
    const { notAfter } = this.options;
    const needsTrailingNode = (doc: { lastChild: { type: { name: string } } | null }) => {
      const last = doc.lastChild;
      return last ? !notAfter.includes(last.type.name) : false;
    };

    return [
      new Plugin({
        key,
        appendTransaction: (_transactions, _oldState, newState) => {
          if (!key.getState(newState)) return null;
          const paragraph = newState.schema.nodes.paragraph;
          if (!paragraph) return null;
          return newState.tr.insert(newState.doc.content.size, paragraph.create());
        },
        state: {
          init: (_config, state) => needsTrailingNode(state.doc),
          apply: (tr, value) => (tr.docChanged ? needsTrailingNode(tr.doc) : value),
        },
      }),
    ];
  },
});
