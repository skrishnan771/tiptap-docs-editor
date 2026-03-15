import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";

export interface DocsEditorProps {
  content: string;
  placeholder?: string;
  theme: Theme;
  onChange: (html: string) => void;
  onReady?: (editor: Editor) => void;
}
