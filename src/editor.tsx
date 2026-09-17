"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import DragHandle from "@tiptap/extension-drag-handle-react";

import Box from "@mui/material/Box";
import MuiTypography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import type { Theme } from "@mui/material/styles";
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
      className="notion-editor-footer"
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
    [extensionsProp, theme, placeholder, slashMenuItems],
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

  // The drag handle reports which block the pointer is over; "add block"
  // inserts after *that* block rather than wherever the caret happens to be.
  const hoveredPosRef = useRef(-1);

  const addBlockBelow = useCallback(() => {
    if (!editor) return;
    const pos = hoveredPosRef.current;
    const node = pos >= 0 ? editor.state.doc.nodeAt(pos) : null;
    const insertAt = node ? pos + node.nodeSize : editor.state.selection.to;
    editor
      .chain()
      .focus()
      .insertContentAt(insertAt, { type: "paragraph" })
      .run();
  }, [editor]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && editor) insertImageFromFile(editor, file);
      e.target.value = "";
    },
    [editor],
  );

  if (!editor) return null;

  return (
    <Box className="notion-editor-wrapper">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {editable && toolbar !== false && (
        <TopToolbar
          editor={editor}
          theme={theme}
          fileInputRef={fileInputRef}
          {...(toolbar ? { toolbarConfig: toolbar } : {})}
        />
      )}

      <BubbleToolbar editor={editor} theme={theme} />
      <ImageBubbleMenu editor={editor} theme={theme} />

      {/* Left-gutter block affordances */}
      {editable && (
        <DragHandle
          editor={editor}
          nested={{ edgeDetection: { threshold: -16 } }}
          onNodeChange={({ pos }) => {
            hoveredPosRef.current = pos;
          }}
        >
          <Box className="notion-drag-handle">
            <Tooltip title="Add block below" arrow placement="top">
              <Box
                component="button"
                type="button"
                aria-label="Add block below"
                className="notion-gutter-btn"
                onMouseDown={(e) => {
                  e.preventDefault();
                  addBlockBelow();
                }}
                sx={{
                  width: 24,
                  height: 24,
                  p: 0,
                  border: 0,
                  bgcolor: "transparent",
                }}
              >
                <AddIcon sx={{ fontSize: 17 }} />
              </Box>
            </Tooltip>
            <Box
              className="notion-gutter-btn"
              aria-label="Drag to move block"
              sx={{
                width: 18,
                height: 24,
                cursor: "grab",
                "&:active": { cursor: "grabbing" },
              }}
            >
              <DragIndicatorIcon sx={{ fontSize: 17 }} />
            </Box>
          </Box>
        </DragHandle>
      )}

      {/* Content area */}
      <Box className="notion-editor-layout">
        <Box className="notion-editor-content">
          <Box className="notion-editor-page">
            <EditorContent editor={editor} />
          </Box>
        </Box>
      </Box>

      {showCharacterCount && (
        <CharacterCountBar editor={editor} theme={theme} />
      )}
    </Box>
  );
};

export default DocsEditor;
