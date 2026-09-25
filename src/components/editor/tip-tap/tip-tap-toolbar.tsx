import { cn } from "@/lib/utils";
import { type Editor } from "@tiptap/react";
import { useEffect, useState, type ComponentType } from "react";
import { TiptapToolbarSeparator } from "./tip-tap-toolbar-button";
import {
  TiptapAlignGroup,
  TiptapBlockGroup,
  TiptapClearGroup,
  TiptapColorGroup,
  TiptapHeadingGroup,
  TiptapHistoryGroup,
  TiptapImageGroup,
  TiptapLinkGroup,
  TiptapListGroup,
  TiptapMarksGroup,
  TiptapScriptGroup,
} from "./tip-tap-toolbar-group";

/* =========================
   Types
========================= */

type TiptapEditor = Editor | null;

export type GroupKey =
  | "history"
  | "headings"
  | "marks"
  | "script"
  | "color"
  | "lists"
  | "blocks"
  | "align"
  | "link"
  | "image"
  | "clear";

type GroupComponent = ComponentType<any>;

type GroupRegistry = Record<GroupKey, GroupComponent>;

export type GroupPropsMap = Partial<Record<GroupKey, Record<string, unknown>>>;

interface TiptapToolbarProps {
  editor: TiptapEditor;
  groups?: GroupKey[];
  groupProps?: GroupPropsMap;
  className?: string;
}

/* =========================
   Registry
========================= */

const GROUP_REGISTRY: GroupRegistry = {
  history: TiptapHistoryGroup,
  headings: TiptapHeadingGroup,
  marks: TiptapMarksGroup,
  script: TiptapScriptGroup,
  color: TiptapColorGroup,
  lists: TiptapListGroup,
  blocks: TiptapBlockGroup,
  align: TiptapAlignGroup,
  link: TiptapLinkGroup,
  image: TiptapImageGroup,
  clear: TiptapClearGroup,
};

/* =========================
   Default order
========================= */

const DEFAULT_GROUPS: GroupKey[] = [
  "history",
  "headings",
  "marks",
  "script",
  "color",
  "lists",
  "blocks",
  "align",
  "link",
  "image",
  "clear",
];

/* =========================
   Component
========================= */

export const TiptapToolbar = ({
  editor,
  groups = DEFAULT_GROUPS,
  groupProps = {},
  className,
}: TiptapToolbarProps) => {
  const [, setRenderTick] = useState(0);

  useEffect(() => {
    if (!editor) return;

    const rerender = () => setRenderTick((tick) => tick + 1);

    editor.on("transaction", rerender);

    return () => {
      editor.off("transaction", rerender);
    };
  }, [editor]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/50 p-1.5",
        className,
      )}
    >
      {groups.map((key, idx) => {
        const Component = GROUP_REGISTRY[key];
        if (!Component) return null;

        const extras = groupProps[key] ?? {};

        return (
          <span key={key} className="contents">
            {idx > 0 && <TiptapToolbarSeparator />}
            <Component editor={editor} {...extras} />
          </span>
        );
      })}
    </div>
  );
};
