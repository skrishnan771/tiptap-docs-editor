"use client";

import React, { useState } from "react";
import type { Editor } from "@tiptap/react";
import type { ChainedCommands } from "@tiptap/core";
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import CallSplitIcon from "@mui/icons-material/CallSplit";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { TBtn } from "./toolbar-button";
import { useAnchorPosition } from "./hooks";

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

/**
 * Declared at module scope: a component defined inside `TableMenu` would be a
 * fresh type on every render, remounting every button whenever the toolbar
 * re-renders (which it does on each editor transaction).
 */
const TableOpBtn: React.FC<{
  label: string;
  theme: Theme;
  danger?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ label, theme, danger = false, onClick, children }) => {
  const idle = danger ? theme.palette.error.main : theme.palette.text.secondary;
  const hover = danger ? theme.palette.error.main : theme.palette.secondary.main;

  return (
    <Tooltip title={label} arrow placement="top">
      <span>
        <IconButton
          size="small"
          onMouseDown={(e) => { e.preventDefault(); onClick(); }}
          sx={{
            borderRadius: `${theme.shape.borderRadius}px`,
            color: idle,
            "&:hover": { bgcolor: theme.palette.action.hover, color: hover },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

interface TableOp {
  label: string;
  icon: React.ReactNode;
  run: (chain: ChainedCommands) => ChainedCommands;
  danger?: boolean;
}

const TABLE_OP_ROWS: TableOp[][] = [
  [
    { label: "Add column before", icon: <ViewColumnIcon fontSize="small" />, run: (c) => c.addColumnBefore() },
    { label: "Add column after", icon: <AddIcon fontSize="small" />, run: (c) => c.addColumnAfter() },
    { label: "Delete column", icon: <RemoveIcon fontSize="small" />, run: (c) => c.deleteColumn() },
  ],
  [
    { label: "Add row before", icon: <TableRowsIcon fontSize="small" />, run: (c) => c.addRowBefore() },
    { label: "Add row after", icon: <AddIcon fontSize="small" />, run: (c) => c.addRowAfter() },
    { label: "Delete row", icon: <RemoveIcon fontSize="small" />, run: (c) => c.deleteRow() },
  ],
  [
    { label: "Merge cells", icon: <MergeTypeIcon fontSize="small" />, run: (c) => c.mergeCells() },
    { label: "Split cell", icon: <CallSplitIcon fontSize="small" />, run: (c) => c.splitCell() },
    { label: "Delete table", icon: <DeleteOutlineIcon fontSize="small" />, run: (c) => c.deleteTable(), danger: true },
  ],
];

export const TableMenu: React.FC<TableMenuProps> = ({ editor, theme }) => {
  const { open: openPopover, close: closePopover, popoverProps } = useAnchorPosition();
  const isInTable = editor.isActive("table");

  const insertTable = (rows: number, cols: number) => {
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    closePopover();
  };

  const runOp = (op: TableOp) => {
    op.run(editor.chain().focus()).run();
    closePopover();
  };

  return (
    <>
      <TBtn
        label="Table"
        action="table"
        editor={editor}
        theme={theme}
        onCustomAction={(e) => openPopover(e.currentTarget)}
      >
        <TableChartIcon fontSize="small" />
      </TBtn>

      <Popover
        {...popoverProps}
        slotProps={{ paper: { sx: { p: 0.5, maxWidth: "calc(100vw - 24px)" } } }}
      >
        {!isInTable ? (
          <GridPicker theme={theme} onSelect={insertTable} />
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, p: 1, minWidth: 180 }}>
            <Typography variant="caption" color="text.secondary">
              Table operations
            </Typography>

            {TABLE_OP_ROWS.map((row, rowIndex) => (
              <React.Fragment key={row[0]?.label ?? rowIndex}>
                {rowIndex > 0 && <Divider />}
                <Box sx={{ display: "flex", gap: 0.25 }}>
                  {row.map((op) => (
                    <TableOpBtn
                      key={op.label}
                      label={op.label}
                      theme={theme}
                      onClick={() => runOp(op)}
                      {...(op.danger ? { danger: true } : {})}
                    >
                      {op.icon}
                    </TableOpBtn>
                  ))}
                </Box>
              </React.Fragment>
            ))}
          </Box>
        )}
      </Popover>
    </>
  );
};
