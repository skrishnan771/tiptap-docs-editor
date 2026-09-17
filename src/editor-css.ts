import { alpha, type Theme } from "@mui/material/styles";

/**
 * Notion's editing surface is a 708px text column inside a ~96px gutter, which
 * is where the block affordances (drag handle, add button) live.
 */
const TEXT_WIDTH = 708;
const GUTTER = 96;
const PAGE_WIDTH = TEXT_WIDTH + GUTTER * 2;

/**
 * The Notion popover shadow: a hairline ring plus two diffuse layers. Shared by
 * every floating surface so the menus read as one family.
 */
export function notionShadow(isDark: boolean): string {
  return isDark
    ? "rgba(15, 15, 15, 0.2) 0px 0px 0px 1px, rgba(15, 15, 15, 0.3) 0px 3px 6px, rgba(15, 15, 15, 0.4) 0px 9px 24px"
    : "rgba(15, 15, 15, 0.05) 0px 0px 0px 1px, rgba(15, 15, 15, 0.1) 0px 3px 6px, rgba(15, 15, 15, 0.2) 0px 9px 24px";
}

/**
 * Builds the editor stylesheet. Geometry, type scale and spacing follow Notion;
 * colours are derived from the MUI theme so a consumer's palette still drives
 * the result.
 */
