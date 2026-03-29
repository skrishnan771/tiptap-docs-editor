"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import useMediaQuery from "@mui/material/useMediaQuery";

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
  const isMobile = !useMediaQuery(theme.breakpoints.up("sm"));

  const sep = (
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5, alignSelf: "center", height: 20 }} />
  );

  /* ── Toolbar container ────────────────────────────────────── */

  const toolbarSx = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: 0.25,
    px: 1.5,
    py: 0.5,
    borderBottom: `1px solid ${theme.palette.divider}`,
    bgcolor: theme.palette.background.paper,
    position: "sticky" as const,
    top: 0,
    zIndex: 2,
    flexShrink: 0,
  };

  return (
    <Box sx={toolbarSx}>
      {/* History */}
      {cfg.history && (
        <>
          <TBtn label="Undo (Ctrl+Z)" action="undo" editor={editor} theme={theme} disabled={!editor.can().undo()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M9.70711 3.70711C10.0976 3.31658 10.0976 2.68342 9.70711 2.29289C9.31658 1.90237 8.68342 1.90237 8.29289 2.29289L3.29289 7.29289C2.90237 7.68342 2.90237 8.31658 3.29289 8.70711L8.29289 13.7071C8.68342 14.0976 9.31658 14.0976 9.70711 13.7071C10.0976 13.3166 10.0976 12.6834 9.70711 12.2929L6.41421 9H14.5C15.0909 9 15.6761 9.1164 16.2221 9.34254C16.768 9.56869 17.2641 9.90016 17.682 10.318C18.0998 10.7359 18.4313 11.232 18.6575 11.7779C18.8836 12.3239 19 12.9091 19 13.5C19 14.0909 18.8836 14.6761 18.6575 15.2221C18.4313 15.768 18.0998 16.2641 17.682 16.682C17.2641 17.0998 16.768 17.4313 16.2221 17.6575C15.6761 17.8836 15.0909 18 14.5 18H11C10.4477 18 10 18.4477 10 19C10 19.5523 10.4477 20 11 20H14.5C15.3536 20 16.1988 19.8319 16.9874 19.5052C17.7761 19.1786 18.4926 18.6998 19.0962 18.0962C19.6998 17.4926 20.1786 16.7761 20.5052 15.9874C20.8319 15.1988 21 14.3536 21 13.5C21 12.6464 20.8319 11.8012 20.5052 11.0126C20.1786 10.2239 19.6998 9.50739 19.0962 8.90381C18.4926 8.30022 17.7761 7.82144 16.9874 7.49478C16.1988 7.16813 15.3536 7 14.5 7H6.41421L9.70711 3.70711Z" /></svg>
          </TBtn>
          <TBtn label="Redo (Ctrl+Y)" action="redo" editor={editor} theme={theme} disabled={!editor.can().redo()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" clipRule="evenodd" d="M15.7071 2.29289C15.3166 1.90237 14.6834 1.90237 14.2929 2.29289C13.9024 2.68342 13.9024 3.31658 14.2929 3.70711L17.5858 7H9.5C7.77609 7 6.12279 7.68482 4.90381 8.90381C3.68482 10.1228 3 11.7761 3 13.5C3 14.3536 3.16813 15.1988 3.49478 15.9874C3.82144 16.7761 4.30023 17.4926 4.90381 18.0962C6.12279 19.3152 7.77609 20 9.5 20H13C13.5523 20 14 19.5523 14 19C14 18.4477 13.5523 18 13 18H9.5C8.30653 18 7.16193 17.5259 6.31802 16.682C5.90016 16.2641 5.56869 15.768 5.34254 15.2221C5.1164 14.6761 5 14.0909 5 13.5C5 12.3065 5.47411 11.1619 6.31802 10.318C7.16193 9.47411 8.30653 9 9.5 9H17.5858L14.2929 12.2929C13.9024 12.6834 13.9024 13.3166 14.2929 13.7071C14.6834 14.0976 15.3166 14.0976 15.7071 13.7071L20.7071 8.70711C21.0976 8.31658 21.0976 7.68342 20.7071 7.29289L15.7071 2.29289Z" /></svg>
          </TBtn>
          {sep}
        </>
      )}

      {/* Font controls (desktop only) */}
      {!isMobile && cfg.fontControls && (
        <>
          <FontFamilySelect editor={editor} theme={theme} />
          <FontSizeSelect editor={editor} theme={theme} />
          {sep}
        </>
      )}

      {/* Core formatting */}
      {cfg.formatting && (
        <>
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
        </>
      )}

      {/* Extended formatting */}
      {cfg.formatting && (
        <>
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
        </>
      )}

      {(cfg.formatting || cfg.colorControls) && sep}

      {/* Color controls */}
      {cfg.colorControls && (
        <>
          <ColorPickerButton editor={editor} theme={theme} mode="text" icon={<FormatColorTextIcon fontSize="small" />} label="Text color" />
          <ColorPickerButton editor={editor} theme={theme} mode="highlight" icon={<HighlightIcon fontSize="small" />} label="Highlight color" />
          {sep}
        </>
      )}

      {/* Headings */}
      {cfg.headings && (
        <>
          <HBtn level={1} editor={editor} theme={theme} />
          <HBtn level={2} editor={editor} theme={theme} />
          <HBtn level={3} editor={editor} theme={theme} />
          {sep}
        </>
      )}

      {/* Lists */}
      {cfg.lists && (
        <>
          <TBtn label="Bullet List" action="bulletList" editor={editor} theme={theme}>
            <FormatListBulletedIcon fontSize="small" />
          </TBtn>
          <TBtn label="Ordered List" action="orderedList" editor={editor} theme={theme}>
            <FormatListNumberedIcon fontSize="small" />
          </TBtn>
          <TBtn label="Checklist" action="taskList" editor={editor} theme={theme}>
            <ChecklistIcon fontSize="small" />
          </TBtn>
        </>
      )}

      {/* Alignment */}
      {cfg.alignment && (
        <>
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
        </>
      )}

      {(cfg.lists || cfg.alignment) && sep}

      {/* Insert */}
      {cfg.inserts && (
        <>
          <TBtn label="Blockquote" action="blockquote" editor={editor} theme={theme}>
            <FormatQuoteIcon fontSize="small" />
          </TBtn>
          <TBtn label="Horizontal Rule" action="horizontalRule" editor={editor} theme={theme}>
            <HorizontalRuleIcon fontSize="small" />
          </TBtn>
          <TBtn label="Code Block" action="codeBlock" editor={editor} theme={theme}>
            <DataObjectIcon fontSize="small" />
          </TBtn>
          <TBtn label="Image" action="custom" editor={editor} theme={theme} onCustomAction={() => fileInputRef.current?.click()}>
            <ImageOutlinedIcon fontSize="small" />
          </TBtn>
          <LinkPopoverButton editor={editor} theme={theme} />
        </>
      )}

      {/* Table */}
      {cfg.table && <TableMenu editor={editor} theme={theme} />}

      {(cfg.inserts || cfg.table) && sep}

      {/* Utilities */}
      {cfg.clearFormatting && (
        <TBtn label="Clear Formatting" action="clearFormatting" editor={editor} theme={theme}>
          <FormatClearIcon fontSize="small" />
        </TBtn>
      )}
      {cfg.print && (
        <TBtn label="Print" action="custom" editor={editor} theme={theme} onCustomAction={() => window.print()}>
          <PrintIcon fontSize="small" />
        </TBtn>
      )}
    </Box>
  );
};
