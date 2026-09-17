import type { Editor } from "@tiptap/core";
import type { Theme } from "@mui/material/styles";
import type { SxProps } from "@mui/material/styles";

import { notionShadow } from "./editor-css";

/** Notion caps its surface radius well below most theme radii. */
function surfaceRadius(theme: Theme): string {
  return `${Math.min(Number(theme.shape.borderRadius), 6)}px`;
}

/**
 * Shared chrome for every floating surface (menus, popovers). The Notion
 * shadow already draws a hairline ring, so a border is only added in dark mode
 * where that ring disappears into the background.
 */
export function floatingPaperSx(theme: Theme) {
  const isDark = theme.palette.mode === "dark";
  return {
    borderRadius: surfaceRadius(theme),
    bgcolor: theme.palette.background.paper,
    backgroundImage: "none",
    boxShadow: notionShadow(isDark),
    ...(isDark ? { border: `1px solid ${theme.palette.divider}` } : {}),
    maxWidth: "calc(100vw - 24px)",
  };
}

export function bubbleMenuPaperSx(theme: Theme): SxProps<Theme> {
  return {
    ...floatingPaperSx(theme),
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1px",
    px: 0.5,
    py: 0.5,
  };
}

/**
 * Reads an image file as a data URL and inserts it at `pos`, or at the current
 * selection when no position is given (a drop reports where it landed).
 */
export function insertImageFromFile(
  editor: Editor,
  file: File,
  pos?: number,
): void {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result !== "string") return;
    const image = { type: "image", attrs: { src: reader.result } };
    if (pos === undefined) {
      editor.chain().focus().setImage({ src: reader.result }).run();
    } else {
      editor.chain().focus().insertContentAt(pos, image).run();
    }
  };
  reader.readAsDataURL(file);
}
