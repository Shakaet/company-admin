import CharacterCount from "@tiptap/extension-character-count";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { useEditor, type EditorOptions, type Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface UseTiptapEditorOptions {
  content?: string;
  placeholder?: string;
  characterLimit?: number;
  editable?: boolean;
  onUpdate?: EditorOptions["onUpdate"];
  extraExtensions?: Extensions;
}

export const useTiptapEditor = ({
  content = "",
  placeholder = "Start writing…",
  characterLimit,
  editable = true,
  onUpdate,
  extraExtensions = [],
}: UseTiptapEditorOptions = {}) => {
  const editor = useEditor({
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({ openOnClick: false }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({ placeholder }),
      CharacterCount.configure(
        typeof characterLimit === "number" ? { limit: characterLimit } : {},
      ),
      TextStyle,
      Color,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      HorizontalRule,
      Subscript,
      Superscript,
      ...extraExtensions,
    ],
    content,
    onUpdate,
    editorProps: {
      attributes: { spellcheck: "true" },
    },
    onSelectionUpdate: ({ editor }) => {
      editor.view.dispatch(editor.state.tr);
    },
    immediatelyRender: true,
  });

  return editor;
};
