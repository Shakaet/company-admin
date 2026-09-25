import { cn } from "@/lib/utils";
import type { Editor } from "@tiptap/react";

interface CharacterCountStorage {
  characters?: () => number;
  words?: () => number;
}

interface TiptapEditorWithCharacterCount extends Editor {
  storage: Editor["storage"] & {
    characterCount?: CharacterCountStorage;
  };
}

interface TiptapStatusBarProps {
  editor: TiptapEditorWithCharacterCount | null;
  limit?: number;
  className?: string;
}

export const TiptapStatusBar = ({
  editor,
  limit,
  className,
}: TiptapStatusBarProps) => {
  if (!editor) return null;

  const chars = editor.storage.characterCount?.characters?.() ?? 0;
  const words = editor.storage.characterCount?.words?.() ?? 0;
  const overLimit = typeof limit === "number" && chars > limit;

  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-border bg-muted/30 px-3 py-1",
        className,
      )}
    >
      <span className="text-[11px] text-muted-foreground">{words} words</span>

      <span
        className={cn(
          "text-[11px]",
          overLimit ? "font-medium text-destructive" : "text-muted-foreground",
        )}
      >
        {chars}
        {typeof limit === "number" ? ` / ${limit}` : ""} chars
      </span>
    </div>
  );
};
