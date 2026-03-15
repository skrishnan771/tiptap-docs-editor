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
import { Extension, type Editor, type Range } from "@tiptap/core";
import { ReactRenderer } from "@tiptap/react";
import Suggestion, { type SuggestionOptions, type SuggestionProps } from "@tiptap/suggestion";

import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import TextFieldsIcon from "@mui/icons-material/TextFields";
import TitleIcon from "@mui/icons-material/Title";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DataObjectIcon from "@mui/icons-material/DataObject";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

export interface SlashItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: (props: { editor: Editor; range: Range }) => void;
}

const SLASH_ITEMS: SlashItem[] = [
  {
    title: "Text",
    description: "Plain paragraph text",
    icon: <TextFieldsIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: "Heading 1",
    description: "Large section heading",
    icon: <TitleIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
    },
  },
  {
    title: "Heading 2",
    description: "Medium section heading",
    icon: <TitleIcon fontSize="small" sx={{ fontSize: 18 }} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 2 }).run();
    },
  },
  {
    title: "Heading 3",
    description: "Small section heading",
    icon: <TitleIcon fontSize="small" sx={{ fontSize: 16 }} />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHeading({ level: 3 }).run();
    },
  },
  {
    title: "Bullet List",
    description: "Unordered list with bullets",
    icon: <FormatListBulletedIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Numbered List",
    description: "Ordered numbered list",
    icon: <FormatListNumberedIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: "Task List",
    description: "List with checkboxes",
    icon: <ChecklistIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: "Blockquote",
    description: "Indented quote block",
    icon: <FormatQuoteIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setBlockquote().run();
    },
  },
  {
    title: "Code Block",
    description: "Syntax-highlighted code",
    icon: <DataObjectIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setCodeBlock().run();
    },
  },
  {
    title: "Divider",
    description: "Horizontal separator line",
    icon: <HorizontalRuleIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: "Image",
    description: "Embed an image from URL",
    icon: <ImageOutlinedIcon fontSize="small" />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      const url = window.prompt("Image URL:");
      if (url) {
        editor
          .chain()
          .focus()
          .insertContent({ type: "image", attrs: { src: url } })
          .run();
      }
    },
  },
];

export interface SlashMenuRef {
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

  return (
    <Paper
      elevation={8}
      sx={{
        width: 280,
        maxHeight: 320,
        overflowY: "auto",
        py: 0.5,
        borderRadius: 2,
      }}
    >
      <List dense disablePadding ref={listRef}>
        {items.map((item, index) => (
          <ListItemButton
            key={item.title}
            selected={index === selectedIndex}
            onClick={() => selectItem(index)}
            sx={{ px: 1.5, py: 0.5, borderRadius: 1, mx: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 32, color: "text.secondary" }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.title}
              secondary={item.description}
              primaryTypographyProps={{ variant: "body2", fontWeight: 500 }}
              secondaryTypographyProps={{
                variant: "caption",
                color: "text.disabled",
              }}
            />
          </ListItemButton>
        ))}
      </List>
      <Typography
        variant="caption"
        color="text.disabled"
        sx={{ display: "block", textAlign: "center", py: 0.5 }}
      >
        Type to filter · ↑↓ navigate · Enter select
      </Typography>
    </Paper>
  );
});

SlashMenuComponent.displayName = "SlashMenuComponent";

const suggestionConfig: Omit<SuggestionOptions<SlashItem>, "editor"> = {
  char: "/",
  items: ({ query }) => {
    const q = query.toLowerCase();
    return SLASH_ITEMS.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  },
  command: ({ editor, range, props: item }) => {
    item.command({ editor, range });
  },
  render: () => {
    let component: ReactRenderer<SlashMenuRef> | null = null;
    let popup: HTMLDivElement | null = null;

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
        component?.updateProps(props);
        if (popup) updatePosition(props, popup);
      },

      onKeyDown: (props) => {
        if (props.event.key === "Escape") {
          popup?.remove();
          component?.destroy();
          return true;
        }
        return component?.ref?.onKeyDown(props) ?? false;
      },

      onExit: () => {
        popup?.remove();
        component?.destroy();
      },
    };
  },
};

function updatePosition(
  props: SuggestionProps<SlashItem>,
  popup: HTMLDivElement
) {
  const rect = props.clientRect?.();
  if (!rect) return;
  popup.style.left = `${rect.left + window.scrollX}px`;
  popup.style.top = `${rect.bottom + window.scrollY + 4}px`;
}

export const SlashCommands = Extension.create({
  name: "slashCommands",

  addOptions() {
    return { suggestion: suggestionConfig };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});
