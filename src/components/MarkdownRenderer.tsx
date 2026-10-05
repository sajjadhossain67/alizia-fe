'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface MarkdownRendererProps {
  content: string;
  isLive?: boolean;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isLive = false }) => {
  if (!content) return null;

  // Clean boilerplate or robotic prompt-engineer prefixes
  const cleanContent = (text: string) => {
    let cleaned = text;
    if (/User Intent:\s*/i.test(cleaned) || /Reasoning:\s*.*1\s*\+/i.test(cleaned)) {
      const resultMatch = cleaned.match(/(?:Result|Answer):\s*([\s\S]+)$/i);
      if (resultMatch && resultMatch[1].trim()) {
        cleaned = resultMatch[1].trim();
      } else {
        cleaned = cleaned.replace(/^(?:User Intent|Reasoning|Planning|Tools|Execution|Verification):\s*.*(?:\n|$)/gim, '').trim();
      }
    }
    return cleaned;
  };

  const text = cleanContent(content);

  // Split content by code blocks ```lang ... ```
  const codeBlockRegex = /```([a-zA-Z0-9_\-#+.]*)\n([\s\S]*?)```/g;
  const parts: { type: 'text' | 'code'; content: string; language?: string }[] = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
    }
    parts.push({
      type: 'code',
      language: match[1].trim() || 'plaintext',
      content: match[2].replace(/\n$/, '')
    });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.substring(lastIndex) });
  }

  return (
    <div className="markdown-body">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return (
            <CodeBlock
              key={`code-${index}`}
              language={part.language || 'plaintext'}
              code={part.content}
            />
          );
        }
        return <FormattedTextBlock key={`text-${index}`} text={part.content} />;
      })}
      {isLive && <span className="typing-cursor" />}
    </div>
  );
};

const CodeBlock: React.FC<{ language: string; code: string }> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block-container my-4 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-tertiary)]">
      <div className="code-block-header flex items-center justify-between px-4 py-2 bg-[var(--bg-elevated)] border-b border-[var(--border-subtle)]">
        <span className="code-lang-label text-xs font-mono uppercase tracking-wider text-[var(--text-tertiary)]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="code-copy-btn flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-1 px-2 rounded-md hover:bg-[var(--bg-tertiary)]"
          title="Copy code"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-[13.5px] font-mono leading-relaxed text-[var(--text-primary)]">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

