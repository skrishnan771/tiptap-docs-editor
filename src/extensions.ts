import type { AnyExtension } from "@tiptap/core";
import { mergeAttributes } from "@tiptap/core";
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

import { SlashCommands } from "./slash-menu";
import type { CustomSlashItem } from "./types";

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
  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
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
  options: DefaultExtensionOptions
): AnyExtension[] {
  const {
    theme,
    placeholder = "Start writing…",
    slashMenuItems,
  } = options;

  const lowlight = createLowlight(common);

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
    Placeholder.configure({ placeholder }),
    TaskList,
    TaskItem.configure({ nested: true }),
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
      suggestion: {
        ...(SlashCommands.options?.suggestion ?? {}),
        ...(slashMenuItems ? { customItems: slashMenuItems } : {}),
      },
    }),
    Emoji.configure({
      emojis: gitHubEmojis,
      enableEmoticons: true,
    }),
  ];
}