export function buildEditorCss(theme: Theme): string {
  const isDark = theme.palette.mode === "dark";
  const br = Number(theme.shape.borderRadius);

  const bg = theme.palette.background.default;
  const bgPaper = theme.palette.background.paper;
  const text = theme.palette.text.primary;
  const textSec = theme.palette.text.secondary;
  const textDis = theme.palette.text.disabled;
  const accent = theme.palette.secondary.main;
  const accentDk = theme.palette.secondary.dark;
  const primary = theme.palette.primary.main;
  const onPrimary = theme.palette.primary.contrastText;
  const divider = theme.palette.divider;
  const font = theme.typography.fontFamily;

  /* Notion's grey overlays, expressed against the theme's own ink so they adapt
     to any palette instead of assuming a white page. */
  const tint = (o: number) => alpha(text, o);
  const hoverBg = tint(isDark ? 0.08 : 0.055);
  const inlineCodeBg = tint(isDark ? 0.11 : 0.08);
  const inlineCodeFg = isDark ? "#ff7369" : "#eb5757";
  const codeBlockBg = isDark ? alpha("#000000", 0.28) : "#f7f6f3";
  const mono =
    "'SFMono-Regular', 'SF Mono', Menlo, Consolas, 'Cascadia Mono', 'Roboto Mono', monospace";
  const radius = (max: number) => `${Math.min(br, max)}px`;

  return `
    /* ===== Shell ===== */
    .notion-editor-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: ${bg};
      color: ${text};
      font-family: ${font};
      -webkit-font-smoothing: antialiased;
      position: relative;
    }

    /* ===== Toolbar (Notion has none; keep it quiet when enabled) ===== */
    .notion-editor-header {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 2px;
      padding: 5px 12px;
      background: ${bgPaper};
      border-bottom: 1px solid ${divider};
      flex-shrink: 0;
      position: sticky;
      top: 0;
      z-index: 3;
    }

    /* ===== Page column ===== */
    .notion-editor-layout {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .notion-editor-content {
      flex: 1;
      overflow-y: auto;
      min-width: 0;
    }
    .notion-editor-page {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      min-height: 100%;
      max-width: ${PAGE_WIDTH}px;
      margin: 0 auto;
      padding: 0 ${GUTTER}px;
    }
    /* EditorContent's wrapper: let the writing surface fill the viewport so a
       click anywhere below the last block still lands in the document. */
    .notion-editor-page > div {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      min-height: 0;
    }
    @media (max-width: 900px) {
      .notion-editor-page { padding: 0 48px; }
    }
    @media (max-width: 600px) {
      .notion-editor-page { padding: 0 20px; }
    }

    /* ===== Writing surface ===== */
    .tiptap.ProseMirror {
      flex: 1 1 auto;
      outline: none;
      caret-color: ${text};
      font-family: ${font};
      font-size: 1rem;
      line-height: 1.5;
      color: ${text};
      padding: 44px 0 30vh;
      word-wrap: break-word;
      -webkit-font-variant-ligatures: none;
      font-variant-ligatures: none;
    }
    .tiptap.ProseMirror > *:first-child { margin-top: 0; }

    /* Notion block rhythm: tight margins with a little inner padding. */
    .tiptap p {
      margin: 1px 0;
      padding: 3px 2px;
    }

    /* Placeholder shows on the focused empty block only. */
    .tiptap .is-empty::before {
      content: attr(data-placeholder);
      color: ${textDis};
      pointer-events: none;
      float: left;
      height: 0;
    }

    /* ===== Headings ===== */
    .tiptap h1,
    .tiptap h2,
    .tiptap h3 {
      font-family: ${font};
      font-weight: 600;
      color: ${text};
      padding: 3px 2px;
      line-height: 1.3;
    }
    .tiptap h1 { font-size: 1.875em; margin: 2em 0 4px; }
    .tiptap h2 { font-size: 1.5em;   margin: 1.4em 0 1px; }
    .tiptap h3 { font-size: 1.25em;  margin: 1em 0 1px; }

    /* ===== Inline formatting ===== */
    .tiptap strong { font-weight: 600; }
    .tiptap em     { font-style: italic; }
    .tiptap u      { text-decoration: underline; text-underline-offset: 2px; }
    .tiptap s      { text-decoration: line-through; }

    .tiptap code {
      background: ${inlineCodeBg};
      color: ${inlineCodeFg};
      border-radius: 4px;
      padding: 0.2em 0.4em;
      font-size: 85%;
      font-family: ${mono};
      line-height: normal;
    }
    .tiptap pre code {
      background: none;
      color: inherit;
      padding: 0;
      border-radius: 0;
      font-size: inherit;
    }

    .tiptap mark {
      background-color: ${alpha("#facc15", isDark ? 0.32 : 0.42)};
      border-radius: 2px;
      padding: 0.05em 0.15em;
      color: inherit;
      -webkit-box-decoration-break: clone;
      box-decoration-break: clone;
    }

    /* Notion underlines links in the text colour rather than tinting them. */
    .tiptap a {
      color: inherit;
      text-decoration: underline;
      text-decoration-color: ${tint(0.4)};
      text-underline-offset: 2px;
      cursor: pointer;
      transition: background-color 20ms ease-in;
    }
    .tiptap a:hover {
      background: ${hoverBg};
      text-decoration-color: ${tint(0.7)};
    }

    /* ===== Lists ===== */
    .tiptap ul,
    .tiptap ol {
      margin: 1px 0;
      padding-left: 1.7em;
    }
    .tiptap ul { list-style: disc; }
    .tiptap ol { list-style: decimal; }
    .tiptap ul ul { list-style: circle; }
    .tiptap ul ul ul { list-style: square; }
    .tiptap li {
      padding: 3px 2px;
      line-height: 1.5;
    }
    .tiptap li > p { margin: 0; padding: 0; }

    /* Task lists */
    .tiptap ul[data-type="taskList"] {
      list-style: none;
      padding-left: 2px;
    }
    .tiptap ul[data-type="taskList"] li {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 3px 2px;
    }
    .tiptap ul[data-type="taskList"] li > label {
      flex: 0 0 auto;
      margin-top: 4px;
      display: flex;
    }
    .tiptap ul[data-type="taskList"] li > div { flex: 1 1 auto; min-width: 0; }
    .tiptap ul[data-type="taskList"] input[type="checkbox"] {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
      width: 16px;
      height: 16px;
      border: 1.25px solid ${tint(0.35)};
      border-radius: 3px;
      background: transparent;
      cursor: pointer;
      position: relative;
      transition: background-color 120ms ease, border-color 120ms ease;
    }
    .tiptap ul[data-type="taskList"] input[type="checkbox"]:hover {
      background: ${hoverBg};
    }
    .tiptap ul[data-type="taskList"] input[type="checkbox"]:checked {
      background: ${primary};
      border-color: ${primary};
    }
    .tiptap ul[data-type="taskList"] input[type="checkbox"]:checked::after {
      content: "";
      position: absolute;
      left: 4.5px;
      top: 1px;
      width: 4px;
      height: 8px;
      border: solid ${onPrimary};
      border-width: 0 1.75px 1.75px 0;
      transform: rotate(45deg);
    }
    .tiptap ul[data-type="taskList"] li[data-checked="true"] > div {
      color: ${textDis};
      text-decoration: line-through;
    }

    /* ===== Toggle list (details) ===== */
    .tiptap [data-type="details"] {
      display: flex;
      align-items: flex-start;
      gap: 2px;
      margin: 1px 0;
      padding: 3px 2px;
    }
    .tiptap [data-type="details"] > button {
      all: unset;
      box-sizing: border-box;
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 22px;
      height: 26px;
      border-radius: ${radius(4)};
      cursor: pointer;
      color: ${textSec};
      transition: background-color 20ms ease-in;
    }
    .tiptap [data-type="details"] > button:hover { background: ${hoverBg}; }
    .tiptap [data-type="details"] > button::before {
      content: "";
      width: 0;
      height: 0;
      border-left: 5px solid currentColor;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      transition: transform 200ms ease;
    }
    .tiptap [data-type="details"].is-open > button::before {
      transform: rotate(90deg);
    }
    .tiptap [data-type="details"] > div {
      flex: 1 1 auto;
      min-width: 0;
    }
    .tiptap [data-type="details"] summary {
      list-style: none;
      cursor: text;
      padding: 3px 2px;
    }
    .tiptap [data-type="details"] summary::marker,
    .tiptap [data-type="details"] summary::-webkit-details-marker { display: none; }
    .tiptap [data-type="detailsContent"] > *:first-child { margin-top: 0; }
    .tiptap [data-type="detailsContent"][hidden] { display: none; }

    /* ===== Blockquote ===== */
    .tiptap blockquote {
      border-left: 3px solid currentColor;
      margin: 6px 0;
      padding: 3px 0 3px 14px;
      font-size: 1em;
      color: ${text};
    }
    .tiptap blockquote p { margin: 0; padding: 0; }

    /* ===== Divider ===== */
    .tiptap hr {
      border: none;
      border-top: 1px solid ${divider};
      margin: 8px 0;
      padding: 0;
    }
    .tiptap hr.ProseMirror-selectednode { border-top-color: ${primary}; }

    /* ===== Code block ===== */
    .tiptap pre {
      background: ${codeBlockBg};
      border-radius: ${radius(4)};
      padding: 16px;
      margin: 4px 0;
      overflow-x: auto;
      font-family: ${mono};
      font-size: 85%;
      line-height: 1.5;
      tab-size: 2;
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

    /* ===== Images ===== */
    .tiptap img {
      max-width: 100%;
      height: auto;
      border-radius: ${radius(3)};
      margin: 4px 0;
      display: block;
      cursor: pointer;
    }
    .tiptap img.ProseMirror-selectednode {
      outline: 2px solid ${alpha(primary, 0.6)};
      outline-offset: 1px;
    }

    /* Emoji */
    .tiptap img[data-emoji-id],
    .tiptap span[data-type="emoji"] img {
      display: inline;
      width: 1.2em;
      height: 1.2em;
      vertical-align: -0.2em;
      margin: 0 0.05em;
      border-radius: 0;
    }

    /* ===== Tables ===== */
    .tableWrapper {
      overflow-x: auto;
      margin: 6px 0;
      padding-bottom: 2px;
    }
    .tiptap table {
      border-collapse: collapse;
      table-layout: fixed;
      width: max-content;
      min-width: 100%;
      margin: 0;
    }
    .tiptap th,
    .tiptap td {
      border: 1px solid ${divider};
      padding: 7px 9px;
      min-width: 120px;
      vertical-align: top;
      position: relative;
      box-sizing: border-box;
    }
    .tiptap th {
      background: ${tint(isDark ? 0.06 : 0.03)};
      font-weight: 600;
      text-align: left;
    }
    .tiptap th > p,
    .tiptap td > p { margin: 0; padding: 0; }
    .tiptap .selectedCell::after {
      content: '';
      position: absolute;
      inset: 0;
      background: ${alpha(primary, 0.14)};
      pointer-events: none;
      z-index: 1;
    }
    .tiptap .column-resize-handle {
      position: absolute;
      right: -2px;
      top: 0;
      bottom: -2px;
      width: 3px;
      background-color: ${primary};
      pointer-events: none;
      z-index: 2;
    }
    .tiptap.resize-cursor { cursor: col-resize; }

    /* ===== YouTube embed ===== */
    .tiptap div[data-youtube-video] {
      position: relative;
      padding-bottom: 56.25%;
      height: 0;
      overflow: hidden;
      margin: 6px 0;
      border-radius: ${radius(4)};
    }
    .tiptap div[data-youtube-video] iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }

    /* ===== Super / subscript ===== */
    .tiptap sup { font-size: 0.75em; vertical-align: super; }
    .tiptap sub { font-size: 0.75em; vertical-align: sub; }

    /* ===== Selection ===== */
    .tiptap ::selection {
      background: ${alpha(primary, 0.28)};
    }
    .tiptap .ProseMirror-selectednode:not(img):not(hr) {
      background: ${alpha(primary, 0.14)};
      border-radius: ${radius(3)};
    }
    .tiptap .ProseMirror-hideselection *::selection { background: transparent; }
    .tiptap-gapcursor::after { border-top-color: ${text}; }

    /* Drop cursor */
    .ProseMirror-dropcursor {
      border-color: ${accent} !important;
      border-width: 2px !important;
      opacity: 1 !important;
    }
    .tiptap.dragging { cursor: grabbing; }

    /* ===== Left gutter affordances ===== */
    .notion-drag-handle {
      display: flex;
      align-items: center;
      gap: 1px;
      /* Keeps the controls in the page gutter, clear of the text column. */
      padding-right: 6px;
    }
    .notion-gutter-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${radius(4)};
      color: ${tint(0.35)};
      cursor: pointer;
      transition: background-color 20ms ease-in, color 20ms ease-in;
    }
    .notion-gutter-btn:hover {
      background: ${hoverBg};
      color: ${textSec};
    }

    /* ===== Print ===== */
    @media print {
      .notion-editor-header,
      .notion-drag-handle,
      .notion-editor-footer,
      .tiptap-floating-menu { display: none !important; }
      .notion-editor-wrapper,
      .notion-editor-layout,
      .notion-editor-content {
        overflow: visible !important;
        height: auto !important;
      }
      .notion-editor-page { max-width: none; padding: 0; }
      .tiptap.ProseMirror { padding: 0; }
      .tiptap a { color: ${accentDk}; }
    }
  `;
}
