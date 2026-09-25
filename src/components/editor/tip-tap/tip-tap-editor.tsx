import { cn } from "@/lib/utils";
import { Editor, EditorContent } from "@tiptap/react";

import { TiptapStatusBar } from "./tip-tap-statusbar";
import { TiptapToolbar, type GroupKey } from "./tip-tap-toolbar";
import "./tip-tap.css";

interface TiptapEditorProps {
  editor: Editor | null;
  groups?: GroupKey[];
  groupProps?: Record<string, unknown>;
  showStatusBar?: boolean;
  characterLimit?: number;
  minHeight?: string;
  maxHeight?: string;
  className?: string;
}

export const TiptapEditor = ({
  editor,
  groups,
  groupProps,
  showStatusBar = true,
  characterLimit,
  minHeight = "min-h-[180px]",
  maxHeight = "max-h-[400px]",
  className,
}: TiptapEditorProps) => {
  if (!editor) return null;

  return (
    <div
      className={cn(
        "border border-input rounded-lg overflow-hidden bg-background shadow-sm",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-0",
        className,
      )}
    >
      {/* Toolbar */}
      <TiptapToolbar editor={editor} groups={groups} groupProps={groupProps} />

      {/* Editable area */}
      <EditorContent
        editor={editor}
        className={cn("overflow-y-auto", minHeight, maxHeight)}
      />

      {/* Footer */}
      {showStatusBar && (
        <TiptapStatusBar editor={editor} limit={characterLimit} />
      )}
    </div>
  );
};
