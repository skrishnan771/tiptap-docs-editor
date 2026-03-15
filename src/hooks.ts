"use client";

import { useEffect, useState } from "react";
import { alpha, type Theme } from "@mui/material/styles";
import type { Editor } from "@tiptap/react";

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

    el.textContent = `
      .tiptap.ProseMirror {
        outline: none;
        caret-color: ${theme.palette.secondary.main};
        font-family: ${theme.typography.fontFamily};
        font-size: ${theme.typography.body1.fontSize};
        line-height: 1.8;
        color: ${theme.palette.text.primary};
        padding-left: 1.5rem;
        min-height: 200px;
      }

      .tiptap p { margin: 0 0 0.4em; }

      .tiptap p.is-empty.is-editor-empty::before,
      .tiptap .is-empty:first-child::before {
        content: attr(data-placeholder);
        color: ${theme.palette.text.disabled};
        pointer-events: none; float: left; height: 0;
      }

      .tiptap h1, .tiptap h2, .tiptap h3 {
        font-family: ${theme.typography.fontFamily};
        font-weight: ${theme.typography.h2.fontWeight};
        color: ${theme.palette.text.primary};
        line-height: 1.3;
        margin: 1.4em 0 0.3em;
      }
      .tiptap h1 { font-size: ${theme.typography.h3.fontSize}; }
      .tiptap h2 { font-size: ${theme.typography.h4.fontSize}; }
      .tiptap h3 { font-size: ${theme.typography.h5.fontSize}; }

      .tiptap strong { font-weight: 700; }
      .tiptap em     { font-style: italic; }
      .tiptap u      { text-decoration: underline; text-underline-offset: 3px; }
      .tiptap s      { text-decoration: line-through; opacity: 0.6; }

      .tiptap code {
        background: ${alpha(theme.palette.secondary.main, 0.1)};
        color: ${theme.palette.secondary.dark};
        border-radius: 4px;
        padding: 0.15em 0.35em;
        font-size: 0.88em;
        font-family: 'Cascadia Mono', 'Roboto Mono', monospace;
      }
      .tiptap pre code {
        background: none; color: inherit; padding: 0;
        border-radius: 0; font-size: inherit;
      }

      .tiptap mark {
        background-color: ${alpha("#facc15", 0.4)};
        border-radius: 2px;
        padding: 0.05em 0.15em;
        color: inherit;
      }

      .tiptap a {
        color: ${theme.palette.secondary.main};
        text-decoration: underline;
        text-underline-offset: 3px;
        cursor: pointer;
        transition: color 0.15s;
      }
      .tiptap a:hover { color: ${theme.palette.secondary.dark}; }

      .tiptap ul   { list-style: disc;    padding-left: 1.5em; margin: 0.3em 0; }
      .tiptap ol   { list-style: decimal; padding-left: 1.5em; margin: 0.3em 0; }
      .tiptap li   { line-height: 1.8; margin: 0.15em 0; }

      .tiptap ul[data-type="taskList"] { list-style: none; padding-left: 0; }
      .tiptap ul[data-type="taskList"] li {
        display: flex; align-items: flex-start; gap: 8px; margin: 0.3em 0;
      }
      .tiptap ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 4px; }
      .tiptap ul[data-type="taskList"] li > label input[type="checkbox"] {
        width: 15px; height: 15px; cursor: pointer;
        accent-color: ${theme.palette.secondary.main};
      }
      .tiptap ul[data-type="taskList"] li[data-checked="true"] > div {
        opacity: 0.4; text-decoration: line-through;
      }

      .tiptap blockquote {
        border-left: 3px solid ${theme.palette.secondary.main};
        margin: 0.8em 0;
        padding: 0.4em 0 0.4em 1em;
        background: ${alpha(theme.palette.secondary.main, 0.04)};
        border-radius: 0 ${br / 2}px ${br / 2}px 0;
        color: ${theme.palette.text.secondary};
      }
      .tiptap blockquote p { margin: 0; }

      .tiptap hr {
        border: none;
        border-top: 2px solid ${theme.palette.divider};
        margin: 1.5em 0;
      }

      .tiptap pre {
        background: ${isDark ? "#1a1a2e" : "#f5f5f8"};
        border: 1px solid ${theme.palette.divider};
        border-radius: ${br}px;
        padding: 1em 1.25em;
        margin: 0.8em 0;
        overflow-x: auto;
        font-family: 'Cascadia Mono', 'Roboto Mono', 'Consolas', monospace;
        font-size: 0.85em;
        line-height: 1.6;
        color: ${theme.palette.text.primary};
      }

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
        outline: 2px solid ${theme.palette.secondary.main};
        outline-offset: 2px;
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
        border: 1px solid ${theme.palette.divider};
        padding: 0.5em 0.75em;
        min-width: 80px;
        vertical-align: top;
        position: relative;
      }
      .tiptap th {
        background: ${alpha(theme.palette.text.primary, 0.04)};
        font-weight: 600;
        text-align: left;
      }
      .tiptap .selectedCell::after {
        content: '';
        position: absolute;
        inset: 0;
        background: ${alpha(theme.palette.secondary.main, 0.12)};
        pointer-events: none;
        z-index: 1;
      }
      .tiptap .column-resize-handle {
        position: absolute;
        right: -2px;
        top: 0;
        bottom: -2px;
        width: 4px;
        background-color: ${theme.palette.secondary.main};
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

      .ProseMirror-selectednode {
        position: relative;
      }
      .ProseMirror-selectednode::after {
        content: '';
        position: absolute;
        inset: -2px;
        background: ${alpha(theme.palette.secondary.main, 0.08)};
        border: 2px solid ${alpha(theme.palette.secondary.main, 0.3)};
        border-radius: ${br / 2}px;
        pointer-events: none;
        z-index: -1;
      }

      .tiptap ::selection {
        background: ${alpha(theme.palette.primary.main, 0.2)};
        color: ${theme.palette.text.primary};
      }

      .ProseMirror-dropcursor {
        border-color: ${theme.palette.secondary.main} !important;
        border-width: 2px !important;
        opacity: 1 !important;
      }

      /* ---------- Print styles ---------- */
      @media print {
        .tiptap-toolbar, .tiptap-bubble-menu { display: none !important; }
        .tiptap.ProseMirror { padding: 0; min-height: auto; }
      }
    `;

    return () => {
      el?.remove();
    };
  }, [theme]);
}
