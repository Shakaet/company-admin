import type { Editor } from "@tiptap/react";
import React, { useEffect } from "react";
import { TiptapEditor } from "./tip-tap-editor";
import { useTiptapEditor } from "./use-tip-tap-editor";

interface LazyTiptapProps {
  content?: string;
  placeholder?: string;
  characterLimit?: number;
  editable?: boolean;
  onUpdate?: any;
  extraExtensions?: any;
  onEditor?: (editor: Editor | null) => void;
}

const LazyTiptapEditor: React.FC<LazyTiptapProps> = ({
  content,
  placeholder,
  characterLimit,
  editable = true,
  onUpdate,
  extraExtensions,
  onEditor,
}) => {
  const editor = useTiptapEditor({
    content,
    placeholder,
    characterLimit,
    editable,
    onUpdate,
    extraExtensions,
  });

  useEffect(() => {
    onEditor?.(editor ?? null);
    return () => {
      onEditor?.(null);
      editor?.destroy?.();
    };
  }, [editor, onEditor]);

  return <TiptapEditor editor={editor} />;
};

export default LazyTiptapEditor;
