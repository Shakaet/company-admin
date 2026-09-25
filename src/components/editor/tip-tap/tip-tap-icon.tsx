import type { FC, SVGProps } from "react";

interface TiptapIconProps extends SVGProps<SVGSVGElement> {
  d: string;
  size?: number;
}

export const TiptapIcon: FC<TiptapIconProps> = ({ d, size = 15, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d={d} />
  </svg>
);

export const TIPTAP_ICONS: Record<string, string> = {
  bold: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
  italic: "M19 4h-9M14 20H5M14.7 4.7L9.2 19.4",
  underline: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16",
  strike:
    "M17.3 6.3a6.5 6.5 0 0 0-5.8-1.3C9 5.6 7.5 7.6 8 9.7c.6 2.8 5 3.4 7 5.3.7.8 1 1.8.8 2.7-.4 2-3 3-5.3 2.8-1.6-.2-3.1-1-4-2.2M4 12h16",
  h1: "M4 12h8M4 6v12M12 6v12M17 10l3-2v8",
  h2: "M4 12h8M4 6v12M12 6v12M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1",
  h3: "M4 12h8M4 6v12M12 6v12M18 7c2.7 0 3.71 1.5 3.71 2.5 0 1-.29 2-2.14 2.5 2 .5 2.43 1.5 2.43 2.5C22 15.5 21 17 18 17",
  ul: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  ol: "M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",
  blockquote:
    "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z",
  hr: "M5 12h14",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  image:
    "M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7M16 5h6M19 2v6M9 13l3 3 8-8",
  alignL: "M3 6h18M3 12h12M3 18h15",
  alignC: "M3 6h18M6 12h12M4 18h16",
  alignR: "M3 6h18M9 12h12M6 18h15",
  alignJ: "M3 6h18M3 12h18M3 18h18",
  table: "M3 3h18v18H3zM3 9h18M3 15h18M9 3v18M15 3v18",
  task: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
  highlight:
    "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 1 1 3.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z",
  sub: "M16 4l-4 9h8l-4-9zM3 20h6M6 15v5",
  sup: "M16 4l-4 9h8l-4-9zM3 7h6M6 2v5",
  undo: "M3 7v6h6",
  redo: "M21 7v6h-6",
  code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  codeBlock:
    "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6M10 13l-2 2 2 2M14 17l2-2-2-2",
  clearMark:
    "M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5zM3 3l18 18",
};
