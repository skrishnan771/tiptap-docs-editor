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
import HighlightIcon from "@mui/icons-material/Highlight";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import LinkIcon from "@mui/icons-material/Link";

import { TBtn, HBtn } from "./toolbar-button";
import { useEditorState } from "./hooks";
import { promptForLink } from "./utils";

export const TopToolbar: React.FC<{
  editor: Editor;
  theme: Theme;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}> = ({ editor, theme, fileInputRef }) => {
  useEditorState(editor);

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
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
        <TBtn label="Undo (Ctrl+Z)" action="undo" editor={editor} theme={theme} disabled={!editor.can().undo()}>
          <UndoIcon fontSize="small" />
        </TBtn>
        <TBtn label="Redo (Ctrl+Y)" action="redo" editor={editor} theme={theme} disabled={!editor.can().redo()}>
          <RedoIcon fontSize="small" />
        </TBtn>
      </Box>

      {sep}

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
        <TBtn label="Highlight" action="highlight" editor={editor} theme={theme}>
          <HighlightIcon fontSize="small" />
        </TBtn>
      </Box>

      {sep}

      <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
        <HBtn level={1} editor={editor} theme={theme} />
        <HBtn level={2} editor={editor} theme={theme} />
        <HBtn level={3} editor={editor} theme={theme} />
      </Box>

      {sep}

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

      {sep}

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
        <TBtn
          label="Link"
          action="link"
          editor={editor}
          theme={theme}
          onCustomAction={() => promptForLink(editor)}
        >
          <LinkIcon fontSize="small" />
        </TBtn>
      </Box>

      {sep}

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
      </Box>
    </Box>
  );
};
