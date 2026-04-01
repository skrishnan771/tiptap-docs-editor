"use client";

import { useCallback, useEffect, useState } from "react";
import { alpha, type Theme } from "@mui/material/styles";
import type { Editor } from "@tiptap/react";

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
    editor.on("selectionUpdate", bump);
    return () => {
      editor.off("transaction", bump);
      editor.off("selectionUpdate", bump);
    };
  }, [editor]);

  return tick;
}

const STYLE_ID = "tiptap-editor-styles";

export function useEditorStyles(theme: Theme) {
  useEffect(() => {
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!el) {
      el = document.createElement("style");
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }

    const br = Number(theme.shape.borderRadius);
    const isDark = theme.palette.mode === "dark";

    /* Notion-like palette */
    const bg = theme.palette.background.default;
    const bgPaper = theme.palette.background.paper;
    const text = theme.palette.text.primary;
    const textSec = theme.palette.text.secondary;
    const textDis = theme.palette.text.disabled;
    const accent = theme.palette.secondary.main;
    const accentDk = theme.palette.secondary.dark;
    const divider = theme.palette.divider;
    const codeBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
    const blockquoteBg = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)";
    const preBg = isDark ? "#1e1e2e" : "#f6f6f9";

    el.textContent = `
      /* ===== Notion-like Editor Wrapper ===== */
      .notion-editor-wrapper {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: ${bg};
        color: ${text};
        font-family: ${theme.typography.fontFamily};
        position: relative;
      }

      /* ===== Header ===== */
      .notion-editor-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 16px;
        border-bottom: 1px solid ${divider};
        background: ${bgPaper};
        flex-shrink: 0;
        min-height: 48px;
        position: sticky;
        top: 0;
        z-index: 3;
      }
      .notion-editor-header-left {
        display: flex;
        align-items: center;
        gap: 2px;
      }
      .notion-editor-header-right {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      /* ===== Layout: content + sidebar TOC ===== */
      .notion-editor-layout {
        display: flex;
        flex: 1;
        overflow: hidden;
      }
      .notion-editor-content {
        flex: 1;
        overflow-y: auto;
        padding: 2rem 3rem;
        min-width: 0;
      }
      @media (max-width: 768px) {
        .notion-editor-content {
          padding: 1.5rem 1.25rem;
        }
      }

      /* ===== Tiptap ProseMirror ===== */
      .tiptap.ProseMirror {
        outline: none;
        caret-color: ${accent};
        font-family: ${theme.typography.fontFamily};
        font-size: 1rem;
        line-height: 1.75;
        color: ${text};
        padding-left: 1.5rem;
        min-height: 200px;
      }

      .tiptap p { margin: 0 0 0.5em; }

      .tiptap p.is-empty.is-editor-empty::before,
      .tiptap .is-empty:first-child::before {
        content: attr(data-placeholder);
        color: ${textDis};
        pointer-events: none; float: left; height: 0;
      }

      /* Headings */
      .tiptap h1, .tiptap h2, .tiptap h3 {
        font-family: ${theme.typography.fontFamily};
        font-weight: 700;
        color: ${text};
        line-height: 1.3;
        margin: 1.5em 0 0.4em;
      }
      .tiptap h1 { font-size: 1.875rem; }
      .tiptap h2 { font-size: 1.5rem; }
      .tiptap h3 { font-size: 1.25rem; }

      /* Inline formatting */
      .tiptap strong { font-weight: 700; }
      .tiptap em     { font-style: italic; }
      .tiptap u      { text-decoration: underline; text-underline-offset: 3px; }
      .tiptap s      { text-decoration: line-through; opacity: 0.55; }

      /* Inline code */
      .tiptap code {
        background: ${codeBg};
        color: ${isDark ? "#e06c75" : "#d63384"};
        border-radius: 4px;
        padding: 0.15em 0.4em;
        font-size: 0.85em;
        font-family: 'SF Mono', 'Cascadia Mono', 'Roboto Mono', monospace;
      }
      .tiptap pre code {
        background: none; color: inherit; padding: 0;
        border-radius: 0; font-size: inherit;
      }

      /* Mark / highlight */
      .tiptap mark {
        background-color: ${alpha("#facc15", isDark ? 0.3 : 0.4)};
        border-radius: 2px;
        padding: 0.05em 0.15em;
        color: inherit;
      }

      /* Links */
      .tiptap a {
        color: ${accent};
        text-decoration: underline;
        text-underline-offset: 3px;
        cursor: pointer;
        transition: color 0.15s;
      }
      .tiptap a:hover { color: ${accentDk}; }

      /* Lists */
      .tiptap ul   { list-style: disc;    padding-left: 1.5em; margin: 0.3em 0; }
      .tiptap ol   { list-style: decimal; padding-left: 1.5em; margin: 0.3em 0; }
      .tiptap li   { line-height: 1.75; margin: 0.15em 0; }

      /* Task lists */
      .tiptap ul[data-type="taskList"] { list-style: none; padding-left: 0; }
      .tiptap ul[data-type="taskList"] li {
        display: flex; align-items: flex-start; gap: 8px; margin: 0.3em 0;
      }
      .tiptap ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 4px; }
      .tiptap ul[data-type="taskList"] li > label input[type="checkbox"] {
        width: 16px; height: 16px; cursor: pointer;
        accent-color: ${accent};
        border-radius: 3px;
      }
      .tiptap ul[data-type="taskList"] li[data-checked="true"] > div {
        opacity: 0.4; text-decoration: line-through;
      }

      /* Blockquote */
      .tiptap blockquote {
        border-left: 3px solid ${accent};
        margin: 0.8em 0;
        padding: 0.6em 0 0.6em 1.2em;
        background: ${blockquoteBg};
        border-radius: 0 ${br / 2}px ${br / 2}px 0;
        color: ${textSec};
      }
      .tiptap blockquote p { margin: 0; }

      /* Horizontal rule */
      .tiptap hr {
        border: none;
        border-top: 2px solid ${divider};
        margin: 1.5em 0;
      }

      /* Code block */
      .tiptap pre {
        background: ${preBg};
        border: 1px solid ${divider};
        border-radius: ${Math.max(br, 8)}px;
        padding: 1em 1.25em;
        margin: 0.8em 0;
        overflow-x: auto;
        font-family: 'SF Mono', 'Cascadia Mono', 'Roboto Mono', 'Consolas', monospace;
        font-size: 0.85em;
        line-height: 1.65;
        color: ${text};
      }

      /* Syntax highlighting */
      .tiptap pre .hljs-keyword,
      .tiptap pre .hljs-selector-tag { color: ${isDark ? "#c678dd" : "#a626a4"}; }
      .tiptap pre .hljs-string,
      .tiptap pre .hljs-addition { color: ${isDark ? "#98c379" : "#50a14f"}; }
      .tiptap pre .hljs-number,
      .tiptap pre .hljs-literal { color: ${isDark ? "#d19a66" : "#986801"}; }
      .tiptap pre .hljs-comment,
      .tiptap pre .hljs-quote { color: ${isDark ? "#5c6370" : "#a0a1a7"}; font-style: italic; }
      .tiptap pre .hljs-variable,
      .tiptap pre .hljs-title,
      .tiptap pre .hljs-attr { color: ${isDark ? "#61afef" : "#4078f2"}; }
      .tiptap pre .hljs-type,
      .tiptap pre .hljs-built_in { color: ${isDark ? "#e5c07b" : "#c18401"}; }
      .tiptap pre .hljs-function { color: ${isDark ? "#61afef" : "#4078f2"}; }
      .tiptap pre .hljs-deletion { color: ${isDark ? "#e06c75" : "#e45649"}; }
      .tiptap pre .hljs-punctuation { color: ${isDark ? "#abb2bf" : "#383a42"}; }

      /* Images */
      .tiptap img {
        max-width: 100%;
        height: auto;
        border-radius: ${br}px;
        margin: 0.6em 0;
        display: block;
        cursor: pointer;
        transition: outline 0.15s ease;
      }
      .tiptap img.ProseMirror-selectednode {
        outline: 2px solid ${accent};
        outline-offset: 2px;
      }

      /* Emoji */
      .tiptap img[data-emoji-id] {
        display: inline;
        width: 1.2em;
        height: 1.2em;
        vertical-align: -0.2em;
        margin: 0 0.05em;
        border-radius: 0;
      }
      .tiptap span[data-type="emoji"] img {
        display: inline;
        width: 1.2em;
        height: 1.2em;
        vertical-align: -0.2em;
        margin: 0 0.05em;
        border-radius: 0;
      }

      /* ---------- Tables ---------- */
      .tiptap table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
        table-layout: auto;
        overflow: hidden;
      }
      .tiptap th,
      .tiptap td {
        border: 1px solid ${divider};
        padding: 0.5em 0.75em;
        min-width: 80px;
        vertical-align: top;
        position: relative;
      }
      .tiptap th {
        background: ${alpha(text, 0.04)};
        font-weight: 600;
        text-align: left;
      }
      .tiptap .selectedCell::after {
        content: '';
        position: absolute;
        inset: 0;
        background: ${alpha(accent, 0.12)};
        pointer-events: none;
        z-index: 1;
      }
      .tiptap .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: -2px;
        width: 4px;
        background-color: ${accent};
        pointer-events: none;
      }
      .tiptap.resize-cursor {
        cursor: col-resize;
      }
      .tableWrapper {
        overflow-x: auto;
        margin: 1em 0;
      }

      /* ---------- YouTube embed ---------- */
      .tiptap div[data-youtube-video] {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
        overflow: hidden;
        margin: 1em 0;
        border-radius: ${br}px;
      }
      .tiptap div[data-youtube-video] iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 0;
        border-radius: ${br}px;
      }

      /* ---------- Superscript / Subscript ---------- */
      .tiptap sup { font-size: 0.75em; vertical-align: super; }
      .tiptap sub { font-size: 0.75em; vertical-align: sub; }

      /* Selected node */
      .ProseMirror-selectednode {
        position: relative;
      }
      .ProseMirror-selectednode::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: ${alpha(accent, 0.08)};
        border: 2px solid ${alpha(accent, 0.3)};
        border-radius: ${br / 2}px;
        pointer-events: none;
        z-index: -1;
      }

      /* Selection */
      .tiptap ::selection {
        background: ${alpha(theme.palette.primary.main, 0.2)};
        color: ${text};
      }

      /* Drop cursor */
      .ProseMirror-dropcursor {
        border-color: ${accent} !important;
        border-width: 2px !important;
        opacity: 1 !important;
      }

      /* ---------- Drag handle area ---------- */
      .notion-drag-handle {
        display: flex;
        align-items: center;
        gap: 2px;
      }

      /* ---------- Print styles ---------- */
      @media print {
        .notion-editor-header,
        .tiptap-bubble-menu { display: none !important; }
        .tiptap.ProseMirror { padding: 0; min-height: auto; }
        .notion-editor-content { padding: 0; }
      }
    `;

    return () => {
      el?.remove();
    };
  }, [theme]);
}
