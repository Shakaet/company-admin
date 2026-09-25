import type { Editor } from "@tiptap/react";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import { TIPTAP_ICONS, TiptapIcon } from "./tip-tap-icon";
import { TiptapLinkDialog } from "./tip-tap-modal";
import { TiptapToolbarButton } from "./tip-tap-toolbar-button";

type TiptapEditor = Editor | null;

interface BaseGroupProps {
  editor: TiptapEditor;
}

//! History  (Undo / Redo)

export const TiptapHistoryGroup = ({ editor }: BaseGroupProps) => (
  <>
    <TiptapToolbarButton
      title="Undo"
      disabled={!editor?.can().undo()}
      onClick={() => editor?.chain().focus().undo().run()}
    >
      <TiptapIcon d={TIPTAP_ICONS.undo} />
    </TiptapToolbarButton>

    <TiptapToolbarButton
      title="Redo"
      disabled={!editor?.can().redo()}
      onClick={() => editor?.chain().focus().redo().run()}
    >
      <TiptapIcon d={TIPTAP_ICONS.redo} />
    </TiptapToolbarButton>
  </>
);

//! Headings  (H1 / H2 / H3)

interface TiptapHeadingGroupProps extends BaseGroupProps {
  levels?: Array<1 | 2 | 3>;
}

export const TiptapHeadingGroup = ({
  editor,
  levels = [1, 2, 3],
}: TiptapHeadingGroupProps) => (
  <>
    {levels.map((level) => (
      <TiptapToolbarButton
        key={level}
        title={`Heading ${level}`}
        active={editor?.isActive("heading", { level })}
        onClick={() => editor?.chain().focus().toggleHeading({ level }).run()}
      >
        <TiptapIcon
          d={TIPTAP_ICONS[`h${level}` as keyof typeof TIPTAP_ICONS]}
        />
      </TiptapToolbarButton>
    ))}
  </>
);

//! Inline marks  (Bold / Italic / Underline / Strike)

type MarkType = "bold" | "italic" | "underline" | "strike";

interface TiptapMarksGroupProps extends BaseGroupProps {
  marks?: MarkType[];
}

const markConfig: Record<
  MarkType,
  {
    title: string;
    icon: string;
    action: (editor: Editor) => void;
  }
> = {
  bold: {
    title: "Bold",
    icon: TIPTAP_ICONS.bold,
    action: (editor) => {
      editor.chain().focus().toggleBold().run();
    },
  },
  italic: {
    title: "Italic",
    icon: TIPTAP_ICONS.italic,
    action: (editor) => {
      editor.chain().focus().toggleItalic().run();
    },
  },
  underline: {
    title: "Underline",
    icon: TIPTAP_ICONS.underline,
    action: (editor) => {
      editor.chain().focus().toggleUnderline().run();
    },
  },
  strike: {
    title: "Strikethrough",
    icon: TIPTAP_ICONS.strike,
    action: (editor) => {
      editor.chain().focus().toggleStrike().run();
    },
  },
};

export const TiptapMarksGroup = ({
  editor,
  marks = ["bold", "italic", "underline", "strike"],
}: TiptapMarksGroupProps) => {
  if (!editor) return null;

  return (
    <>
      {marks.map((mark) => {
        const c = markConfig[mark];
        return (
          <TiptapToolbarButton
            key={mark}
            title={c.title}
            active={editor.isActive(mark)}
            onClick={() => c.action(editor)}
          >
            <TiptapIcon d={c.icon} />
          </TiptapToolbarButton>
        );
      })}
    </>
  );
};

//! Script  (Subscript / Superscript)

export const TiptapScriptGroup = ({ editor }: BaseGroupProps) => (
  <>
    <TiptapToolbarButton
      title="Subscript"
      active={editor?.isActive("subscript")}
      onClick={() => editor?.chain().focus().toggleSubscript().run()}
    >
      <TiptapIcon d={TIPTAP_ICONS.sub} />
    </TiptapToolbarButton>

    <TiptapToolbarButton
      title="Superscript"
      active={editor?.isActive("superscript")}
      onClick={() => editor?.chain().focus().toggleSuperscript().run()}
    >
      <TiptapIcon d={TIPTAP_ICONS.sup} />
    </TiptapToolbarButton>
  </>
);

//! Color  (Highlight + Text color picker)

export const TiptapColorGroup = ({ editor }: BaseGroupProps) => (
  <>
    <TiptapToolbarButton
      title="Highlight"
      active={editor?.isActive("highlight")}
      onClick={() => editor?.chain().focus().toggleHighlight().run()}
    >
      <TiptapIcon d={TIPTAP_ICONS.highlight} />
    </TiptapToolbarButton>

    <label
      title="Text Color"
      className="relative flex cursor-pointer items-center rounded-md p-1.5 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground"
    >
      <span
        className="select-none text-xs font-black underline decoration-2"
        style={{
          textDecorationColor:
            editor?.getAttributes("textStyle")?.color ??
            "hsl(var(--foreground))",
        }}
      >
        A
      </span>
      <input
        type="color"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onInput={(e: React.FormEvent<HTMLInputElement>) =>
          editor
            ?.chain()
            .focus()
            .setColor((e.target as HTMLInputElement).value)
            .run()
        }
      />
    </label>
  </>
);

//! Lists  (Bullet / Ordered / Task)

type ListType = "bulletList" | "orderedList" | "taskList";

interface TiptapListGroupProps extends BaseGroupProps {
  lists?: ListType[];
}

const listConfig: Record<
  ListType,
  {
    title: string;
    icon: string;
    action: (editor: Editor) => void;
  }
