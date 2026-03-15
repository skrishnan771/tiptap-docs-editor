"use client";

import React, { useState } from "react";
import type { Editor } from "@tiptap/react";
import type { Theme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

import TableChartIcon from "@mui/icons-material/TableChart";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import TableRowsIcon from "@mui/icons-material/TableRows";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface TableMenuProps {
  editor: Editor;
  theme: Theme;
}

const GridPicker: React.FC<{
  onSelect: (rows: number, cols: number) => void;
  theme: Theme;
}> = ({ onSelect, theme }) => {
  const [hoverRow, setHoverRow] = useState(0);
  const [hoverCol, setHoverCol] = useState(0);
  const maxRows = 6;
  const maxCols = 6;

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: "block" }}>
        {hoverRow > 0 ? `${hoverRow} × ${hoverCol}` : "Select table size"}
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: `repeat(${maxCols}, 1fr)`, gap: "3px" }}>
        {Array.from({ length: maxRows * maxCols }).map((_, i) => {
          const r = Math.floor(i / maxCols) + 1;
          const c = (i % maxCols) + 1;
          const highlighted = r <= hoverRow && c <= hoverCol;
          return (
            <Box
              key={i}
              onMouseEnter={() => { setHoverRow(r); setHoverCol(c); }}
              onMouseDown={(e) => { e.preventDefault(); onSelect(r, c); }}
              sx={{
                width: 20,
                height: 20,
                borderRadius: "3px",
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: highlighted
                  ? alpha(theme.palette.secondary.main, 0.3)
                  : theme.palette.background.default,
                cursor: "pointer",
                transition: "background-color 0.1s",
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export const TableMenu: React.FC<TableMenuProps> = ({ editor, theme }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const isInTable = editor.isActive("table");
  const accent = theme.palette.secondary.main;

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setAnchorEl(null);
  };

  const TableOpBtn: React.FC<{
    label: string;
    onClick: () => void;
    disabled?: boolean;
    children: React.ReactNode;
  }> = ({ label, onClick, disabled = false, children }) => (
    <Tooltip title={label} arrow placement="top">
      <span>
        <IconButton
          size="small"
          disabled={disabled}
          onMouseDown={(e) => { e.preventDefault(); onClick(); }}
          sx={{
            borderRadius: `${theme.shape.borderRadius}px`,
            color: theme.palette.text.secondary,
            "&:hover": { bgcolor: theme.palette.action.hover, color: accent },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );

  return (
    <>
      <Tooltip title="Table" arrow placement="top">
        <span>
          <IconButton
            size="small"
            onMouseDown={(e) => { e.preventDefault(); setAnchorEl(e.currentTarget); }}
            style={{
              color: isInTable ? accent : theme.palette.text.secondary,
              backgroundColor: isInTable ? alpha(accent, 0.12) : "transparent",
            }}
            sx={{
              borderRadius: `${theme.shape.borderRadius}px`,
              transition: theme.transitions.create(["background-color", "color"], {
                duration: theme.transitions.duration.shorter,
              }),
              "&:hover": {
                bgcolor: isInTable ? alpha(accent, 0.2) : theme.palette.action.hover,
                color: isInTable ? accent : theme.palette.text.primary,
              },
            }}
          >
            <TableChartIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{ paper: { sx: { p: 0.5 } } }}
      >
        {!isInTable ? (
          <GridPicker theme={theme} onSelect={insertTable} />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 1, minWidth: 180 }}>
            <Typography variant="caption" color="text.secondary">
              Table operations
            </Typography>

            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TableOpBtn label="Add column before" onClick={() => { editor.chain().focus().addColumnBefore().run(); setAnchorEl(null); }}>
                <ViewColumnIcon fontSize="small" />
              </TableOpBtn>
              <TableOpBtn label="Add column after" onClick={() => { editor.chain().focus().addColumnAfter().run(); setAnchorEl(null); }}>
                <AddIcon fontSize="small" />
              </TableOpBtn>
              <TableOpBtn label="Delete column" onClick={() => { editor.chain().focus().deleteColumn().run(); setAnchorEl(null); }}>
                <RemoveIcon fontSize="small" />
              </TableOpBtn>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TableOpBtn label="Add row before" onClick={() => { editor.chain().focus().addRowBefore().run(); setAnchorEl(null); }}>
                <TableRowsIcon fontSize="small" />
              </TableOpBtn>
              <TableOpBtn label="Add row after" onClick={() => { editor.chain().focus().addRowAfter().run(); setAnchorEl(null); }}>
                <AddIcon fontSize="small" />
              </TableOpBtn>
              <TableOpBtn label="Delete row" onClick={() => { editor.chain().focus().deleteRow().run(); setAnchorEl(null); }}>
                <RemoveIcon fontSize="small" />
              </TableOpBtn>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", gap: 0.25 }}>
              <TableOpBtn label="Merge cells" onClick={() => { editor.chain().focus().mergeCells().run(); setAnchorEl(null); }}>
                <MergeTypeIcon fontSize="small" />
              </TableOpBtn>
              <TableOpBtn label="Split cell" onClick={() => { editor.chain().focus().splitCell().run(); setAnchorEl(null); }}>
                <CallSplitIcon fontSize="small" />
              </TableOpBtn>
              <TableOpBtn label="Delete table" onClick={() => { editor.chain().focus().deleteTable().run(); setAnchorEl(null); }}>
                <DeleteOutlineIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
              </TableOpBtn>
            </Box>
          </Box>
        )}
      </Popover>
    </>
  );
};
