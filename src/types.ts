import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import type { Range } from "@tiptap/core";

export interface ToolbarConfig {
  history?: boolean;
  formatting?: boolean;
  headings?: boolean;
  lists?: boolean;
  inserts?: boolean;
  alignment?: boolean;
  table?: boolean;
  fontControls?: boolean;
  colorControls?: boolean;
  superSubScript?: boolean;
  clearFormatting?: boolean;
  print?: boolean;
}

export interface CustomSlashItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  category?: string;
  command: (props: { editor: Editor; range: Range }) => void;
}

export interface DocsEditorProps {
  content: string;
  placeholder?: string;
  theme: Theme;
  onChange: (html: string) => void;
  onReady?: (editor: Editor) => void;
  editable?: boolean;
  toolbar?: ToolbarConfig;
  slashMenuItems?: CustomSlashItem[];
  showCharacterCount?: boolean;
}
