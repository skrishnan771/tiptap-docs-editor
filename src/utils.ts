import type { Editor } from "@tiptap/react";

/** Toggle or insert a link, preserving selection across the blocking prompt. */
export function promptForLink(editor: Editor) {
  const previousUrl = editor.getAttributes("link").href as string | undefined;
  if (editor.isActive("link")) {
    editor.chain().focus().unsetLink().run();
    return;
  }

  const { from, to } = editor.state.selection;
  const url = window.prompt("URL:", previousUrl ?? "https://");
  if (!url) {
    editor.chain().focus().run();
    return;
  }

  editor
    .chain()
    .focus()
    .setTextSelection({ from, to })
    .setLink({ href: url })
    .run();
}
