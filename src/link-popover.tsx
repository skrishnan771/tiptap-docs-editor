"use client";

import React, { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { TBtn, isActive } from "./toolbar-button";
import { useAnchorPosition } from "./hooks";
import { floatingPaperSx } from "./utils";

interface LinkPopoverProps {
  editor: Editor;
  theme: Theme;
  iconSize?: number;
}

export const LinkPopoverButton: React.FC<LinkPopoverProps> = ({
  editor,
  theme,
  iconSize = 20,
}) => {
  const { open: openPopover, close: closePopover, popoverProps } = useAnchorPosition();
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const active = isActive(editor, "link");

  const open = useCallback(
    (el: HTMLElement) => {
      const attrs = editor.getAttributes("link");
      setUrl((attrs.href as string | undefined) ?? "https://");
      setOpenInNewTab(attrs.target === "_blank");
      openPopover(el);
    },
    [editor, openPopover]
  );

  const applyLink = useCallback(() => {
    const href = url.trim();
    if (!href) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .setLink({ href, target: openInNewTab ? "_blank" : null })
        .run();
    }
    closePopover();
  }, [editor, url, openInNewTab, closePopover]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    closePopover();
  }, [editor, closePopover]);

  return (
    <>
      <TBtn
        label="Link"
        action="link"
        editor={editor}
        theme={theme}
        onCustomAction={(e) => {
          if (active) {
            removeLink();
          } else {
            open(e.currentTarget);
          }
        }}
      >
        {active ? (
          <LinkOffIcon sx={{ fontSize: iconSize }} />
        ) : (
          <LinkIcon sx={{ fontSize: iconSize }} />
        )}
      </TBtn>

      <Popover
        {...popoverProps}
        slotProps={{
          paper: {
            elevation: 0,
            sx: { ...floatingPaperSx(theme), p: 2, width: 320 },
          },
        }}
      >
        <TextField
          size="small"
          fullWidth
          label="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              applyLink();
            }
          }}
          autoFocus
          sx={{ mb: 1 }}
        />

        <FormControlLabel
          control={
            <Checkbox
              size="small"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
            />
          }
          label="Open in new tab"
          slotProps={{ typography: { variant: "body2" } }}
          sx={{ mb: 1 }}
        />

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            size="small"
            variant="contained"
            onMouseDown={(e) => {
              e.preventDefault();
              applyLink();
            }}
            fullWidth
          >
            Apply
          </Button>
          {active && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<LinkOffIcon />}
              onMouseDown={(e) => {
                e.preventDefault();
                removeLink();
              }}
            >
              Remove
            </Button>
          )}
        </Box>
      </Popover>
    </>
  );
};
