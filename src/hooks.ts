"use client";

import { useCallback, useEffect, useState } from "react";
import type { Theme } from "@mui/material/styles";
import type { Editor } from "@tiptap/react";

import { buildEditorCss } from "./editor-css";

type AnchorPos = { top: number; left: number };

export function useAnchorPosition() {
  const [anchorPos, setAnchorPos] = useState<AnchorPos | null>(null);

  const open = useCallback((el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setAnchorPos({ top: rect.bottom + 4, left: rect.left });
  }, []);

  const close = useCallback(() => setAnchorPos(null), []);

  const popoverProps = {
    open: Boolean(anchorPos),
    anchorReference: "anchorPosition" as const,
    anchorPosition: anchorPos ?? undefined,
    onClose: close,
  };

  return { anchorPos, open, close, popoverProps };
}

export function useEditorState(editor: Editor | null): number {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const bump = () => setTick((n) => n + 1);
    editor.on("transaction", bump);
    return () => {
      editor.off("transaction", bump);
    };
  }, [editor]);

  return tick;
}

const STYLE_ID = "tiptap-editor-styles";

/**
 * The style tag is a document-level singleton shared by every mounted editor,
 * so it may only be removed once the last one unmounts.
 */
let styleRefCount = 0;

export function useEditorStyles(theme: Theme) {
  useEffect(() => {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    styleRefCount += 1;

    el.textContent = buildEditorCss(theme);

    return () => {
      styleRefCount -= 1;
      if (styleRefCount <= 0) {
        styleRefCount = 0;
        el?.remove();
      }
    };
  }, [theme]);
}