> = {
  bulletList: {
    title: "Bullet List",
    icon: TIPTAP_ICONS.ul,
    action: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  orderedList: {
    title: "Ordered List",
    icon: TIPTAP_ICONS.ol,
    action: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  taskList: {
    title: "Task List",
    icon: TIPTAP_ICONS.task,
    action: (editor) => {
      editor.chain().focus().toggleTaskList().run();
    },
  },
};

export const TiptapListGroup = ({
  editor,
  lists = ["bulletList", "orderedList", "taskList"],
}: TiptapListGroupProps) => {
  if (!editor) return null;

  return (
    <>
      {lists.map((list) => {
        const c = listConfig[list];
        return (
          <TiptapToolbarButton
            key={list}
            title={c.title}
            active={editor.isActive(list)}
            onClick={() => c.action(editor)}
          >
            <TiptapIcon d={c.icon} />
          </TiptapToolbarButton>
        );
      })}
    </>
  );
};

//! Blocks  (Blockquote / Horizontal Rule / Code Block)

type BlockType = "blockquote" | "hr" | "codeBlock";

interface TiptapBlockGroupProps extends BaseGroupProps {
  blocks?: BlockType[];
}

const blockConfig: Record<
  BlockType,
  {
    title: string;
    icon: string;
    active?: string;
    action: (editor: Editor) => void;
  }
> = {
  blockquote: {
    title: "Blockquote",
    icon: TIPTAP_ICONS.blockquote,
    active: "blockquote",
    action: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  hr: {
    title: "Divider",
    icon: TIPTAP_ICONS.hr,
    action: (editor) => {
      editor.chain().focus().setHorizontalRule().run();
    },
  },
  codeBlock: {
    title: "Code Block",
    icon: TIPTAP_ICONS.codeBlock,
    active: "codeBlock",
    action: (editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
};

export const TiptapBlockGroup = ({
  editor,
  blocks = ["blockquote", "hr", "codeBlock"],
}: TiptapBlockGroupProps) => {
  if (!editor) return null;

  return (
    <>
      {blocks.map((block) => {
        const c = blockConfig[block];
        return (
          <TiptapToolbarButton
            key={block}
            title={c.title}
            active={c.active ? editor.isActive(c.active) : false}
            onClick={() => c.action(editor)}
          >
            <TiptapIcon d={c.icon} />
          </TiptapToolbarButton>
        );
      })}
    </>
  );
};

//! Alignment  (Left / Center / Right / Justify)

type AlignType = "left" | "center" | "right" | "justify";

interface TiptapAlignGroupProps extends BaseGroupProps {
  aligns?: AlignType[];
}

const alignIconMap: Record<AlignType, string> = {
  left: TIPTAP_ICONS.alignL,
  center: TIPTAP_ICONS.alignC,
  right: TIPTAP_ICONS.alignR,
  justify: TIPTAP_ICONS.alignJ,
};

export const TiptapAlignGroup = ({
  editor,
  aligns = ["left", "center", "right", "justify"],
}: TiptapAlignGroupProps) => (
  <>
    {aligns.map((align) => (
      <TiptapToolbarButton
        key={align}
        title={`Align ${align}`}
        active={
          editor?.isActive("paragraph", { textAlign: align }) ||
          editor?.isActive("heading", { textAlign: align })
        }
        onClick={() => editor?.chain().focus().setTextAlign(align).run()}
      >
        <TiptapIcon d={alignIconMap[align]} />
      </TiptapToolbarButton>
    ))}
  </>
);

//! Link  shadcn Dialog — no window.prompt()

export const TiptapLinkGroup = ({ editor }: BaseGroupProps) => {
  const [open, setOpen] = useState(false);

  const currentUrl = editor?.isActive("link")
    ? (editor.getAttributes("link").href ?? "")
    : "";

  const handleOpen = useCallback(() => {
    editor?.chain().focus().run();
    setOpen(true);
  }, [editor]);

  const handleConfirm = useCallback(
    (url: string, openInNewTab: boolean) => {
      if (!url) {
        editor?.chain().focus().extendMarkRange("link").unsetLink().run();
        return;
      }

      let formattedUrl = url.trim();

      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = `https://${formattedUrl}`;
      }

      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({
          href: formattedUrl,
          target: openInNewTab ? "_blank" : "_self",
          rel: openInNewTab ? "noopener noreferrer" : undefined,
        })
        .run();
    },
    [editor],
  );

  return (
    <>
      <TiptapToolbarButton
        title={editor?.isActive("link") ? "Edit Link" : "Insert Link"}
        active={editor?.isActive("link")}
        onClick={handleOpen}
      >
        <TiptapIcon d={TIPTAP_ICONS.link} />
      </TiptapToolbarButton>

      <TiptapLinkDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleConfirm}
        initialUrl={currentUrl}
      />
    </>
  );
};

//! Image upload  (local file → base64)

export const TiptapImageGroup = ({ editor }: BaseGroupProps) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();

    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") {
        editor.chain().focus().setImage({ src: result }).run();
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <>
      <TiptapToolbarButton
        title="Insert Image"
        onClick={() => ref.current?.click()}
      >
        <TiptapIcon d={TIPTAP_ICONS.image} />
      </TiptapToolbarButton>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </>
  );
};

//! Clear Formatting

export const TiptapClearGroup = ({ editor }: BaseGroupProps) => (
  <TiptapToolbarButton
    title="Clear Formatting"
    onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
  >
    <TiptapIcon d={TIPTAP_ICONS.clearMark} />
  </TiptapToolbarButton>
);
