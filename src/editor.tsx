"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import DragHandle from "@tiptap/extension-drag-handle-react";

import Box from "@mui/material/Box";
import MuiTypography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

import type { DocsEditorProps } from "./types";
import { useEditorStyles } from "./hooks";
import { TopToolbar } from "./top-toolbar";
import { BubbleToolbar } from "./bubble-toolbar";
import { ImageBubbleMenu } from "./image-bubble-menu";
import { getDefaultExtensions } from "./extensions";

function handleImageFile(editor: Editor, file: File) {
  const reader = new FileReader();
  reader.onload = () => {
    if (typeof reader.result === "string") {
      editor.chain().focus().setImage({ src: reader.result }).run();
    }
  };
  reader.readAsDataURL(file);
}

const DocsEditor: React.FC<DocsEditorProps> = ({
  extensions: extensionsProp,
  content,
  placeholder = "Start writing…",
  theme,
  onChange,
  onReady,
  editable = true,
  toolbar,
  slashMenuItems,
  showCharacterCount = false,
  spellCheck = true,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEditorStyles(theme);

  const resolvedExtensions = useMemo(
    () =>
      extensionsProp ??
      getDefaultExtensions({ theme, placeholder, slashMenuItems }),
    [extensionsProp, theme, placeholder, slashMenuItems]
  );

  const editor = useEditor({
    extensions: resolvedExtensions,
    content,
    editable,
    editorProps: {
      attributes: {
        spellcheck: spellCheck ? "true" : "false",
        autocorrect: spellCheck ? "on" : "off",
        autocapitalize: spellCheck ? "on" : "off",
      },
    },
    onUpdate({ editor: e }) {
      onChange(e.getHTML());
    },
    onCreate({ editor: e }) {
      onReady?.(e);
    },
    immediatelyRender: false,
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editor) handleImageFile(editor, file);
      e.target.value = "";
    },
    [editor]
  );

  if (!editor) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        position: "relative",
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {editable && (
        <TopToolbar
          editor={editor}
          theme={theme}
          fileInputRef={fileInputRef}
          {...(toolbar ? { toolbarConfig: toolbar } : {})}
        />
      )}

      <BubbleToolbar editor={editor} theme={theme} />

      <ImageBubbleMenu editor={editor} theme={theme} />

      {editable && (
        <DragHandle
          editor={editor}
          nested={{ edgeDetection: { threshold: -16 } }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 22,
              height: 26,
              cursor: "grab",
              borderRadius: `${Number(theme.shape.borderRadius) / 2}px`,
              color: theme.palette.text.disabled,
              opacity: 0.5,
              transition: "all 0.2s ease",
              "&:hover": {
                opacity: 1,
                color: theme.palette.text.secondary,
                bgcolor: alpha(theme.palette.text.primary, 0.08),
                transform: "scale(1.1)",
              },
              "&:active": {
                cursor: "grabbing",
                transform: "scale(0.95)",
              },
            }}
          >
            <DragIndicatorIcon sx={{ fontSize: 16 }} />
          </Box>
        </DragHandle>
      )}

      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          px: { xs: 2.5, sm: 5 },
          py: 3,
        }}
      >
        <EditorContent editor={editor} />
      </Box>

      {showCharacterCount && editor && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            px: 2,
            py: 0.75,
            borderTop: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.background.paper,
            flexShrink: 0,
          }}
        >
          <MuiTypography variant="caption" color="text.secondary">
            {editor.storage.characterCount.characters()} characters
          </MuiTypography>
          <MuiTypography variant="caption" color="text.secondary">
            {editor.storage.characterCount.words()} words
          </MuiTypography>
        </Box>
      )}
    </Box>
  );
};

export default DocsEditor;
