"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import { BubbleMenu } from "@tiptap/react/menus";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import WidthFullIcon from "@mui/icons-material/WidthFull";
import PhotoSizeSelectSmallIcon from "@mui/icons-material/PhotoSizeSelectSmall";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface ImageBubbleMenuProps {
  editor: Editor;
  theme: Theme;
}

export const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({ editor, theme }) => {
  const accent = theme.palette.secondary.main;

  const setImageSize = (width: string) => {
    editor.chain().focus().updateAttributes("image", { width }).run();
  };

  const setImageAlign = (style: string) => {
    const attrs: Record<string, string> = {};
    if (style === "left") {
      attrs.style = "margin-right: auto; margin-left: 0;";
    } else if (style === "center") {
      attrs.style = "margin-left: auto; margin-right: auto;";
    } else if (style === "right") {
      attrs.style = "margin-left: auto; margin-right: 0;";
    }
    editor.chain().focus().updateAttributes("image", attrs).run();
  };

  const ImgBtn: React.FC<{ label: string; onClick: () => void; children: React.ReactNode }> = ({
    label,
    onClick,
    children,
  }) => (
    <Tooltip title={label} arrow placement="top">
      <IconButton
        size="small"
        onMouseDown={(e) => {
          e.preventDefault();
          onClick();
        }}
        sx={{
          borderRadius: `${theme.shape.borderRadius}px`,
          color: theme.palette.text.secondary,
          "&:hover": {
            bgcolor: theme.palette.action.hover,
            color: accent,
          },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  );

  return (
    <BubbleMenu
      editor={editor}
      style={{ zIndex: 10 }}
      options={{ placement: "top", offset: { mainAxis: 8 } }}
      shouldShow={({ editor: e }) => e.isActive("image")}
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
        <ImgBtn label="Small (25%)" onClick={() => setImageSize("25%")}>
          <PhotoSizeSelectSmallIcon sx={{ fontSize: 16 }} />
        </ImgBtn>
        <ImgBtn label="Medium (50%)" onClick={() => setImageSize("50%")}>
          <PhotoSizeSelectLargeIcon sx={{ fontSize: 16 }} />
        </ImgBtn>
        <ImgBtn label="Full width" onClick={() => setImageSize("100%")}>
          <WidthFullIcon sx={{ fontSize: 16 }} />
        </ImgBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

        <ImgBtn label="Align left" onClick={() => setImageAlign("left")}>
          <FormatAlignLeftIcon sx={{ fontSize: 16 }} />
        </ImgBtn>
        <ImgBtn label="Align center" onClick={() => setImageAlign("center")}>
          <FormatAlignCenterIcon sx={{ fontSize: 16 }} />
        </ImgBtn>
        <ImgBtn label="Align right" onClick={() => setImageAlign("right")}>
          <FormatAlignRightIcon sx={{ fontSize: 16 }} />
        </ImgBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

        <ImgBtn
          label="Delete image"
          onClick={() => editor.chain().focus().deleteSelection().run()}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
        </ImgBtn>
      </Paper>
    </BubbleMenu>
  );
};
