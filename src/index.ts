export { default as DocsEditor } from "./editor";
export { getDefaultExtensions, CustomImage } from "./extensions";
export type { DefaultExtensionOptions } from "./extensions";
export type {
  DocsEditorProps,
  ToolbarConfig,
  CustomSlashItem,
} from "./types";
export type { ToolbarAction } from "./toolbar-button";
export { SlashCommands } from "./slash-menu";
export type { SlashCommandsOptions } from "./slash-menu";
export { TrailingNode } from "./trailing-node";
export type { TrailingNodeOptions } from "./trailing-node";
/** Useful for styling saved HTML outside the editor with the same rules. */
export { buildEditorCss } from "./editor-css";
