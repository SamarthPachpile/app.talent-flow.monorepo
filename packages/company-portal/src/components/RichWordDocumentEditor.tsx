import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Sparkles,
  Eraser,
  Undo2,
  Redo2,
  Pilcrow,
  CheckSquare,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  Highlighter,
  Palette,
} from "lucide-react";

interface RichWordDocumentEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
}

interface EditorActiveStates {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
  bullet: boolean;
  numbered: boolean;
  h1: boolean;
  h2: boolean;
  h3: boolean;
  paragraph: boolean;
  blockquote: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
  alignJustify: boolean;
}

const defaultActiveStates: EditorActiveStates = {
  bold: false,
  italic: false,
  underline: false,
  strike: false,
  bullet: false,
  numbered: false,
  h1: false,
  h2: false,
  h3: false,
  paragraph: false,
  blockquote: false,
  alignLeft: true,
  alignCenter: false,
  alignRight: false,
  alignJustify: false,
};

const TEXT_COLORS = [
  { name: "Default", color: "inherit" },
  { name: "Slate", color: "#334155" },
  { name: "Orange", color: "#ea580c" },
  { name: "Blue", color: "#2563eb" },
  { name: "Green", color: "#16a34a" },
  { name: "Purple", color: "#9333ea" },
  { name: "Red", color: "#dc2626" },
];

const HIGHLIGHT_COLORS = [
  { name: "None", color: "transparent" },
  { name: "Yellow", color: "#fef08a" },
  { name: "Orange", color: "#fed7aa" },
  { name: "Green", color: "#bbf7d0" },
  { name: "Blue", color: "#bfdbfe" },
  { name: "Purple", color: "#e9d5ff" },
  { name: "Rose", color: "#fecdd3" },
];

function convertToInitialHtml(input: string): string {
  if (!input) return "";
  if (/<[a-z][\s\S]*>/i.test(input)) {
    return input;
  }
  return input
    .split(/\r?\n/)
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return "<p><br></p>";
      if (/^###\s+(.*)$/.test(trimmed)) {
        return `<h4>${trimmed.replace(/^###\s+/, "")}</h4>`;
      }
      if (/^##\s+(.*)$/.test(trimmed)) {
        return `<h3>${trimmed.replace(/^##\s+/, "")}</h3>`;
      }
      if (/^#\s+(.*)$/.test(trimmed)) {
        return `<h2>${trimmed.replace(/^#\s+/, "")}</h2>`;
      }
      if (/^[•+*▪▫—–-]\s+(.*)$/.test(trimmed)) {
        return `<ul><li>${trimmed.replace(/^[•+*▪▫—–-]\s+/, "")}</li></ul>`;
      }
      if (/^\d+[.)]\s+(.*)$/.test(trimmed)) {
        return `<ol><li>${trimmed.replace(/^\d+[.)]\s+/, "")}</li></ol>`;
      }
      if (/^>\s+(.*)$/.test(trimmed)) {
        return `<blockquote>${trimmed.replace(/^>\s+/, "")}</blockquote>`;
      }
      const formatted = trimmed
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/__(.*?)__/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/_(.*?)_/g, "<em>$1</em>")
        .replace(/~~(.*?)~~/g, "<del>$1</del>")
        .replace(/`(.*?)`/g, "<code>$1</code>");
      return `<p>${formatted}</p>`;
    })
    .join("");
}

