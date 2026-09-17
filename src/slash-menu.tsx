"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Extension } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions, type SuggestionProps } from "@tiptap/suggestion";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { alpha } from "@mui/material/styles";

import TextFieldsIcon from "@mui/icons-material/TextFields";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DataObjectIcon from "@mui/icons-material/DataObject";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import TableChartIcon from "@mui/icons-material/TableChart";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import type { CustomSlashItem } from "./types";
import { floatingPaperSx, insertImageFromFile } from "./utils";

type SlashItem = CustomSlashItem;

const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Text",
    description: "Plain paragraph text",
    category: "Basic",
    icon: <TextFieldsIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    category: "Basic",
    icon: <TitleIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    category: "Basic",
    icon: <TitleIcon fontSize="small" sx={{ fontSize: 18 }} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    category: "Basic",
    icon: <TitleIcon fontSize="small" sx={{ fontSize: 16 }} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Unordered list with bullets",
    category: "Lists",
    icon: <FormatListBulletedIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Ordered numbered list",
    category: "Lists",
    icon: <FormatListNumberedIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Task List",
    description: "List with checkboxes",
    category: "Lists",
    icon: <ChecklistIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Toggle List",
    description: "Collapsible content block",
    category: "Lists",
    icon: <ArrowRightIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setDetails().run();
    },
  },
  {
    title: "Blockquote",
    description: "Indented quote block",
    category: "Blocks",
    icon: <FormatQuoteIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Syntax-highlighted code",
    category: "Blocks",
    icon: <DataObjectIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
  },
  {
    title: "Callout",
    description: "Info callout block",
    category: "Blocks",
    icon: <InfoOutlinedIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setBlockquote()
        .insertContent("ℹ️ ")
        .run();
    },
  },
  {
    title: "Warning",
    description: "Warning callout block",
    category: "Blocks",
    icon: <WarningAmberIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setBlockquote()
        .insertContent("⚠️ ")
        .run();
    },
  },
  {
    title: "Divider",
    description: "Horizontal separator line",
    category: "Inserts",
    icon: <HorizontalRuleIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "Image",
    description: "Upload an image from your device",
    category: "Inserts",
    icon: <ImageOutlinedIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = () => {
        const file = input.files?.[0];
        if (file) insertImageFromFile(editor, file);
      };
      input.click();
    },
  },
  {
    title: "Table",
    description: "Insert a table",
    category: "Inserts",
    icon: <TableChartIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    },
  },
  {
    title: "YouTube",
    description: "Embed a YouTube video",
    category: "Embeds",
    icon: <YouTubeIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const url = window.prompt("YouTube video URL:");
      if (url) {
        editor.chain().focus().setYoutubeVideo({ src: url }).run();
      }
    },
  },
];

/** Kept in sync with the positioner's clipping maths below. */
const MENU_WIDTH = 320;

interface SlashMenuRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

const SlashMenuComponent = forwardRef<
  SlashMenuRef,
  SuggestionProps<SlashItem>
