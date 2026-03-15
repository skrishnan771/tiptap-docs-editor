"use client";

import React, { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import LinkIcon from "@mui/icons-material/Link";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import { alpha } from "@mui/material/styles";
import { isActive } from "./toolbar-button";

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
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [url, setUrl] = useState("");
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const active = isActive(editor, "link");
  const accent = theme.palette.secondary.main;

  const open = useCallback(
    (el: HTMLElement) => {
      const existing = editor.getAttributes("link").href as string | undefined;
      const target = editor.getAttributes("link").target as string | undefined;
      setUrl(existing ?? "https://");
      setOpenInNewTab(target === "_blank");
      setAnchorEl(el);
    },
    [editor]
  );

  const applyLink = useCallback(() => {
    if (!url) {
      editor.chain().focus().unsetLink().run();
    } else {
      editor
        .chain()
        .focus()
        .setLink({ href: url, target: openInNewTab ? "_blank" : null })
        .run();
    }
    setAnchorEl(null);
  }, [editor, url, openInNewTab]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    setAnchorEl(null);
  }, [editor]);

  return (
    <>
      <Tooltip title="Link" arrow placement="top">
        <span>
          <IconButton
            size="small"
            onMouseDown={(e) => {
              e.preventDefault();
              if (active) {
                removeLink();
              } else {
                open(e.currentTarget);
              }
            }}
            style={{
              color: active ? accent : theme.palette.text.secondary,
              backgroundColor: active ? alpha(accent, 0.12) : "transparent",
            }}
            sx={{
              borderRadius: `${theme.shape.borderRadius}px`,
              transition: theme.transitions.create(["background-color", "color"], {
                duration: theme.transitions.duration.shorter,
              }),
              "&:hover": {
                bgcolor: active ? alpha(accent, 0.2) : theme.palette.action.hover,
                color: active ? accent : theme.palette.text.primary,
              },
            }}
          >
            {active ? (
              <LinkOffIcon sx={{ fontSize: iconSize }} />
            ) : (
              <LinkIcon sx={{ fontSize: iconSize }} />
            )}
          </IconButton>
        </span>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { p: 2, width: 320 } } }}
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
