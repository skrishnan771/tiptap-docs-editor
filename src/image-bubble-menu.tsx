"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import { BubbleMenu } from "@tiptap/react/menus";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import WidthFullIcon from "@mui/icons-material/WidthFull";
import PhotoSizeSelectSmallIcon from "@mui/icons-material/PhotoSizeSelectSmall";
import PhotoSizeSelectLargeIcon from "@mui/icons-material/PhotoSizeSelectLarge";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { TBtn } from "./toolbar-button";
import { bubbleMenuPaperSx } from "./utils";

interface ImageBubbleMenuProps {
  editor: Editor;
  theme: Theme;
}

export const ImageBubbleMenu: React.FC<ImageBubbleMenuProps> = ({ editor, theme }) => {
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

  return (
    <BubbleMenu
      editor={editor}
      style={{ zIndex: 10 }}
      options={{ placement: "top", offset: { mainAxis: 8 } }}
      shouldShow={({ editor: e }) => e.isActive("image")}
    >
      <Paper elevation={8} sx={{ ...bubbleMenuPaperSx(theme), px: 0.75 }}>
        <TBtn label="Small (25%)" action="custom" editor={editor} theme={theme} onCustomAction={() => setImageSize("25%")}>
          <PhotoSizeSelectSmallIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Medium (50%)" action="custom" editor={editor} theme={theme} onCustomAction={() => setImageSize("50%")}>
          <PhotoSizeSelectLargeIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Full width" action="custom" editor={editor} theme={theme} onCustomAction={() => setImageSize("100%")}>
          <WidthFullIcon sx={{ fontSize: 16 }} />
        </TBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

        <TBtn label="Align left" action="custom" editor={editor} theme={theme} onCustomAction={() => setImageAlign("left")}>
          <FormatAlignLeftIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Align center" action="custom" editor={editor} theme={theme} onCustomAction={() => setImageAlign("center")}>
          <FormatAlignCenterIcon sx={{ fontSize: 16 }} />
        </TBtn>
        <TBtn label="Align right" action="custom" editor={editor} theme={theme} onCustomAction={() => setImageAlign("right")}>
          <FormatAlignRightIcon sx={{ fontSize: 16 }} />
        </TBtn>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

        <TBtn
          label="Delete image"
          action="custom"
          editor={editor}
          theme={theme}
          onCustomAction={() => editor.chain().focus().deleteSelection().run()}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16, color: theme.palette.error.main }} />
        </TBtn>
      </Paper>
    </BubbleMenu>
  );
};
