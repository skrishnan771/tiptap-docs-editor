"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import DragHandle from "@tiptap/extension-drag-handle-react";

import Box from "@mui/material/Box";
import MuiTypography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { alpha, type Theme } from "@mui/material/styles";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";

import type { DocsEditorProps } from "./types";
import { useEditorState, useEditorStyles } from "./hooks";
import { insertImageFromFile } from "./utils";
import { TopToolbar } from "./top-toolbar";
import { BubbleToolbar } from "./bubble-toolbar";
import { ImageBubbleMenu } from "./image-bubble-menu";
import { getDefaultExtensions } from "./extensions";

const CharacterCountBar: React.FC<{ editor: Editor; theme: Theme }> = ({
  editor,
  theme,
}) => {
  useEditorState(editor);

  // `Storage.characterCount` is declared non-optional by the extension's module
  // augmentation, so the type gives no warning when a caller supplies its own
  // `extensions` without CharacterCount — only this check prevents the throw.
  const counter = editor.storage.characterCount;
  if (!counter) return null;

  return (
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
        {counter.characters()} characters
      </MuiTypography>
      <MuiTypography variant="caption" color="text.secondary">
        {counter.words()} words
      </MuiTypography>
    </Box>
  );
};

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

  // Tiptap binds the option callbacks once, in the Editor constructor, and
  // `setOptions` never re-registers them — so reading them through a ref is
  // what keeps a re-created `onChange`/`onReady` from being ignored.
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEditorStyles(theme);

  const resolvedExtensions = useMemo(
    () =>
      extensionsProp ??
      getDefaultExtensions({
        theme,
        placeholder,
        slashMenuItems,
      }),
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
      onChangeRef.current(e.getHTML());
    },
    onCreate({ editor: e }) {
      onReadyRef.current?.(e);
    },
    immediatelyRender: false,
  });

  // `useEditor` re-applies options with the editor's *current* editable state,
  // so a changed `editable` prop has to be pushed in explicitly. Suppress the
  // update event it would otherwise emit, which would fire a spurious onChange.
  useEffect(() => {
    if (editor && editor.isEditable !== editable) {
      editor.setEditable(editable, false);
    }
  }, [editor, editable]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editor) insertImageFromFile(editor, file);
      e.target.value = "";
    },
    [editor]
  );

  if (!editor) return null;

  const brHalf = `${Number(theme.shape.borderRadius) / 2}px`;

  return (
    <Box className="notion-editor-wrapper">
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

      {/* Drag handle with optional add block button */}
      {editable && (
        <DragHandle
          editor={editor}
          nested={{ edgeDetection: { threshold: -16 } }}
        >
          <Box className="notion-drag-handle">
            <Tooltip title="Add block">
              <IconButton
                size="small"
                onClick={() => {
                  const { to } = editor.state.selection;
                  editor
                    .chain()
                    .focus()
                    .insertContentAt(to, { type: "paragraph" })
                    .run();
                }}
                sx={{
                  width: 20,
                  height: 20,
                  color: theme.palette.text.disabled,
                  opacity: 0.5,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    opacity: 1,
                    color: theme.palette.text.secondary,
                    bgcolor: alpha(theme.palette.text.primary, 0.08),
                  },
                }}
              >
                <AddIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 20,
                height: 24,
                cursor: "grab",
                borderRadius: brHalf,
                color: theme.palette.text.disabled,
                opacity: 0.5,
                transition: "all 0.2s ease",
                "&:hover": {
                  opacity: 1,
                  color: theme.palette.text.secondary,
                  bgcolor: alpha(theme.palette.text.primary, 0.08),
                },
                "&:active": {
                  cursor: "grabbing",
                },
              }}
            >
              <DragIndicatorIcon sx={{ fontSize: 16 }} />
            </Box>
          </Box>
        </DragHandle>
      )}

      {/* Content area */}
      <Box className="notion-editor-layout">
        <Box className="notion-editor-content">
          <EditorContent editor={editor} />
        </Box>
      </Box>

      {showCharacterCount && <CharacterCountBar editor={editor} theme={theme} />}
    </Box>
  );
};

export default DocsEditor;