>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const items = props.items;

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      if (item) {
        props.command(item);
      }
    },
    [items, props]
  );

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (items.length === 0) return false;
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        selectItem(selectedIndex);
        return true;
      }
      return false;
    },
  }));

  useLayoutEffect(() => {
    const el = listRef.current?.children[selectedIndex] as
      | HTMLElement
      | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (items.length === 0) return null;

  // Group consecutive items sharing a category, keeping the flat index for
  // keyboard selection.
  const grouped: { category: string; items: { item: SlashItem; globalIndex: number }[] }[] = [];
  items.forEach((item, index) => {
    const category = item.category ?? "";
    let group = grouped[grouped.length - 1];
    if (!group || group.category !== category) {
      group = { category, items: [] };
      grouped.push(group);
    }
    group.items.push({ item, globalIndex: index });
  });

  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        ...floatingPaperSx(theme),
        width: MENU_WIDTH,
        maxHeight: 340,
        overflowY: "auto",
        overscrollBehavior: "contain",
        py: 0.75,
      })}
    >
      <List dense disablePadding ref={listRef}>
        {grouped.map((group) => (
          <React.Fragment key={group.category || "_none"}>
            {group.category && (
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{
                  display: "block",
                  px: 1.75,
                  pt: 1,
                  pb: 0.5,
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  fontSize: "0.6875rem",
                  lineHeight: 1.2,
                }}
              >
                {group.category}
              </Typography>
            )}
            {group.items.map(({ item, globalIndex }) => (
              <ListItemButton
                key={item.title}
                selected={globalIndex === selectedIndex}
                onClick={() => selectItem(globalIndex)}
                sx={(theme) => ({
                  px: 1,
                  py: 0.5,
                  mx: 0.75,
                  gap: 1.25,
                  borderRadius: `${Math.min(Number(theme.shape.borderRadius), 4)}px`,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    bgcolor: alpha(theme.palette.text.primary, 0.06),
                  },
                })}
              >
                {/* Notion previews each block type in a small bordered tile. */}
                <ListItemIcon
                  sx={(theme) => ({
                    minWidth: 0,
                    width: 28,
                    height: 28,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: `${Math.min(Number(theme.shape.borderRadius), 4)}px`,
                    border: `1px solid ${theme.palette.divider}`,
                    color: theme.palette.text.secondary,
                    "& .MuiSvgIcon-root": { fontSize: 17 },
                  })}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  secondary={item.description}
                  sx={{ my: 0 }}
                  slotProps={{
                    primary: {
                      variant: "body2",
                      fontWeight: 500,
                      noWrap: true,
                      sx: { lineHeight: 1.35 },
                    },
                    secondary: {
                      variant: "caption",
                      color: "text.disabled",
                      noWrap: true,
                      sx: { display: "block", lineHeight: 1.3 },
                    },
                  }}
                />
              </ListItemButton>
            ))}
          </React.Fragment>
        ))}
      </List>
      <Box
        sx={(theme) => ({
          mt: 0.75,
          pt: 0.75,
          px: 1.75,
          borderTop: `1px solid ${theme.palette.divider}`,
        })}
      >
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ display: "block", fontSize: "0.6875rem" }}
        >
          ↑↓ to navigate · ↵ to select · esc to dismiss
        </Typography>
      </Box>
    </Paper>
  );
});

SlashMenuComponent.displayName = "SlashMenuComponent";

export interface SlashCommandsOptions {
  suggestion: Omit<SuggestionOptions<SlashItem>, "editor"> & {
    /** Extra items appended to the built-in ones. */
    customItems?: SlashItem[];
  };
}

function filterSlashItems(items: SlashItem[], query: string): SlashItem[] {
  const q = query.toLowerCase();
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
  );
}

const suggestionConfig: SlashCommandsOptions["suggestion"] = {
  char: "/",
  command: ({ editor, range, props: item }) => {
    item.command({ editor, range });
  },
  render: () => {
    let component: ReactRenderer<SlashMenuRef> | null = null;
    let popup: HTMLDivElement | null = null;

    // Escape tears the menu down while the suggestion plugin stays active, so
    // the handles have to be cleared or a later onUpdate/onExit would touch a
    // destroyed renderer.
    const teardown = () => {
      popup?.remove();
      component?.destroy();
      popup = null;
      component = null;
    };

    return {
      onStart: (props) => {
        component = new ReactRenderer(SlashMenuComponent, {
          props,
          editor: props.editor,
        });

        popup = document.createElement("div");
        popup.style.position = "absolute";
        popup.style.zIndex = "9999";
        document.body.appendChild(popup);

        popup.appendChild(component.element);
        updatePosition(props, popup);
      },

      onUpdate: (props) => {
        if (!component || !popup) return;
        component.updateProps(props);
        updatePosition(props, popup);
      },

      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          teardown();
          return true;
        }
        return component?.ref?.onKeyDown(props) ?? false;
      },

      onExit: teardown,
    };
  },
};

function updatePosition(
  props: SuggestionProps<SlashItem>,
  popup: HTMLDivElement
) {
  const rect = props.clientRect?.();
  if (!rect) return;
  const popupWidth = MENU_WIDTH;
  const margin = 12;
  let left = rect.left + window.scrollX;
  // Prevent clipping off the right edge on narrow screens
  if (left + popupWidth + margin > window.innerWidth) {
    left = Math.max(margin, window.innerWidth - popupWidth - margin);
  }
  popup.style.left = `${left}px`;
  popup.style.top = `${rect.bottom + window.scrollY + 4}px`;
}

export const SlashCommands = Extension.create<SlashCommandsOptions>({
  name: "slashCommands",

  addOptions() {
    return { suggestion: suggestionConfig };
  },

  addProseMirrorPlugins() {
    const { customItems, items, ...suggestion } = this.options.suggestion;
    const allItems = customItems?.length
      ? [...SLASH_ITEMS, ...customItems]
      : SLASH_ITEMS;

    return [
      Suggestion({
        editor: this.editor,
        ...suggestion,
        items: items ?? (({ query }) => filterSlashItems(allItems, query)),
      }),
    ];
  },
});
