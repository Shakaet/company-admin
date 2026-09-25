/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
} from "lucide-react";
import { useMemo, useState } from "react";

interface ConsoleSnippetProps {
  data: unknown;
  title?: string;
  maxHeight?: number;
  defaultCollapsed?: boolean;
}

interface JsonNodeProps {
  data: any;
  name?: string;
  level?: number;
}

const INDENT = 18;

// ─────────────────────────────────────────────
// Primitive Value Renderer
// ─────────────────────────────────────────────
const PrimitiveValue = ({ value }: { value: any }) => {
  if (typeof value === "string") {
    return <span className="break-all text-emerald-400">"{value}"</span>;
  }

  if (typeof value === "number") {
    return <span className="text-rose-400">{value}</span>;
  }

  if (typeof value === "boolean") {
    return <span className="text-violet-400">{String(value)}</span>;
  }

  if (value === null) {
    return <span className="text-orange-400">null</span>;
  }

  return <span className="text-zinc-300">{String(value)}</span>;
};

// ─────────────────────────────────────────────
// Recursive JSON Node
// ─────────────────────────────────────────────
const JsonNode = ({ data, name, level = 0 }: JsonNodeProps) => {
  const [collapsed, setCollapsed] = useState(level > 1);

  const isObject = typeof data === "object" && data !== null;

  // Primitive
  if (!isObject) {
    return (
      <div
        style={{
          paddingLeft: level * INDENT,
        }}
        className="group flex min-h-6 items-start gap-2 rounded-md px-2 py-0.5 hover:bg-zinc-900/70"
      >
        {name !== undefined && (
          <>
            <span className="select-none text-sky-300">"{name}"</span>

            <span className="text-zinc-500">:</span>
          </>
        )}

        <PrimitiveValue value={data} />
      </div>
    );
  }

  const isArray = Array.isArray(data);

  const entries = isArray
    ? data.map((item, index) => [String(index), item])
    : Object.entries(data);

  return (
    <div>
      {/* Header */}
      <div
        style={{
          paddingLeft: level * INDENT,
        }}
        className={cn(
          "group flex min-h-6 cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 hover:bg-zinc-900/70",
        )}
        onClick={() => setCollapsed((prev) => !prev)}
      >
        {collapsed ? (
          <ChevronRight size={14} className="shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown size={14} className="shrink-0 text-zinc-500" />
        )}

        {name !== undefined && (
          <>
            <span className="text-sky-300">"{name}"</span>

            <span className="text-zinc-500">:</span>
          </>
        )}

        <span className="text-zinc-400">{isArray ? "[" : "{"}</span>

        {collapsed && (
          <>
            <span className="text-xs text-zinc-600">
              {entries.length} items
            </span>

            <span className="text-zinc-400">{isArray ? "]" : "}"}</span>
          </>
        )}
      </div>

      {/* Children */}
      {!collapsed && (
        <>
          <div className="relative">
            {entries.map(([key, value]) => (
              <JsonNode key={key} name={key} data={value} level={level + 1} />
            ))}
          </div>

          <div
            style={{
              paddingLeft: level * INDENT + 20,
            }}
            className="text-zinc-400"
          >
            {isArray ? "]" : "}"}
          </div>
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const ConsoleSnippet = ({
  data,
  title = "Response",
  maxHeight = 700,
  defaultCollapsed = false,
}: ConsoleSnippetProps) => {
  const [copied, setCopied] = useState(false);

  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  const formatted = useMemo(
    () => (data != null ? JSON.stringify(data, null, 2) : "null"),
    [data],
  );

  const lines = useMemo(() => formatted.split("\n").length, [formatted]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatted);

      setCopied(true);

      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="w-full overflow-auto scrollbar-hide rounded-xl border border-zinc-800 bg-zinc-950 shadow-2xl">
      {/* Header */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {["#ff5f57", "#febc2e", "#28c840"].map((color) => (
              <span
                key={color}
                className="h-3 w-3 rounded-full"
                style={{
                  background: color,
                }}
              />
            ))}
          </div>

          <p className="text-xs font-medium text-zinc-300">{title}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-zinc-700 bg-zinc-900 px-2 text-[10px] text-zinc-400"
          >
            JSON
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className={cn(
              "h-7 gap-1.5 px-2.5 text-xs text-zinc-400 hover:text-zinc-100",
              copied && "text-emerald-400 hover:text-emerald-400",
            )}
          >
            {copied ? (
              <>
                <Check size={12} />
                Copied
              </>
            ) : (
              <>
                <Copy size={12} />
                Copy
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed((prev) => !prev)}
            className="h-7 w-7 p-0 text-zinc-400 hover:text-zinc-100"
          >
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </Button>
        </div>
      </div>

      {/* Body */}
      {!collapsed && (
        <ScrollArea
          style={{
            maxHeight,
          }}
          className="w-full"
        >
          <div className="min-w-full p-4 font-mono text-[13px] leading-6">
            <JsonNode data={data} />
          </div>
        </ScrollArea>
      )}

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-1.5">
          <p className="font-mono text-[10px] text-zinc-600">
            {lines} lines · {formatted.length} chars
          </p>
        </div>
      )}
    </div>
  );
};

export default ConsoleSnippet;
