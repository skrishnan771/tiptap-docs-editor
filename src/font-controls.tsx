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

const SELECT_SX = {
  fontSize: "0.75rem",
  height: 30,
  "& .MuiSelect-select": { py: 0.25, px: 1 },
};

const ITEM_SX = { fontSize: "0.75rem" };

interface FontControlsProps {
  editor: Editor;
}

export const FontFamilySelect: React.FC<FontControlsProps> = ({ editor }) => {
  const current =
    (editor.getAttributes("textStyle").fontFamily as string) ?? "";
  // A document can carry a family we don't offer; listing it keeps the Select
  // from rendering an out-of-range value.
  const options = FONT_FAMILIES.some((f) => f.value === current)
    ? FONT_FAMILIES
    : [...FONT_FAMILIES, { label: "Custom", value: current }];

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
        sx={SELECT_SX}
      >
        {options.map((f) => (
          <MenuItem key={f.value} value={f.value} sx={ITEM_SX}>
            {f.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export const FontSizeSelect: React.FC<FontControlsProps> = ({ editor }) => {
  const currentSize =
    (editor.getAttributes("textStyle").fontSize as string) ?? "16";
  const current = String(parseInt(currentSize, 10) || 16);
  const options = FONT_SIZES.includes(current)
    ? FONT_SIZES
    : [...FONT_SIZES, current].sort((a, b) => Number(a) - Number(b));

  return (
    <FormControl size="small" sx={{ minWidth: 60 }}>
      <Select
        value={current}
        onChange={(e) => {
          editor.chain().focus().setFontSize(`${e.target.value}px`).run();
        }}
        sx={SELECT_SX}
      >
        {options.map((s) => (
          <MenuItem key={s} value={s} sx={ITEM_SX}>
            {s}px
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
