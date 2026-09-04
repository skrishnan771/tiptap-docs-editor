import type { Editor } from "@tiptap/core";
import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";

export function bubbleMenuPaperSx(theme: Theme): SxProps<Theme> {
  return {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 0.25,
    px: 0.5,
    py: 0.25,
    borderRadius: `${theme.shape.borderRadius}px`,
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    maxWidth: "calc(100vw - 24px)",
  };
}

/** Reads an image file as a data URL and inserts it at the current selection. */
export function insertImageFromFile(editor: Editor, file: File): void {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      editor.chain().focus().setImage({ src: reader.result }).run();
    }
  };
  reader.readAsDataURL(file);
}
