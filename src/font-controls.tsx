"use client";

import React from "react";
import type { Editor } from "@tiptap/react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

const FONT_FAMILIES = [
  { label: "Default", value: "" },
  { label: "Sans Serif", value: "Inter, Helvetica, Arial, sans-serif" },
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Monospace", value: "'Cascadia Mono', 'Roboto Mono', monospace" },
  { label: "System UI", value: "system-ui, -apple-system, sans-serif" },
];

const FONT_SIZES = ["12", "14", "16", "18", "20", "24", "28", "32", "36", "48"];

interface FontControlsProps {
  editor: Editor;
}

export const FontFamilySelect: React.FC<FontControlsProps> = ({ editor }) => {
  const current = (editor.getAttributes("textStyle").fontFamily as string) ?? "";

  return (
    <FormControl size="small" sx={{ minWidth: 100 }}>
      <Select
        value={current}
        displayEmpty
        onChange={(e) => {
          const val = e.target.value;
          if (val) {
            editor.chain().focus().setFontFamily(val).run();
          } else {
            editor.chain().focus().unsetFontFamily().run();
          }
        }}
        sx={{
          fontSize: "0.75rem",
          height: 30,
          "& .MuiSelect-select": { py: 0.25, px: 1 },
        }}
      >
        {FONT_FAMILIES.map((f) => (
          <MenuItem key={f.value} value={f.value} sx={{ fontSize: "0.75rem" }}>
            {f.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const FontSizeSelect: React.FC<FontControlsProps> = ({ editor }) => {
  const currentAttrs = editor.getAttributes("textStyle");
  const currentSize = (currentAttrs.fontSize as string) ?? "16";
  const sizeNum = parseInt(currentSize, 10) || 16;

  return (
    <FormControl size="small" sx={{ minWidth: 60 }}>
      <Select
        value={String(sizeNum)}
        onChange={(e) => {
          const size = e.target.value;
          editor.chain().focus().setFontSize(`${size}px`).run();
        }}
        sx={{
          fontSize: "0.75rem",
          height: 30,
          "& .MuiSelect-select": { py: 0.25, px: 1 },
        }}
      >
        {FONT_SIZES.map((s) => (
          <MenuItem key={s} value={s} sx={{ fontSize: "0.75rem" }}>
            {s}px
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
