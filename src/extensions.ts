import type { AnyExtension, Editor } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "@tiptap/pm/model";
import type { Theme } from "@mui/material/styles";

import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import { TextStyleKit } from "@tiptap/extension-text-style";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { Underline } from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { Youtube } from "@tiptap/extension-youtube";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Typography } from "@tiptap/extension-typography";
import Emoji, { gitHubEmojis } from "@tiptap/extension-emoji";
import {
  Details,
  DetailsContent,
  DetailsSummary,
} from "@tiptap/extension-details";
import { FileHandler } from "@tiptap/extension-file-handler";

import { SlashCommands } from "./slash-menu";
import { TrailingNode } from "./trailing-node";
import { insertImageFromFile } from "./utils";
import type { CustomSlashItem } from "./types";

/**
 * Registering the ~35 `common` grammars is expensive and the registry is
 * stateless, so it is built once per module rather than per editor.
 */
const lowlight = createLowlight(common);

/** Notion names an empty block after the block type itself. */
const BLOCK_PLACEHOLDERS: Record<string, string> = {
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  detailsSummary: "Toggle",
  codeBlock: "",
};

/**
 * Containers whose empty children are named after the container instead — and
 * table cells, which Notion leaves unlabelled.
 */
const PARENT_PLACEHOLDERS: Record<string, string> = {
  blockquote: "Empty quote",
  detailsContent: "Empty toggle",
  listItem: "List",
  taskItem: "To-do",
  tableCell: "",
  tableHeader: "",
};

/**
 * Notion labels each empty block rather than showing one placeholder for the
 * whole document: the first line gets the document prompt, any other empty
 * paragraph invites the slash menu, and structural blocks name themselves.
 */
function blockPlaceholder(docPlaceholder: string) {
  return ({
    editor,
    node,
    pos,
  }: {
    editor: Editor;
    node: ProseMirrorNode;
    pos: number;
  }): string => {
    const key =
      node.type.name === "heading"
        ? `heading${String(node.attrs.level ?? 1)}`
        : node.type.name;

    const own = BLOCK_PLACEHOLDERS[key];
    if (own !== undefined) return own;

    /* `pos` comes from the plugin's own doc walk, which can be a step behind
       `editor.state`; stay inside the current doc so resolve() can't throw. */
    const { doc } = editor.state;
    if (pos >= 0 && pos <= doc.content.size) {
      const fromParent = PARENT_PLACEHOLDERS[doc.resolve(pos).parent.type.name];
      if (fromParent !== undefined) return fromParent;
    }

    return pos === 0 ? docPlaceholder : "Type '/' for commands";
  };
}

/**
 * Custom Image extension that supports inline `style` attribute for alignment.
 */
export const CustomImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (el: HTMLElement) => el.getAttribute("style"),
        renderHTML: (attrs: Record<string, unknown>) => {
          if (!attrs.style) return {};
          return { style: attrs.style };
        },
      },
    };
  },
});

export interface DefaultExtensionOptions {
  /** MUI theme – used for dropcursor color */
  theme: Theme;
  /** Placeholder text shown in empty editor */
  placeholder?: string | undefined;
  /** Custom slash menu items to append to built-in ones */
  slashMenuItems?: CustomSlashItem[] | undefined;
}

/**
 * Returns the full set of default extensions used by DocsEditor.
 *
 * Consumers can call this to get the "batteries-included" experience,
 * then filter / override individual extensions before passing the array
 * to the editor's `extensions` prop.
 *
 * @example
 * ```tsx
 * const extensions = getDefaultExtensions({ theme })
 *   .filter(ext => ext.name !== "youtube"); // drop YouTube
 * <DocsEditor extensions={extensions} ... />
 * ```
 */
export function getDefaultExtensions(
  options: DefaultExtensionOptions,
): AnyExtension[] {
  const { theme, placeholder = "Start writing…", slashMenuItems } = options;

  return [
    StarterKit.configure({
      codeBlock: false,
      link: false,
      underline: false,
      dropcursor: {
        color: theme.palette.secondary.main,
        width: 2,
      },
    }),
    Placeholder.configure({
      placeholder: blockPlaceholder(placeholder),
      includeChildren: true,
    }),
    TaskList,
    TaskItem.configure({ nested: true }),
    /* `persist` keeps a toggle's open/closed state in the document. */
    Details.configure({ persist: true }),
    DetailsSummary,
    DetailsContent,
    Highlight.configure({ multicolor: true }),
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    CustomImage.configure({ allowBase64: true, inline: false }),
    CodeBlockLowlight.configure({ lowlight }),
    TextStyleKit,
    Underline,
    Superscript,
    Subscript,
    Typography,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    }),
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
    Youtube.configure({ inline: false, ccLanguage: "en" }),
    CharacterCount,
    SlashCommands.configure({
      suggestion: slashMenuItems ? { customItems: slashMenuItems } : {},
    }),
    Emoji.configure({
      emojis: gitHubEmojis,
      enableEmoticons: true,
    }),
    /* Drop or paste an image straight onto the page, as Notion does. */
    FileHandler.configure({
      allowedMimeTypes: [
        "image/png",
        "image/jpeg",
        "image/gif",
        "image/webp",
        "image/svg+xml",
      ],
      onDrop: (editor, files, pos) => {
        files.forEach((file) => insertImageFromFile(editor, file, pos));
      },
      onPaste: (editor, files) => {
        files.forEach((file) => insertImageFromFile(editor, file));
      },
    }),
    TrailingNode,
  ];
}
