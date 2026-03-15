# tiptap-docs-editor

A drop-in, Notion-style rich text editor component for React — built on [Tiptap 3](https://tiptap.dev/) and [Material UI](https://mui.com/).

## Features

- **Top toolbar** — undo/redo, text formatting, headings, lists, blockquotes, code blocks, images, links, and text alignment
- **Bubble menu** — floating toolbar on text selection for quick inline formatting
- **Slash commands** — type `/` to insert blocks (headings, lists, code blocks, images, dividers, etc.)
- **Drag handle** — drag & drop blocks to reorder content
- **Syntax-highlighted code blocks** — powered by [lowlight](https://github.com/wooorm/lowlight) with common language support
- **Task lists** — interactive checklists with nesting support
- **Image support** — upload via file picker or paste a URL through the slash menu
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

| Prop          | Type                       | Required | Default            | Description                                                  |
| ------------- | -------------------------- | -------- | ------------------ | ------------------------------------------------------------ |
| `content`     | `string`                   | Yes      | —                  | Initial HTML content for the editor                          |
| `theme`       | `Theme`                    | Yes      | —                  | MUI theme object (from `createTheme()`)                      |
| `onChange`    | `(html: string) => void`   | Yes      | —                  | Called with the updated HTML on every edit                   |
| `placeholder` | `string`                   | No       | `"Start writing…"` | Placeholder text shown when the editor is empty              |
| `onReady`     | `(editor: Editor) => void` | No       | —                  | Called once with the Tiptap `Editor` instance after creation |

### Exports

```ts
import { DocsEditor } from "tiptap-docs-editor";
import type { DocsEditorProps, ToolbarAction } from "tiptap-docs-editor";
```

| Export            | Kind      | Description                                |
| ----------------- | --------- | ------------------------------------------ |
| `DocsEditor`      | Component | The main editor component                  |
| `DocsEditorProps` | Type      | Props interface for `DocsEditor`           |
| `ToolbarAction`   | Type      | Union of all built-in toolbar action names |

### `ToolbarAction`

All available actions that the toolbars support:

| Category        | Actions                                                      |
| --------------- | ------------------------------------------------------------ |
| Text formatting | `bold`, `italic`, `underline`, `strike`, `code`, `highlight` |
| Headings        | `h1`, `h2`, `h3`                                             |
| Lists           | `bulletList`, `orderedList`, `taskList`                      |
| Blocks          | `blockquote`, `horizontalRule`, `codeBlock`                  |
| Alignment       | `alignLeft`, `alignCenter`, `alignRight`                     |
| History         | `undo`, `redo`                                               |
| Insert          | `link`, `image`                                              |

## Slash Commands

Type `/` at the beginning of a new line or after a space to open the command menu. Available commands:

| Command       | Description               |
| ------------- | ------------------------- |
| Text          | Plain paragraph text      |
| Heading 1–3   | Section headings          |
| Bullet List   | Unordered list            |
| Numbered List | Ordered list              |
| Task List     | Checklist with checkboxes |
| Blockquote    | Indented quote block      |
| Code Block    | Syntax-highlighted code   |
| Divider       | Horizontal separator      |
| Image         | Insert image from URL     |

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
