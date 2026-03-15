"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import { BubbleMenu } from "@tiptap/react/menus";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import HighlightIcon from "@mui/icons-material/Highlight";
import SuperscriptIcon from "@mui/icons-material/Superscript";
import SubscriptIcon from "@mui/icons-material/Subscript";

import { TBtn } from "./toolbar-button";
import { LinkPopoverButton } from "./link-popover";

export const BubbleToolbar: React.FC<{ editor: Editor; theme: Theme }> = ({
  editor,
  theme,
}) => {
  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top", offset: { mainAxis: 8 } }}
      shouldShow={({ editor: e, state }) => {
        const { from, to } = state.selection;
        if (from === to) return false;
        if (e.isActive("image")) return false;
        if (e.isActive("codeBlock")) return false;
        return true;
      }}
    >
      <Paper
        elevation={8}
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.25,
          px: 0.75,
          py: 0.25,
          borderRadius: `${theme.shape.borderRadius}px`,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TBtn label="Bold" action="bold" editor={editor} theme={theme}>
          <FormatBoldIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Italic" action="italic" editor={editor} theme={theme}>
          <FormatItalicIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Underline" action="underline" editor={editor} theme={theme}>
          <FormatUnderlinedIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Strike" action="strike" editor={editor} theme={theme}>
          <StrikethroughSIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Code" action="code" editor={editor} theme={theme}>
          <CodeIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Highlight" action="highlight" editor={editor} theme={theme}>
          <HighlightIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Superscript" action="superscript" editor={editor} theme={theme}>
          <SuperscriptIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Subscript" action="subscript" editor={editor} theme={theme}>
          <SubscriptIcon sx={{ fontSize: 16 }} />
        </TBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

        <LinkPopoverButton editor={editor} theme={theme} iconSize={16} />
      </Paper>
    </BubbleMenu>
  );
};
