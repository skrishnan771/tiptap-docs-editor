"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import DataObjectIcon from "@mui/icons-material/DataObject";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import HighlightIcon from "@mui/icons-material/Highlight";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import SubscriptIcon from "@mui/icons-material/Subscript";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import PrintIcon from "@mui/icons-material/Print";

import { TBtn, HBtn } from "./toolbar-button";
import { useEditorState } from "./hooks";
import { LinkPopoverButton } from "./link-popover";
import { ColorPickerButton } from "./color-picker";
import { TableMenu } from "./table-menu";
import { FontFamilySelect, FontSizeSelect } from "./font-controls";
import type { ToolbarConfig } from "./types";

const DEFAULT_TOOLBAR: Required<ToolbarConfig> = {
  history: true,
  formatting: true,
  headings: true,
  lists: true,
  inserts: true,
  alignment: true,
  table: true,
  fontControls: true,
  colorControls: true,
  superSubScript: true,
  clearFormatting: true,
  print: true,
};

export const TopToolbar: React.FC<{
  editor: Editor;
  theme: Theme;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  toolbarConfig?: ToolbarConfig;
}> = ({ editor, theme, fileInputRef, toolbarConfig }) => {
  useEditorState(editor);

  const cfg = { ...DEFAULT_TOOLBAR, ...toolbarConfig };

  const sep = (
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
  );

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.25,
        px: 1.5,
        py: 0.75,
        borderBottom: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        position: "sticky",
        top: 0,
        zIndex: 2,
        flexShrink: 0,
        flexWrap: "wrap",
      }}
    >
      {cfg.history && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <TBtn label="Undo (Ctrl+Z)" action="undo" editor={editor} theme={theme} disabled={!editor.can().undo()}>
            <UndoIcon fontSize="small" />
          </TBtn>
          <TBtn label="Redo (Ctrl+Y)" action="redo" editor={editor} theme={theme} disabled={!editor.can().redo()}>
            <RedoIcon fontSize="small" />
          </TBtn>
        </Box>
      )}

      {cfg.history && cfg.formatting && sep}

      {cfg.fontControls && (
        <>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <FontFamilySelect editor={editor} theme={theme} />
            <FontSizeSelect editor={editor} theme={theme} />
          </Box>
          {sep}
        </>
      )}

      {cfg.formatting && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <TBtn label="Bold (Ctrl+B)" action="bold" editor={editor} theme={theme}>
            <FormatBoldIcon fontSize="small" />
          </TBtn>
          <TBtn label="Italic (Ctrl+I)" action="italic" editor={editor} theme={theme}>
            <FormatItalicIcon fontSize="small" />
          </TBtn>
          <TBtn label="Underline (Ctrl+U)" action="underline" editor={editor} theme={theme}>
            <FormatUnderlinedIcon fontSize="small" />
          </TBtn>
          <TBtn label="Strikethrough" action="strike" editor={editor} theme={theme}>
            <StrikethroughSIcon fontSize="small" />
          </TBtn>
          <TBtn label="Inline Code" action="code" editor={editor} theme={theme}>
            <CodeIcon fontSize="small" />
          </TBtn>
          {cfg.superSubScript && (
            <>
              <TBtn label="Superscript" action="superscript" editor={editor} theme={theme}>
                <SuperscriptIcon fontSize="small" />
              </TBtn>
              <TBtn label="Subscript" action="subscript" editor={editor} theme={theme}>
                <SubscriptIcon fontSize="small" />
              </TBtn>
            </>
          )}
        </Box>
      )}

      {cfg.formatting && cfg.colorControls && sep}

      {cfg.colorControls && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <ColorPickerButton
            editor={editor}
            theme={theme}
            mode="text"
            icon={<FormatColorTextIcon fontSize="small" />}
            label="Text color"
          />
          <ColorPickerButton
            editor={editor}
            theme={theme}
            mode="highlight"
            icon={<HighlightIcon fontSize="small" />}
            label="Highlight color"
          />
        </Box>
      )}

      {(cfg.colorControls || cfg.formatting) && cfg.headings && sep}

      {cfg.headings && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <HBtn level={1} editor={editor} theme={theme} />
          <HBtn level={2} editor={editor} theme={theme} />
          <HBtn level={3} editor={editor} theme={theme} />
        </Box>
      )}

      {cfg.headings && cfg.lists && sep}

      {cfg.lists && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <TBtn label="Bullet List" action="bulletList" editor={editor} theme={theme}>
            <FormatListBulletedIcon fontSize="small" />
          </TBtn>
          <TBtn label="Ordered List" action="orderedList" editor={editor} theme={theme}>
            <FormatListNumberedIcon fontSize="small" />
          </TBtn>
          <TBtn label="Checklist" action="taskList" editor={editor} theme={theme}>
            <ChecklistIcon fontSize="small" />
          </TBtn>
        </Box>
      )}

      {cfg.lists && cfg.inserts && sep}

      {cfg.inserts && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <TBtn label="Blockquote" action="blockquote" editor={editor} theme={theme}>
            <FormatQuoteIcon fontSize="small" />
          </TBtn>
          <TBtn label="Horizontal Rule" action="horizontalRule" editor={editor} theme={theme}>
            <HorizontalRuleIcon fontSize="small" />
          </TBtn>
          <TBtn label="Code Block" action="codeBlock" editor={editor} theme={theme}>
            <DataObjectIcon fontSize="small" />
          </TBtn>
          <TBtn
            label="Image"
            action="custom"
            editor={editor}
            theme={theme}
            onCustomAction={() => fileInputRef.current?.click()}
          >
            <ImageOutlinedIcon fontSize="small" />
          </TBtn>
          <LinkPopoverButton editor={editor} theme={theme} />
        </Box>
      )}

      {cfg.inserts && cfg.table && sep}

      {cfg.table && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <TableMenu editor={editor} theme={theme} />
        </Box>
      )}

      {cfg.table && cfg.alignment && sep}

      {cfg.alignment && (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
          <TBtn label="Align Left" action="alignLeft" editor={editor} theme={theme}>
            <FormatAlignLeftIcon fontSize="small" />
          </TBtn>
          <TBtn label="Align Center" action="alignCenter" editor={editor} theme={theme}>
            <FormatAlignCenterIcon fontSize="small" />
          </TBtn>
          <TBtn label="Align Right" action="alignRight" editor={editor} theme={theme}>
            <FormatAlignRightIcon fontSize="small" />
          </TBtn>
          <TBtn label="Align Justify" action="alignJustify" editor={editor} theme={theme}>
            <FormatAlignJustifyIcon fontSize="small" />
          </TBtn>
        </Box>
      )}

      {(cfg.clearFormatting || cfg.print) && sep}

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
        {cfg.clearFormatting && (
          <TBtn label="Clear Formatting" action="clearFormatting" editor={editor} theme={theme}>
            <FormatClearIcon fontSize="small" />
          </TBtn>
        )}
        {cfg.print && (
          <TBtn
            label="Print"
            action="custom"
            editor={editor}
            theme={theme}
            onCustomAction={() => window.print()}
          >
            <PrintIcon fontSize="small" />
          </TBtn>
        )}
      </Box>
    </Box>
  );
};
