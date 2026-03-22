"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

export type ToolbarAction =
  | "bold" | "italic" | "underline" | "strike" | "code" | "highlight"
  | "h1" | "h2" | "h3"
  | "bulletList" | "orderedList" | "taskList"
  | "blockquote" | "horizontalRule" | "codeBlock"
  | "alignLeft" | "alignCenter" | "alignRight" | "alignJustify"
  | "undo" | "redo"
  | "link" | "image"
  | "superscript" | "subscript"
  | "clearFormatting"
  | "insertTable" | "addColumnAfter" | "addColumnBefore" | "deleteColumn"
  | "addRowAfter" | "addRowBefore" | "deleteRow" | "deleteTable" | "mergeCells" | "splitCell"
  | "custom";

export function dispatchAction(editor: Editor, action: ToolbarAction) {
  const c = editor.chain().focus();
  switch (action) {
    case "bold": c.toggleBold().run(); break;
    case "italic": c.toggleItalic().run(); break;
    case "underline": c.toggleUnderline().run(); break;
    case "strike": c.toggleStrike().run(); break;
    case "code": c.toggleCode().run(); break;
    case "highlight": c.toggleHighlight().run(); break;
    case "h1": c.toggleHeading({ level: 1 }).run(); break;
    case "h2": c.toggleHeading({ level: 2 }).run(); break;
    case "h3": c.toggleHeading({ level: 3 }).run(); break;
    case "bulletList": c.toggleBulletList().run(); break;
    case "orderedList": c.toggleOrderedList().run(); break;
    case "taskList": c.toggleTaskList().run(); break;
    case "blockquote": c.toggleBlockquote().run(); break;
    case "horizontalRule": c.setHorizontalRule().run(); break;
    case "codeBlock": c.toggleCodeBlock().run(); break;
    case "alignLeft": c.setTextAlign("left").run(); break;
    case "alignCenter": c.setTextAlign("center").run(); break;
    case "alignRight": c.setTextAlign("right").run(); break;
    case "alignJustify": c.setTextAlign("justify").run(); break;
    case "undo": c.undo().run(); break;
    case "redo": c.redo().run(); break;
    case "superscript": c.toggleSuperscript().run(); break;
    case "subscript": c.toggleSubscript().run(); break;
    case "clearFormatting": c.unsetAllMarks().run(); break;
    case "insertTable": editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(); break;
    case "addColumnAfter": c.addColumnAfter().run(); break;
    case "addColumnBefore": c.addColumnBefore().run(); break;
    case "deleteColumn": c.deleteColumn().run(); break;
    case "addRowAfter": c.addRowAfter().run(); break;
    case "addRowBefore": c.addRowBefore().run(); break;
    case "deleteRow": c.deleteRow().run(); break;
    case "deleteTable": c.deleteTable().run(); break;
    case "mergeCells": c.mergeCells().run(); break;
    case "splitCell": c.splitCell().run(); break;
    default: break;
  }
}

export function isActive(editor: Editor, action: ToolbarAction): boolean {
  switch (action) {
    case "bold": return editor.isActive("bold");
    case "italic": return editor.isActive("italic");
    case "underline": return editor.isActive("underline");
    case "strike": return editor.isActive("strike");
    case "code": return editor.isActive("code");
    case "highlight": return editor.isActive("highlight");
    case "h1": return editor.isActive("heading", { level: 1 });
    case "h2": return editor.isActive("heading", { level: 2 });
    case "h3": return editor.isActive("heading", { level: 3 });
    case "bulletList": return editor.isActive("bulletList");
    case "orderedList": return editor.isActive("orderedList");
    case "taskList": return editor.isActive("taskList");
    case "blockquote": return editor.isActive("blockquote");
    case "codeBlock": return editor.isActive("codeBlock");
    case "alignLeft": return editor.isActive({ textAlign: "left" });
    case "alignCenter": return editor.isActive({ textAlign: "center" });
    case "alignRight": return editor.isActive({ textAlign: "right" });
    case "alignJustify": return editor.isActive({ textAlign: "justify" });
    case "link": return editor.isActive("link");
    case "superscript": return editor.isActive("superscript");
    case "subscript": return editor.isActive("subscript");
    default: return false;
  }
}

export const TBtn: React.FC<{
  label: string;
  action: ToolbarAction;
  editor: Editor;
  theme: Theme;
  disabled?: boolean;
  onCustomAction?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}> = ({ label, action, editor, theme, disabled = false, onCustomAction, children }) => {
  const accent = theme.palette.secondary.main;
  const active = isActive(editor, action);

  return (
    <Tooltip title={label} arrow placement="top">
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          data-action={action}
          onMouseDown={(e) => {
            e.preventDefault();
            const act = e.currentTarget.dataset.action as ToolbarAction;
            if (onCustomAction && (act === "custom" || act === "link" || act === "image")) {
              onCustomAction(e);
            } else {
              dispatchAction(editor, act);
            }
          }}
          style={{
            color: active ? accent : theme.palette.text.secondary,
            backgroundColor: active ? alpha(accent, 0.12) : "transparent",
          }}
          sx={{
            borderRadius: `${theme.shape.borderRadius}px`,
            transition: theme.transitions.create(
              ["background-color", "color"],
              { duration: theme.transitions.duration.shorter }
            ),
            "&:hover": {
              bgcolor: active ? alpha(accent, 0.2) : theme.palette.action.hover,
              color: active ? accent : theme.palette.text.primary,
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export const HBtn: React.FC<{
  level: 1 | 2 | 3;
  editor: Editor;
  theme: Theme;
}> = ({ level, editor, theme }) => {
  const accent = theme.palette.secondary.main;
  const action = `h${level}` as ToolbarAction;
  const active = isActive(editor, action);

  return (
    <Tooltip title={`Heading ${level}`} arrow placement="top">
      <span>
        <IconButton
          size="small"
          data-action={action}
          onMouseDown={(e) => {
            e.preventDefault();
            dispatchAction(editor, e.currentTarget.dataset.action as ToolbarAction);
          }}
          style={{
            color: active ? accent : theme.palette.text.secondary,
            backgroundColor: active ? alpha(accent, 0.12) : "transparent",
          }}
          sx={{
            borderRadius: `${theme.shape.borderRadius}px`,
            fontFamily: theme.typography.fontFamily,
            fontSize: "0.7rem",
            fontWeight: 700,
            width: 34,
            height: 34,
            transition: theme.transitions.create(
              ["background-color", "color"],
              { duration: theme.transitions.duration.shorter }
            ),
            "&:hover": {
              bgcolor: active
                ? alpha(accent, 0.2)
                : theme.palette.action.hover,
              color: active ? accent : theme.palette.text.primary,
            },
          }}
        >
          H{level}
        </IconButton>
      </span>
    </Tooltip>
  );
};