export const RichWordDocumentEditor: React.FC<RichWordDocumentEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your complete Job Description here... Format with bold, italics, headings, bullet lists, alignments, and colors just like Microsoft Word.",
  minHeight = "240px",
  label = "Role Overview & Job Description",
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [wordCount, setWordCount] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);
  const [activeStates, setActiveStates] = useState<EditorActiveStates>(defaultActiveStates);
  const [showColorPicker, setShowColorPicker] = useState<boolean>(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState<boolean>(false);
  const isInternalChange = useRef<boolean>(false);

  const updateCounts = useCallback((text: string) => {
    const cleanText = text.replace(/<[^>]*>/g, " ").trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;
    setWordCount(words);
    setCharCount(cleanText.length);
  }, []);

  const updateActiveStates = useCallback(() => {
    if (!editorRef.current) return;
    const sel = window.getSelection();
    if (!sel || !sel.anchorNode || !editorRef.current.contains(sel.anchorNode)) {
      return;
    }

    let isBold = false;
    let isItalic = false;
    let isUnderline = false;
    let isStrike = false;
    let isBullet = false;
    let isNumbered = false;
    let isAlignLeft = false;
    let isAlignCenter = false;
    let isAlignRight = false;
    let isAlignJustify = false;

    try {
      isBold = document.queryCommandState("bold");
      isItalic = document.queryCommandState("italic");
      isUnderline = document.queryCommandState("underline");
      isStrike = document.queryCommandState("strikeThrough");
      isBullet = document.queryCommandState("insertUnorderedList");
      isNumbered = document.queryCommandState("insertOrderedList");
      isAlignLeft = document.queryCommandState("justifyLeft");
      isAlignCenter = document.queryCommandState("justifyCenter");
      isAlignRight = document.queryCommandState("justifyRight");
      isAlignJustify = document.queryCommandState("justifyFull");
    } catch {
      // ignore
    }

    let isH1 = false;
    let isH2 = false;
    let isH3 = false;
    let isBlockquote = false;
    let currentNode: Node | null = sel.anchorNode;

    while (currentNode && currentNode !== editorRef.current) {
      if (currentNode.nodeType === Node.ELEMENT_NODE) {
        const el = currentNode as HTMLElement;
        const tag = el.tagName.toLowerCase();
        if (tag === "h2" || tag === "h1") isH1 = true;
        if (tag === "h3") isH2 = true;
        if (tag === "h4") isH3 = true;
        if (tag === "blockquote") isBlockquote = true;
        if (tag === "ul") isBullet = true;
        if (tag === "ol") isNumbered = true;
        if (tag === "b" || tag === "strong") isBold = true;
        if (tag === "i" || tag === "em") isItalic = true;
        if (tag === "u") isUnderline = true;
        if (tag === "del" || tag === "s" || tag === "strike") isStrike = true;
      }
      currentNode = currentNode.parentNode;
    }

    setActiveStates({
      bold: isBold,
      italic: isItalic,
      underline: isUnderline,
      strike: isStrike,
      bullet: isBullet,
      numbered: isNumbered,
      h1: isH1,
      h2: isH2,
      h3: isH3,
      paragraph: !isH1 && !isH2 && !isH3 && !isBlockquote,
      blockquote: isBlockquote,
      alignLeft: isAlignLeft || (!isAlignCenter && !isAlignRight && !isAlignJustify),
      alignCenter: isAlignCenter,
      alignRight: isAlignRight,
      alignJustify: isAlignJustify,
    });
  }, []);

  useEffect(() => {
    const handleSelectionChange = () => {
      updateActiveStates();
    };
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [updateActiveStates]);

  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    const currentHtml = editorRef.current.innerHTML;
    const initialHtml = convertToInitialHtml(value);
    if (currentHtml !== initialHtml) {
      editorRef.current.innerHTML = initialHtml;
      updateCounts(initialHtml);
    }
  }, [value, updateCounts]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    isInternalChange.current = true;
    onChange(html);
    updateCounts(html);
    updateActiveStates();
  };

  const exec = (command: string, val: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, val);
    handleInput();
    setTimeout(updateActiveStates, 0);
  };

  // Keyboard Shortcuts (Tab indent, Shift+Tab outdent, standard Word shortcuts)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      if (e.shiftKey) {
        exec("outdent");
      } else {
        exec("indent");
      }
    }
  };

  // Clear Formatting exactly like Word (clears styles from selection or resets whole doc)
  const handleClearFormatting = () => {
    if (!editorRef.current) return;
    editorRef.current.focus();

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0);
      const text = range.toString();
      document.execCommand("removeFormat", false);
      document.execCommand("formatBlock", false, "<p>");
      document.execCommand("insertText", false, text);
    } else {
      const plainText = editorRef.current.innerText || "";
      const cleanedHtml = plainText
        .split(/\r?\n/)
        .map((line) => {
          const trimmed = line.trim();
          return trimmed ? `<p>${trimmed}</p>` : "<p><br></p>";
        })
        .join("");
      editorRef.current.innerHTML = cleanedHtml || "<p><br></p>";
    }
    handleInput();
  };

  const handleInsertLink = () => {
    const url = prompt("Enter link address (https://...):", "https://");
    if (url && url !== "https://") {
      exec("createLink", url);
    }
  };

  const handleUnlink = () => {
    exec("unlink");
  };

  const handleInsertChecklist = () => {
    exec("insertText", "✅ ");
  };

  const handleApplyTextColor = (color: string) => {
    exec("foreColor", color);
    setShowColorPicker(false);
  };

  const handleApplyHighlight = (color: string) => {
    exec("hiliteColor", color);
    setShowHighlightPicker(false);
  };

  const getBtnClass = (isActive: boolean, extra = "") =>
    `p-1.5 rounded-md text-xs transition-all cursor-pointer ${
      isActive
        ? "bg-orange-500 text-white font-bold shadow-xs ring-1 ring-orange-400 dark:ring-orange-600"
        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-750"
    } ${extra}`;

  const getHeadingBtnClass = (isActive: boolean) =>
    `px-2 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
      isActive
        ? "bg-orange-500 text-white shadow-xs ring-1 ring-orange-400"
        : "text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-750"
    }`;

  return (
    <div className="space-y-1.5 font-sans">
      {/* Label and Badge */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <span>{label}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 font-semibold border border-orange-200/60 dark:border-orange-800/40 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-orange-500" />
            <span>Microsoft Word Document Mode</span>
          </span>
        </label>
      </div>

      {/* Editor Container */}
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-xs focus-within:ring-2 focus-within:ring-orange-500/80 focus-within:border-orange-500 transition-all flex flex-col">
        {/* Full Word Document Ribbon Toolbar */}
        <div className="bg-slate-50 dark:bg-slate-850 px-2.5 py-1.5 border-b border-slate-200 dark:border-slate-750 flex flex-wrap items-center gap-1 text-slate-700 dark:text-slate-300 select-none">
          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("undo");
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("redo");
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-600 dark:text-slate-300 cursor-pointer"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("formatBlock", "<p>");
              }}
              className={getBtnClass(activeStates.paragraph)}
              title="Normal Paragraph"
            >
              <Pilcrow className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("formatBlock", "<h2>");
              }}
              className={getHeadingBtnClass(activeStates.h1)}
              title="Heading 1 (Main Title)"
            >
              H1
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("formatBlock", "<h3>");
              }}
              className={getHeadingBtnClass(activeStates.h2)}
              title="Heading 2 (Section Title)"
            >
              H2
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("formatBlock", "<h4>");
              }}
              className={getHeadingBtnClass(activeStates.h3)}
              title="Heading 3 (Sub-heading)"
            >
              H3
            </button>
          </div>

          {/* Formatting: Bold, Italic, Underline, Strikethrough, Code */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("bold");
              }}
              className={getBtnClass(activeStates.bold)}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("italic");
              }}
              className={getBtnClass(activeStates.italic)}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("underline");
              }}
              className={getBtnClass(activeStates.underline)}
              title="Underline (Ctrl+U)"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("strikeThrough");
              }}
              className={getBtnClass(activeStates.strike)}
              title="Strikethrough"
            >
              <Strikethrough className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Text Color & Highlight Pickers */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200 dark:border-slate-700 relative">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowColorPicker(!showColorPicker);
                  setShowHighlightPicker(false);
                }}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-0.5"
                title="Font Color"
              >
                <Palette className="w-3.5 h-3.5 text-orange-500" />
              </button>
              {showColorPicker && (
                <div className="absolute top-full left-0 mt-1 z-30 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl flex gap-1 w-44 animate-fadeIn">
                  {TEXT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleApplyTextColor(c.color);
                      }}
                      style={{ backgroundColor: c.color === "inherit" ? "#94a3b8" : c.color }}
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 hover:scale-125 transition-transform cursor-pointer"
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowHighlightPicker(!showHighlightPicker);
                  setShowColorPicker(false);
                }}
                className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer flex items-center gap-0.5"
                title="Text Highlight Color"
              >
                <Highlighter className="w-3.5 h-3.5 text-amber-500" />
              </button>
              {showHighlightPicker && (
                <div className="absolute top-full left-0 mt-1 z-30 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl flex gap-1 w-44 animate-fadeIn">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleApplyHighlight(c.color);
                      }}
                      style={{ backgroundColor: c.color === "transparent" ? "#ffffff" : c.color }}
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 hover:scale-125 transition-transform cursor-pointer"
                      title={c.name}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Paragraph Alignment */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("justifyLeft");
              }}
              className={getBtnClass(activeStates.alignLeft)}
              title="Align Left (Ctrl+L)"
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("justifyCenter");
              }}
              className={getBtnClass(activeStates.alignCenter)}
              title="Align Center (Ctrl+E)"
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("justifyRight");
              }}
              className={getBtnClass(activeStates.alignRight)}
              title="Align Right (Ctrl+R)"
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("justifyFull");
              }}
              className={getBtnClass(activeStates.alignJustify)}
              title="Justify (Ctrl+J)"
            >
              <AlignJustify className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Lists & Indentation */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("insertUnorderedList");
              }}
              className={getBtnClass(activeStates.bullet)}
              title="Bullet List (• item)"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("insertOrderedList");
              }}
              className={getBtnClass(activeStates.numbered)}
              title="Numbered List (1. item)"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleInsertChecklist();
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Insert Checklist Item (✅)"
            >
              <CheckSquare className="w-3.5 h-3.5 text-emerald-500" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("outdent");
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Decrease Indent (Shift+Tab)"
            >
              <Outdent className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("indent");
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Increase Indent (Tab)"
            >
              <Indent className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Blockquote, Divider, Link */}
          <div className="flex items-center gap-0.5 pr-1 border-r border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("formatBlock", "<blockquote>");
              }}
              className={getBtnClass(activeStates.blockquote)}
              title="Quote / Callout Block"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec("insertHorizontalRule");
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Horizontal Divider Line"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleInsertLink();
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Insert Link"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleUnlink();
              }}
              className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-750 rounded-md text-slate-700 dark:text-slate-200 cursor-pointer"
              title="Remove Link"
            >
              <Unlink className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Single Clear Formatting button */}
          <div className="ml-auto flex items-center">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleClearFormatting();
              }}
              className="px-2.5 py-1 hover:bg-amber-100 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 rounded-md text-xs font-semibold flex items-center gap-1 border border-amber-200 dark:border-amber-900/60 cursor-pointer transition-colors"
              title="Clear Formatting (Strips headings, bold, styles from selection or entire document)"
            >
              <Eraser className="w-3.5 h-3.5 text-amber-600" />
              <span>Clear Format</span>
            </button>
          </div>
        </div>

        {/* Live Formatted ContentEditable Document Canvas */}
        <div
          ref={editorRef}
          contentEditable={true}
          onInput={handleInput}
          onBlur={handleInput}
          onKeyUp={updateActiveStates}
          onMouseUp={updateActiveStates}
          onFocus={updateActiveStates}
          onKeyDown={handleKeyDown}
          style={{ minHeight }}
          data-placeholder={placeholder}
          className="w-full p-6 text-sm sm:text-[14.5px] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none leading-relaxed font-sans prose prose-slate dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-slate-100 dark:[&_h2]:border-slate-800 [&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_h4]:text-sm [&_h4]:font-bold [&_h4]:mt-2.5 [&_h4]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-orange-50/50 dark:[&_blockquote]:bg-orange-950/20 [&_blockquote]:p-3 [&_blockquote]:my-2 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_hr]:my-4 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-800 [&_a]:text-orange-500 [&_a]:underline"
        />

        {/* Word Document Status Bar */}
        <div className="px-3.5 py-2 bg-slate-50 dark:bg-slate-850 border-t border-slate-200 dark:border-slate-750 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>{wordCount} words</span>
            <span>·</span>
            <span>{charCount} characters</span>
          </div>
          <div className="text-[10.5px] text-slate-400">
            Word Processor Document Mode · Tab to Indent · Shift+Tab to Outdent
          </div>
        </div>
      </div>
    </div>
  );
};
