import React from "react";

interface RichJobDescriptionRendererProps {
  content?: string;
  className?: string;
  fallbackText?: string;
}

export const RichJobDescriptionRenderer: React.FC<RichJobDescriptionRendererProps> = ({
  content,
  className = "",
  fallbackText,
}) => {
  const rawText = content?.trim() || fallbackText?.trim() || "";

  if (!rawText) {
    return (
      <div className="text-slate-400 dark:text-slate-500 italic text-xs">
        No job description details provided.
      </div>
    );
  }

  // If content contains rich HTML tags from the WYSIWYG editor
  if (/<[a-z][\s\S]*>/i.test(rawText)) {
    return (
      <div
        className={`prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 [&_h2]:text-base [&_h2]:sm:text-lg [&_h2]:font-bold [&_h2]:text-slate-900 dark:[&_h2]:text-slate-100 [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:pb-1 [&_h2]:border-b [&_h2]:border-slate-100 dark:[&_h2]:border-slate-800 [&_h3]:text-sm [&_h3]:sm:text-base [&_h3]:font-bold [&_h3]:text-slate-900 dark:[&_h3]:text-slate-100 [&_h3]:mt-3 [&_h3]:mb-1 [&_h4]:text-xs [&_h4]:sm:text-sm [&_h4]:font-bold [&_h4]:text-slate-900 dark:[&_h4]:text-slate-100 [&_h4]:mt-2.5 [&_h4]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2 [&_ol]:space-y-1.5 [&_blockquote]:border-l-4 [&_blockquote]:border-orange-500 [&_blockquote]:bg-orange-500/5 dark:[&_blockquote]:bg-orange-950/20 [&_blockquote]:p-3.5 [&_blockquote]:my-3 [&_blockquote]:rounded-r-xl [&_blockquote]:italic [&_blockquote]:text-slate-700 dark:[&_blockquote]:text-slate-300 [&_hr]:my-4 [&_hr]:border-slate-200 dark:[&_hr]:border-slate-800 [&_a]:text-orange-600 dark:[&_a]:text-orange-400 [&_a]:underline [&_strong]:text-slate-900 dark:[&_strong]:text-slate-100 [&_strong]:font-bold [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-slate-100 dark:[&_code]:bg-slate-800 [&_code]:text-orange-600 dark:[&_code]:text-orange-400 [&_code]:font-mono [&_code]:text-[11.5px] ${className}`}
        dangerouslySetInnerHTML={{ __html: rawText }}
      />
    );
  }

  // Fallback: Parse inline markdown formatting (bold, italic, underline, strike, code, links)
  const renderInlineFormattedText = (text: string): React.ReactNode => {
    if (!text) return null;

    const tokens: React.ReactNode[] = [];
    const regex =
      /(\[.*?\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+|\*\*.*?\*\*|__.*?__|~~.*?~~|<u>.*?<\/u>|<b>.*?<\/b>|<strong>.*?<\/strong>|<i>.*?<\/i>|<em>.*?<\/em>|`.*?`|\*.*?\*|_.*?_)/gi;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push(text.substring(lastIndex, match.index));
      }
      const token = match[0];

      if (token.startsWith("[") && token.includes("](")) {
        const label = token.substring(1, token.indexOf("]("));
        const url = token.substring(token.indexOf("](") + 2, token.length - 1);
        tokens.push(
          <a
            key={match.index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
          >
            {label}
          </a>,
        );
      } else if (token.startsWith("http://") || token.startsWith("https://")) {
        tokens.push(
          <a
            key={match.index}
            href={token}
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 dark:text-orange-400 hover:underline font-semibold break-all"
          >
            {token}
          </a>,
        );
      } else if (token.startsWith("<u>") && token.endsWith("</u>")) {
        const inner = token.substring(3, token.length - 4);
        tokens.push(
          <u key={match.index} className="underline decoration-orange-400">
            {renderInlineFormattedText(inner)}
          </u>,
        );
      } else if (
        (token.startsWith("<b>") && token.endsWith("</b>")) ||
        (token.startsWith("<strong>") && token.endsWith("</strong>"))
      ) {
        const inner = token.replace(/<\/?(b|strong)>/gi, "");
        tokens.push(
          <strong key={match.index} className="font-bold text-slate-900 dark:text-slate-100">
            {renderInlineFormattedText(inner)}
          </strong>,
        );
      } else if (
        (token.startsWith("<i>") && token.endsWith("</i>")) ||
        (token.startsWith("<em>") && token.endsWith("</em>"))
      ) {
        const inner = token.replace(/<\/?(i|em)>/gi, "");
        tokens.push(
          <em key={match.index} className="italic text-slate-800 dark:text-slate-200">
            {renderInlineFormattedText(inner)}
          </em>,
        );
      } else if (
        (token.startsWith("**") && token.endsWith("**") && token.length >= 4) ||
        (token.startsWith("__") && token.endsWith("__") && token.length >= 4)
      ) {
        const inner = token.substring(2, token.length - 2);
        tokens.push(
          <strong key={match.index} className="font-bold text-slate-900 dark:text-slate-100">
            {renderInlineFormattedText(inner)}
          </strong>,
        );
      } else if (token.startsWith("~~") && token.endsWith("~~")) {
        const inner = token.substring(2, token.length - 2);
        tokens.push(
          <del key={match.index} className="line-through text-slate-400">
            {renderInlineFormattedText(inner)}
          </del>,
        );
      } else if (token.startsWith("`") && token.endsWith("`") && token.length >= 2) {
        const inner = token.substring(1, token.length - 1);
        tokens.push(
          <code
            key={match.index}
            className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-mono text-[11.5px] border border-slate-200/80 dark:border-slate-700"
          >
            {inner}
          </code>,
        );
      } else if (
        (token.startsWith("*") && token.endsWith("*") && token.length >= 2) ||
        (token.startsWith("_") && token.endsWith("_") && token.length >= 2)
      ) {
        const inner = token.substring(1, token.length - 1);
        tokens.push(
          <em key={match.index} className="italic text-slate-800 dark:text-slate-200">
            {renderInlineFormattedText(inner)}
          </em>,
        );
      } else {
        tokens.push(token);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push(text.substring(lastIndex));
    }

    return tokens.length > 0 ? tokens : text;
  };

  // Process markdown blocks: Headings, bullet lists, numbered lists, blockquotes, horizontal rules, paragraphs
  const lines = rawText.split(/\r?\n/);
  const elements: React.ReactNode[] = [];
  let currentList: { type: "bullet" | "number"; items: string[] } | null = null;
  let currentQuote: string[] | null = null;

  const flushList = (key: string) => {
    if (currentList && currentList.items.length > 0) {
      if (currentList.type === "number") {
        elements.push(
          <ol
            key={`ol-${key}`}
            className="list-decimal list-outside ml-6 space-y-2 my-3 text-slate-700 dark:text-slate-300"
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed pl-1">
                {renderInlineFormattedText(item)}
              </li>
            ))}
          </ol>,
        );
      } else {
        elements.push(
          <ul key={`ul-${key}`} className="space-y-2 my-3 text-slate-700 dark:text-slate-300">
            {currentList.items.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-relaxed">
                <span className="text-orange-500 font-bold text-base leading-none select-none shrink-0 mt-0.5">
                  •
                </span>
                <span className="flex-1">{renderInlineFormattedText(item)}</span>
              </li>
            ))}
          </ul>,
        );
      }
      currentList = null;
    }
  };

  const flushQuote = (key: string) => {
    if (currentQuote && currentQuote.length > 0) {
      elements.push(
        <blockquote
          key={`quote-${key}`}
          className="p-3.5 my-3 bg-orange-500/5 dark:bg-orange-950/20 border-l-4 border-orange-500 rounded-r-xl text-slate-700 dark:text-slate-300 italic space-y-1.5"
        >
          {currentQuote.map((q, idx) => (
            <p key={idx} className="leading-relaxed">
              {renderInlineFormattedText(q)}
            </p>
          ))}
        </blockquote>,
      );
      currentQuote = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`blank-${index}`);
      flushQuote(`blank-${index}`);
      return;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      flushList(`div-${index}`);
      flushQuote(`div-${index}`);
      elements.push(
        <hr key={`hr-${index}`} className="my-4 border-slate-200 dark:border-slate-800" />,
      );
      return;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList(`h-${index}`);
      flushQuote(`h-${index}`);
      const level = headingMatch[1].length;
      const headingContent = headingMatch[2];

      if (level === 1) {
        elements.push(
          <h2
            key={`h1-${index}`}
            className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 pt-3 pb-1 border-b border-slate-200 dark:border-slate-800 tracking-tight"
          >
            {renderInlineFormattedText(headingContent)}
          </h2>,
        );
      } else if (level === 2) {
        elements.push(
          <h3
            key={`h2-${index}`}
            className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 pt-2.5 pb-0.5 tracking-tight"
          >
            {renderInlineFormattedText(headingContent)}
          </h3>,
        );
      } else {
        elements.push(
          <h4
            key={`h3-${index}`}
            className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 pt-2"
          >
            {renderInlineFormattedText(headingContent)}
          </h4>,
        );
      }
      return;
    }

    if (trimmed.startsWith(">")) {
      flushList(`q-${index}`);
      const quoteText = trimmed.replace(/^>\s*/, "");
      if (!currentQuote) currentQuote = [];
      currentQuote.push(quoteText);
      return;
    } else {
      flushQuote(`q-end-${index}`);
    }

    const bulletMatch = trimmed.match(/^([•+*▪▫—–-]|👉|✅|⚡|🚀|📌|💡|🎯|✨|🔥|✔️)\s*(.*)$/);
    if (bulletMatch && bulletMatch[2]) {
      if (!currentList || currentList.type !== "bullet") {
        flushList(`b-switch-${index}`);
        currentList = { type: "bullet", items: [] };
      }
      currentList.items.push(bulletMatch[2]);
      return;
    }

    const numberMatch = trimmed.match(/^(\d+[.)])\s*(.*)$/);

    if (numberMatch && numberMatch[2]) {
      if (!currentList || currentList.type !== "number") {
        flushList(`n-switch-${index}`);
        currentList = { type: "number", items: [] };
      }
      currentList.items.push(numberMatch[2]);
      return;
    }

    flushList(`p-${index}`);
    flushQuote(`p-${index}`);

    elements.push(
      <p
        key={`p-${index}`}
        className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans"
      >
        {renderInlineFormattedText(trimmed)}
      </p>,
    );
  });

  flushList("final");
  flushQuote("final");

  return (
    <div className={`space-y-3 text-xs sm:text-sm leading-relaxed ${className}`}>{elements}</div>
  );
};
