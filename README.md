# tiptap-docs-editor

A drop-in, Notion-style rich text editor component for React — built on [Tiptap 3](https://tiptap.dev/) and [Material UI](https://mui.com/).

## Features

- **Configurable top toolbar** — undo/redo, font family & size, text formatting (bold, italic, underline, strike, code, superscript, subscript), text & highlight color pickers, headings, lists, blockquotes, code blocks, images, inline link editor, table insertion with grid picker, text alignment (left/center/right/justify), clear formatting, and print
- **Bubble menu** — floating toolbar on text selection for quick inline formatting, link editing, superscript & subscript
- **Image bubble menu** — resize (25% / 50% / 100%), align (left / center / right), and delete images on click
- **Table support** — insert tables with a visual grid picker, resize columns, add/remove rows & columns, merge/split cells
- **Slash commands** — type `/` to insert blocks, organized by category (Basic, Lists, Blocks, Inserts, Embeds), with support for custom items
- **Drag handle** — drag & drop blocks to reorder content
- **Syntax-highlighted code blocks** — powered by [lowlight](https://github.com/wooorm/lowlight) with common language support
- **Task lists** — interactive checklists with nesting support
- **Image support** — upload via file picker or paste a URL through the slash menu
- **YouTube embeds** — embed videos via slash command or programmatically
- **Typography** — smart quotes, dashes, and other typographic enhancements
- **Character & word count** — optional footer bar showing live character and word counts
- **Read-only mode** — toggle `editable` to switch between editing and viewing
- **Customizable toolbar** — show/hide toolbar sections via `ToolbarConfig`
- **Custom slash items** — inject your own slash menu entries with `slashMenuItems`
- **Theme-aware** — fully styled from your MUI theme (light & dark mode)
- **SSR-compatible** — all components are marked `"use client"`

## Installation

```bash
npm install tiptap-docs-editor
```

### Peer Dependencies

The following packages must be installed in your project:

```bash
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react react-dom
```

| Package               | Version |
| --------------------- | ------- |
| `react`               | `>=18`  |
| `react-dom`           | `>=18`  |
| `@mui/material`       | `>=6`   |
| `@mui/icons-material` | `>=6`   |
| `@emotion/react`      | `>=11`  |
| `@emotion/styled`     | `>=11`  |

## Quick Start

```tsx
import { DocsEditor } from "tiptap-docs-editor";
import { createTheme } from "@mui/material/styles";

const theme = createTheme();

function App() {
  const [content, setContent] = useState("<p>Hello world</p>");

  return (
    <DocsEditor
      content={content}
      theme={theme}
      onChange={(html) => setContent(html)}
    />
  );
}
```

## API

### `<DocsEditor />`

| Prop                 | Type                       | Required | Default            | Description                                                      |
| -------------------- | -------------------------- | -------- | ------------------ | ---------------------------------------------------------------- |
| `content`            | `string`                   | Yes      | —                  | Initial HTML content for the editor                              |
| `theme`              | `Theme`                    | Yes      | —                  | MUI theme object (from `createTheme()`)                          |
| `onChange`           | `(html: string) => void`   | Yes      | —                  | Called with the updated HTML on every edit                       |
| `placeholder`        | `string`                   | No       | `"Start writing…"` | Placeholder text shown when the editor is empty                  |
| `onReady`            | `(editor: Editor) => void` | No       | —                  | Called once with the Tiptap `Editor` instance after creation     |
| `editable`           | `boolean`                  | No       | `true`             | Whether the editor is editable or read-only                      |
| `toolbar`            | `ToolbarConfig`            | No       | all enabled        | Toggle visibility of toolbar sections                            |
| `slashMenuItems`     | `CustomSlashItem[]`        | No       | —                  | Additional custom entries for the slash command menu              |
| `showCharacterCount` | `boolean`                  | No       | `false`            | Show a character & word count footer bar                         |

### Exports

```ts
import { DocsEditor } from "tiptap-docs-editor";
import type {
  DocsEditorProps,
  ToolbarConfig,
  CustomSlashItem,
  ToolbarAction,
} from "tiptap-docs-editor";
```

| Export            | Kind      | Description                                  |
| ----------------- | --------- | -------------------------------------------- |
| `DocsEditor`      | Component | The main editor component                    |
| `DocsEditorProps` | Type      | Props interface for `DocsEditor`             |
| `ToolbarConfig`   | Type      | Configuration to show/hide toolbar sections  |
| `CustomSlashItem` | Type      | Shape of a custom slash menu item            |
| `ToolbarAction`   | Type      | Union of all built-in toolbar action names   |

### `ToolbarConfig`

Control which toolbar sections are visible. All default to `true`.

```tsx
<DocsEditor
  content={content}
  theme={theme}
  onChange={setContent}
  toolbar={{
    history: true,        // Undo / Redo
    fontControls: true,   // Font family & size dropdowns
    formatting: true,     // Bold, italic, underline, strike, code, superscript, subscript
    colorControls: true,  // Text color & highlight color pickers
    headings: true,       // H1, H2, H3
    lists: true,          // Bullet, numbered, task lists
    inserts: true,        // Blockquote, horizontal rule, code block, image, link
    table: true,          // Table grid picker & operations
    alignment: true,      // Left, center, right, justify
    superSubScript: true, // Superscript & subscript (within formatting section)
    clearFormatting: true, // Clear all marks
    print: true,          // Print button
  }}
/>
```

### `CustomSlashItem`

Add your own entries to the slash command menu:

```tsx
import type { CustomSlashItem } from "tiptap-docs-editor";

const myItems: CustomSlashItem[] = [
  {
    title: "Custom Block",
    description: "Insert a custom block",
    category: "Custom",
    icon: <MyIcon />,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).insertContent("<p>Custom!</p>").run();
    },
  },
];

<DocsEditor
  content={content}
  theme={theme}
  onChange={setContent}
  slashMenuItems={myItems}
/>
```

### `ToolbarAction`

All available actions that the toolbars support:

| Category        | Actions                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------- |
| Text formatting | `bold`, `italic`, `underline`, `strike`, `code`, `highlight`, `superscript`, `subscript`       |
| Headings        | `h1`, `h2`, `h3`                                                                               |
| Lists           | `bulletList`, `orderedList`, `taskList`                                                        |
| Blocks          | `blockquote`, `horizontalRule`, `codeBlock`                                                    |
| Alignment       | `alignLeft`, `alignCenter`, `alignRight`, `alignJustify`                                       |
| History         | `undo`, `redo`                                                                                 |
| Insert          | `link`, `image`                                                                                |
| Table           | `insertTable`, `addColumnAfter`, `addColumnBefore`, `deleteColumn`, `addRowAfter`, `addRowBefore`, `deleteRow`, `deleteTable`, `mergeCells`, `splitCell` |
| Other           | `clearFormatting`, `custom`                                                                    |

## Slash Commands

Type `/` at the beginning of a new line or after a space to open the command menu. Commands are grouped by category:

| Category | Command       | Description               |
| -------- | ------------- | ------------------------- |
| Basic    | Text          | Plain paragraph text      |
| Basic    | Heading 1–3   | Section headings          |
| Lists    | Bullet List   | Unordered list            |
| Lists    | Numbered List | Ordered list              |
| Lists    | Task List     | Checklist with checkboxes |
| Blocks   | Blockquote    | Indented quote block      |
| Blocks   | Code Block    | Syntax-highlighted code   |
| Blocks   | Callout       | Info callout block        |
| Blocks   | Warning       | Warning callout block     |
| Inserts  | Divider       | Horizontal separator      |
| Inserts  | Image         | Insert image from URL     |
| Inserts  | Table         | Insert a 3×3 table        |
| Embeds   | YouTube       | Embed a YouTube video     |

## Accessing the Editor Instance

Use the `onReady` callback to get direct access to the underlying Tiptap `Editor` for programmatic control:

```tsx
<DocsEditor
  content=""
  theme={theme}
  onChange={setContent}
  onReady={(editor) => {
    // Example: focus the editor
    editor.commands.focus();
    // Example: insert content programmatically
    editor.commands.insertContent("<p>Inserted!</p>");
  }}
/>
```

## Theming

The editor derives all its styling from the MUI `Theme` you pass in — colors, typography, border radius, and spacing. It supports both light and dark mode automatically.

```tsx
import { createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    secondary: { main: "#8b5cf6" },
  },
});

<DocsEditor content="" theme={darkTheme} onChange={setContent} />;
```

## License

[MIT](./LICENSE)