const FormattedTextBlock: React.FC<{ text: string }> = ({ text }) => {
  // Render tables, headings, lists, bold, italics, links, and paragraphs
  const renderSimpleMarkdown = (raw: string) => {
    // 1. Tables (| col | col |)
    if (raw.includes('|') && raw.includes('---')) {
      const lines = raw.trim().split('\n');
      const tableRows: string[][] = [];
      let isHeader = true;

      for (const line of lines) {
        if (line.includes('---')) {
          isHeader = false;
          continue;
        }
        if (line.startsWith('|') && line.endsWith('|')) {
          const cells = line.split('|').slice(1, -1).map(c => c.trim());
          tableRows.push(cells);
        }
      }

      if (tableRows.length > 0) {
        return (
          <div className="overflow-x-auto my-3">
            <table className="w-full border-collapse border border-[var(--border-subtle)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  {tableRows[0].map((h, i) => (
                    <th key={i} className="border border-[var(--border-subtle)] px-3 py-2 text-left text-xs font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.slice(1).map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-[var(--bg-secondary)] transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="border border-[var(--border-subtle)] px-3 py-2 text-sm">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    const paragraphs = raw.split(/\n\s*\n/);

    return (
      <>
        {paragraphs.map((para, pIdx) => {
          const trimmed = para.trim();
          if (!trimmed) return null;

          // Headings
          if (trimmed.startsWith('#### ')) {
            return <h4 key={pIdx} className="text-base font-semibold mt-4 mb-2">{trimmed.slice(5)}</h4>;
          }
          if (trimmed.startsWith('### ')) {
            return <h3 key={pIdx} className="text-lg font-bold mt-4 mb-2 text-[var(--accent-cyan)]">{trimmed.slice(4)}</h3>;
          }
          if (trimmed.startsWith('## ')) {
            return <h2 key={pIdx} className="text-xl font-bold mt-5 mb-2.5">{trimmed.slice(3)}</h2>;
          }
          if (trimmed.startsWith('# ')) {
            return <h1 key={pIdx} className="text-2xl font-extrabold mt-6 mb-3">{trimmed.slice(2)}</h1>;
          }

          // Blockquote
          if (trimmed.startsWith('> ')) {
            return (
              <blockquote key={pIdx} className="border-l-4 border-[var(--accent-purple)] pl-4 py-1.5 my-3 italic text-[var(--text-secondary)] bg-[var(--bg-tertiary)]/30 rounded-r-lg">
                {trimmed.slice(2)}
              </blockquote>
            );
          }

          // Lists
          const lines = trimmed.split('\n');
          const isUnordered = lines.every(l => /^\s*[-*+]\s+/.test(l));
          const isOrdered = lines.every(l => /^\s*\d+\.\s+/.test(l));

          if (isUnordered) {
            return (
              <ul key={pIdx} className="list-disc pl-6 my-2.5 space-y-1 text-sm leading-relaxed">
                {lines.map((l, i) => (
                  <li key={i}>{parseInline(l.replace(/^\s*[-*+]\s+/, ''))}</li>
                ))}
              </ul>
            );
          }

          if (isOrdered) {
            return (
              <ol key={pIdx} className="list-decimal pl-6 my-2.5 space-y-1 text-sm leading-relaxed">
                {lines.map((l, i) => (
                  <li key={i}>{parseInline(l.replace(/^\s*\d+\.\s+/, ''))}</li>
                ))}
              </ol>
            );
          }

          return (
            <p key={pIdx} className="my-2 text-[14.5px] leading-relaxed">
              {lines.map((line, lIdx) => (
                <React.Fragment key={lIdx}>
                  {parseInline(line)}
                  {lIdx < lines.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
          );
        })}
      </>
    );
  };

  // Helper for bold, italic, inline code, and links
  const parseInline = (str: string): React.ReactNode => {
    // Regex for inline code `code`, bold **text**, and markdown links [text](url)
    const tokens: React.ReactNode[] = [];
    let remaining = str;
    let keyIdx = 0;

    while (remaining.length > 0) {
      // Inline code
      const codeMatch = remaining.match(/`([^`]+)`/);
      // Bold
      const boldMatch = remaining.match(/\*\*([^*]+)\*\*/);
      // Link
      const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);

      let earliestMatch: { type: 'code' | 'bold' | 'link'; index: number; match: RegExpMatchArray } | null = null;

      if (codeMatch && codeMatch.index !== undefined) {
        earliestMatch = { type: 'code', index: codeMatch.index, match: codeMatch };
      }
      if (boldMatch && boldMatch.index !== undefined && (!earliestMatch || boldMatch.index < earliestMatch.index)) {
        earliestMatch = { type: 'bold', index: boldMatch.index, match: boldMatch };
      }
      if (linkMatch && linkMatch.index !== undefined && (!earliestMatch || linkMatch.index < earliestMatch.index)) {
        earliestMatch = { type: 'link', index: linkMatch.index, match: linkMatch };
      }

      if (!earliestMatch) {
        tokens.push(remaining);
        break;
      }

      if (earliestMatch.index > 0) {
        tokens.push(remaining.substring(0, earliestMatch.index));
      }

      if (earliestMatch.type === 'code') {
        tokens.push(
          <code key={`code-${keyIdx++}`} className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] font-mono text-[13px] text-[var(--accent-cyan)]">
            {earliestMatch.match[1]}
          </code>
        );
      } else if (earliestMatch.type === 'bold') {
        tokens.push(
          <strong key={`bold-${keyIdx++}`} className="font-semibold text-[var(--text-primary)]">
            {earliestMatch.match[1]}
          </strong>
        );
      } else if (earliestMatch.type === 'link') {
        tokens.push(
          <a
            key={`link-${keyIdx++}`}
            href={earliestMatch.match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-cyan)] underline hover:text-[var(--accent-purple)] transition-colors"
          >
            {earliestMatch.match[1]}
          </a>
        );
      }

      remaining = remaining.substring(earliestMatch.index + earliestMatch.match[0].length);
    }

    return <>{tokens}</>;
  };

  return <>{renderSimpleMarkdown(text)}</>;
};
