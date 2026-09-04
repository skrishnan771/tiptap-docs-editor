"use client";

import React, { useState } from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TBtn } from "./toolbar-button";
import { useAnchorPosition } from "./hooks";

/** Matches the CSS hex notations: #rgb, #rgba, #rrggbb, #rrggbbaa. */
const HEX_COLOR = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

const PRESET_COLORS = [
  "#000000", "#434343", "#666666", "#999999", "#cccccc", "#ffffff",
  "#e06c75", "#d19a66", "#e5c07b", "#98c379", "#56b6c2", "#61afef",
  "#c678dd", "#be5046",
  "#ff0000", "#ff8800", "#ffcc00", "#00cc00", "#00cccc", "#0066ff",
  "#9900ff", "#ff00ff",
];

interface ColorPickerButtonProps {
  editor: Editor;
  theme: Theme;
  mode: "text" | "highlight";
  icon: React.ReactNode;
  label: string;
}

export const ColorPickerButton: React.FC<ColorPickerButtonProps> = ({
  editor,
  theme,
  mode,
  icon,
  label,
}) => {
  const { open: openPopover, close: closePopover, popoverProps } = useAnchorPosition();
  const [customColor, setCustomColor] = useState("#000000");

  const currentColor =
    mode === "text"
      ? (editor.getAttributes("textStyle").color as string | undefined)
      : (editor.getAttributes("highlight").color as string | undefined);

  const applyColor = (color: string) => {
    if (mode === "text") {
      editor.chain().focus().setColor(color).run();
    } else {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
    closePopover();
  };

  const removeColor = () => {
    if (mode === "text") {
      editor.chain().focus().unsetColor().run();
    } else {
      editor.chain().focus().unsetHighlight().run();
    }
    closePopover();
  };

  return (
    <>
      <TBtn
        label={label}
        action="custom"
        editor={editor}
        theme={theme}
        onCustomAction={(e) => openPopover(e.currentTarget)}
        sx={{ color: currentColor || theme.palette.text.secondary }}
      >
        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
          {icon}
          <Box
            sx={{
              position: "absolute",
              bottom: -2,
              left: 2,
              right: 2,
              height: 3,
              borderRadius: 1,
              bgcolor: currentColor || theme.palette.text.secondary,
            }}
          />
        </Box>
      </TBtn>

      <Popover
        {...popoverProps}
        slotProps={{ paper: { sx: { p: 1.5, width: 220, maxWidth: "calc(100vw - 24px)" } } }}
      >
        <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
          {label}
        </Typography>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
          {PRESET_COLORS.map((color) => (
            <Box
              key={color}
              onMouseDown={(e) => {
                e.preventDefault();
                applyColor(color);
              }}
              sx={{
                width: 22,
                height: 22,
                borderRadius: "4px",
                bgcolor: color,
                border: `1px solid ${alpha(theme.palette.text.primary, 0.2)}`,
                cursor: "pointer",
                outline: currentColor === color ? `2px solid ${theme.palette.secondary.main}` : "none",
                outlineOffset: 1,
                "&:hover": { transform: "scale(1.15)" },
                transition: "transform 0.1s",
              }}
            />
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 0.5, alignItems: "center", mb: 0.5 }}>
          <TextField
            size="small"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            placeholder="#hex"
            slotProps={{ htmlInput: { sx: { py: 0.5, px: 1, fontSize: "0.75rem" } } }}
            sx={{ flex: 1 }}
          />
          <Button
            size="small"
            variant="contained"
            onMouseDown={(e) => {
              e.preventDefault();
              if (HEX_COLOR.test(customColor)) {
                applyColor(customColor);
              }
            }}
            sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: "0.7rem" }}
          >
            Apply
          </Button>
        </Box>

        <Button
          size="small"
          fullWidth
          onMouseDown={(e) => {
            e.preventDefault();
            removeColor();
          }}
          sx={{ fontSize: "0.7rem", py: 0.25 }}
        >
          Remove {mode === "text" ? "color" : "highlight"}
        </Button>
      </Popover>
    </>
  );
};
