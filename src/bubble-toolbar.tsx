"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import { BubbleMenu } from "@tiptap/react/menus";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import HighlightIcon from "@mui/icons-material/Highlight";
import TitleIcon from "@mui/icons-material/Title";
import SubjectIcon from "@mui/icons-material/Subject";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DataObjectIcon from "@mui/icons-material/DataObject";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { TBtn } from "./toolbar-button";
import { LinkPopoverButton } from "./link-popover";
import { ColorPickerButton } from "./color-picker";
import { useAnchorPosition } from "./hooks";
import { bubbleMenuPaperSx } from "./utils";

function getCurrentBlockLabel(editor: Editor): string {
  if (editor.isActive("heading", { level: 1 })) return "Heading 1";
  if (editor.isActive("heading", { level: 2 })) return "Heading 2";
  if (editor.isActive("heading", { level: 3 })) return "Heading 3";
  if (editor.isActive("bulletList")) return "Bullet List";
  if (editor.isActive("orderedList")) return "Numbered List";
  if (editor.isActive("taskList")) return "To-do List";
  if (editor.isActive("blockquote")) return "Quote";
  if (editor.isActive("codeBlock")) return "Code Block";
  return "Text";
}

const TURN_INTO_OPTIONS = [
  { label: "Text", icon: <SubjectIcon sx={{ fontSize: 18 }} />, action: () => (e: Editor) => e.chain().focus().setParagraph().run() },
  { label: "Heading 1", icon: <TitleIcon sx={{ fontSize: 18 }} />, action: () => (e: Editor) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { label: "Heading 2", icon: <TitleIcon sx={{ fontSize: 16 }} />, action: () => (e: Editor) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { label: "Heading 3", icon: <TitleIcon sx={{ fontSize: 14 }} />, action: () => (e: Editor) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { label: "Bullet List", icon: <FormatListBulletedIcon sx={{ fontSize: 18 }} />, action: () => (e: Editor) => e.chain().focus().toggleBulletList().run() },
  { label: "Numbered List", icon: <FormatListNumberedIcon sx={{ fontSize: 18 }} />, action: () => (e: Editor) => e.chain().focus().toggleOrderedList().run() },
  { label: "To-do List", icon: <ChecklistIcon sx={{ fontSize: 18 }} />, action: () => (e: Editor) => e.chain().focus().toggleTaskList().run() },
  { label: "Quote", icon: <FormatQuoteIcon sx={{ fontSize: 18 }} />, action: () => (e: Editor) => e.chain().focus().toggleBlockquote().run() },
  { label: "Code Block", icon: <DataObjectIcon sx={{ fontSize: 18 }} />, action: () => (e: Editor) => e.chain().focus().toggleCodeBlock().run() },
];

export const BubbleToolbar: React.FC<{ editor: Editor; theme: Theme }> = ({
  editor,
  theme,
}) => {
  const { open: openTurnInto, close: closeTurnInto, popoverProps: turnIntoProps } = useAnchorPosition();

  return (
    <BubbleMenu
      editor={editor}
      style={{ zIndex: 10 }}
      options={{ placement: "top", offset: { mainAxis: 8 } }}
      shouldShow={({ editor: e, state }) => {
        const { from, to } = state.selection;
        if (from === to) return false;
        if (e.isActive("image")) return false;
        if (e.isActive("codeBlock")) return false;
        return true;
      }}
    >
      <Paper elevation={8} sx={bubbleMenuPaperSx(theme)}>
        {/* Turn into dropdown */}
        <Button
          size="small"
          endIcon={<KeyboardArrowDownIcon sx={{ fontSize: 14 }} />}
          onMouseDown={(e) => {
            e.preventDefault();
            openTurnInto(e.currentTarget);
          }}
          sx={{
            textTransform: "none",
            fontSize: "0.75rem",
            fontWeight: 500,
            color: theme.palette.text.secondary,
            minWidth: "auto",
            px: 1,
            py: 0.25,
            borderRadius: `${theme.shape.borderRadius}px`,
            "&:hover": { bgcolor: alpha(theme.palette.text.primary, 0.06) },
          }}
        >
          {getCurrentBlockLabel(editor)}
        </Button>
        <Menu
          {...turnIntoProps}
          slotProps={{
            paper: {
              sx: {
                minWidth: 180,
                mt: 0.5,
                borderRadius: `${theme.shape.borderRadius}px`,
                border: `1px solid ${theme.palette.divider}`,
              },
            },
          }}
        >
          {TURN_INTO_OPTIONS.map((opt) => (
            <MenuItem
              key={opt.label}
              dense
              onClick={() => {
                opt.action()(editor);
                closeTurnInto();
              }}
              sx={{ fontSize: "0.8rem" }}
            >
              <ListItemIcon sx={{ minWidth: 30 }}>{opt.icon}</ListItemIcon>
              <ListItemText>{opt.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

        {/* Formatting */}
        <TBtn label="Bold" action="bold" editor={editor} theme={theme}>
          <FormatBoldIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Italic" action="italic" editor={editor} theme={theme}>
          <FormatItalicIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Underline" action="underline" editor={editor} theme={theme}>
          <FormatUnderlinedIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Strikethrough" action="strike" editor={editor} theme={theme}>
          <StrikethroughSIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Code" action="code" editor={editor} theme={theme}>
          <CodeIcon sx={{ fontSize: 16 }} />
        </TBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

        {/* Link */}
        <LinkPopoverButton editor={editor} theme={theme} iconSize={16} />

        {/* Color controls */}
        <ColorPickerButton
          editor={editor}
          theme={theme}
          mode="highlight"
          icon={<HighlightIcon sx={{ fontSize: 16 }} />}
          label="Highlight"
        />
      </Paper>
    </BubbleMenu>
  );
};
