import React, { useState } from 'react';
import DOMPurify from 'dompurify';

interface Props {
  content: string;
  svg?: string;
  onTryCode?: (code: string, language: string) => void;
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  'n': 'ⁿ',
  'k': 'ᵏ',
  'i': 'ⁱ',
  'T': 'ᵀ',
};

const SUBSCRIPT_MAP: Record<string, string> = {
  '0': '₀',
  '1': '₁',
  '2': '₂',
  '3': '₃',
  '4': '₄',
  '5': '₅',
  '6': '₆',
  '7': '₇',
  '8': '₈',
  '9': '₉',
  'i': 'ᵢ',
  'j': 'ⱼ',
  'k': 'ₖ',
  'n': 'ₙ',
};

/**
 * Converts raw LaTeX math strings (e.g. "$0.2\text{--}0.5\,\mu\text{s}$" or "O(N \log N)")
 * into clean, readable mathematical typography ("0.2–0.5 μs", "O(N log N)").
 */
export const formatLatexMath = (raw: string): string => {
  let out = raw.trim();
  // Strip outer $ or $$ delimiters if passed
  if (out.startsWith('$$') && out.endsWith('$$')) {
    out = out.slice(2, -2).trim();
  } else if (out.startsWith('$') && out.endsWith('$')) {
    out = out.slice(1, -1).trim();
  }

  // Handle \frac{a}{b} -> (a / b)
  out = out.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');
  // Handle \sqrt{x} -> √(x)
  out = out.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  // Handle \text{...} or \mathrm{...} or \mathbf{...}
  out = out.replace(/\\(?:text|mathrm|mathbf|mathit|operatorname)\{([^{}]*)\}/g, '$1');

  // Replace common LaTeX symbols & Greek letters
  const replacements: [RegExp, string][] = [
    [/--/g, '–'],
    [/\\,/g, ' '],
    [/\\;/g, ' '],
    [/\\!/g, ''],
    [/\\quad/g, '  '],
    [/\\qquad/g, '   '],
    [/\\mu/g, 'μ'],
    [/\\alpha/g, 'α'],
    [/\\beta/g, 'β'],
    [/\\gamma/g, 'γ'],
    [/\\delta/g, 'δ'],
    [/\\Delta/g, 'Δ'],
    [/\\epsilon/g, 'ε'],
    [/\\theta/g, 'θ'],
    [/\\Theta/g, 'Θ'],
    [/\\lambda/g, 'λ'],
    [/\\pi/g, 'π'],
    [/\\sigma/g, 'σ'],
    [/\\Sigma/g, 'Σ'],
    [/\\omega/g, 'ω'],
    [/\\Omega/g, 'Ω'],
    [/\\times/g, '×'],
    [/\\cdot/g, '·'],
    [/\\div/g, '÷'],
    [/\\pm/g, '±'],
    [/\\le(?:q)?/g, '≤'],
    [/\\ge(?:q)?/g, '≥'],
    [/\\ne(?:q)?/g, '≠'],
    [/\\approx/g, '≈'],
    [/\\equiv/g, '≡'],
    [/\\infty/g, '∞'],
    [/\\to\b/g, '→'],
    [/\\rightarrow/g, '→'],
    [/\\leftarrow/g, '←'],
    [/\\leftrightarrow/g, '↔'],
    [/\\Rightarrow/g, '⇒'],
    [/\\iff/g, '⇔'],
    [/\\sum/g, '∑'],
    [/\\prod/g, '∏'],
    [/\\log/g, 'log'],
    [/\\ln/g, 'ln'],
    [/\\min/g, 'min'],
    [/\\max/g, 'max'],
    [/\\lfloor/g, '⌊'],
    [/\\rfloor/g, '⌋'],
    [/\\lceil/g, '⌈'],
    [/\\rceil/g, '⌉'],
    [/\\{/g, '{'],
    [/\\}/g, '}'],
    [/\\%/g, '%'],
  ];

  for (const [pattern, replacement] of replacements) {
    out = out.replace(pattern, replacement);
  }

  // Convert ^{...} and ^x superscripts
  out = out.replace(/\^\{([^{}]+)\}/g, (_, exp: string) => {
    const mapped = exp
      .split('')
      .map((ch) => SUPERSCRIPT_MAP[ch] || '')
      .join('');
    return mapped.length === exp.length ? mapped : `^(${exp})`;
  });
  out = out.replace(/\^([0-9nkiT+-])/g, (_, ch: string) => SUPERSCRIPT_MAP[ch] || `^${ch}`);

  // Convert _{...} and _x subscripts
  out = out.replace(/_\{([^{}]+)\}/g, (_, sub: string) => {
    const mapped = sub
      .split('')
      .map((ch) => SUBSCRIPT_MAP[ch] || '')
      .join('');
    return mapped.length === sub.length ? mapped : `_${sub}`;
  });
  out = out.replace(/_([0-9ijkn])/g, (_, ch: string) => SUBSCRIPT_MAP[ch] || `_${ch}`);

  // Clean up any leftover backslashes before word characters
  out = out.replace(/\\([a-zA-Z]+)/g, '$1');

  return out.replace(/\s+/g, ' ').trim();
};

const isTableRowLine = (line: string): boolean => {
  const t = line.trim();
  return t.startsWith('|') && t.endsWith('|') && t.length > 2;
};

const isAlignmentRow = (cells: string[]): boolean => {
  return cells.length > 0 && cells.every((c) => /^:?-{2,}:?$/.test(c.trim()));
};

const splitTableCells = (line: string): string[] => {
  const trimmed = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  return trimmed.split('|').map((cell) => cell.trim());
};

export const parseMarkdownTableBlock = (
  tableLines: string[]
): { headers: string[]; rows: string[][] } | null => {
  const validLines = tableLines.filter((l) => isTableRowLine(l));
  if (validLines.length < 2) return null;

  const parsedRows = validLines.map(splitTableCells);
  const headers = parsedRows[0];
  const bodyRows = parsedRows.slice(1).filter((r) => !isAlignmentRow(r));

  if (headers.length === 0 || bodyRows.length === 0) return null;
  return { headers, rows: bodyRows };
};

const MarkdownRenderer: React.FC<Props> = ({ content, svg, onTryCode }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!content && !svg) return null;

  const handleCopy = (code: string, idx: number) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code.trim()).catch(() => {});
    }
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const renderInlineTokens = (text: string) => {
    // Match **bold**, `code`, or $inline math$
    const tokens = text.split(/(\*\*.*?\*\*|`[^`]+`|\$[^$\n]+\$)/g);
    return tokens.map((sub, j) => {
      if (!sub) return null;
      if (sub.startsWith('**') && sub.endsWith('**') && sub.length > 4) {
        return (
          <strong key={j} className="text-white font-semibold">
            {renderInlineTokens(sub.slice(2, -2))}
          </strong>
        );
      }
      if (sub.startsWith('`') && sub.endsWith('`') && sub.length > 2) {
        return (
          <code
            key={j}
            className="bg-slate-800/95 border border-slate-700/80 px-1.5 py-0.5 rounded text-emerald-300 text-[13px] font-mono break-words"
          >
            {sub.slice(1, -1)}
          </code>
        );
      }
      if (sub.startsWith('$') && sub.endsWith('$') && sub.length > 2) {
        const formatted = formatLatexMath(sub);
        return (
          <span
            key={j}
            className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[13px] font-semibold tabular-nums"
          >
            {formatted}
          </span>
        );
      }
      return sub;
    });
  };

  const renderMarkdownBlock = (rawText: string, blockKey: number) => {
    const lines = rawText.split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        i++;
        continue;
      }

      // 1. Block Math $$ ... $$
      if (trimmed.startsWith('$$')) {
        let mathContent = trimmed;
        if (!trimmed.endsWith('$$') || trimmed === '$$') {
          const mathLines: string[] = [trimmed.replace(/^\$\$/, '')];
          i++;
          while (i < lines.length && !lines[i].trim().endsWith('$$')) {
            mathLines.push(lines[i]);
            i++;
          }
          if (i < lines.length) {
            mathLines.push(lines[i].trim().replace(/\$\$$/, ''));
          }
          mathContent = mathLines.join(' ');
        }
        const cleanMath = formatLatexMath(mathContent);
        elements.push(
          <div
            key={`math-${blockKey}-${i}`}
            className="my-4 p-4 rounded-xl bg-[#0d1526] border border-slate-800 flex items-center justify-between gap-4 overflow-x-auto"
          >
            <code className="font-mono text-sm sm:text-base font-bold text-amber-300 tracking-wide">
              {cleanMath}
            </code>
            <span className="text-[11px] font-mono text-slate-400 shrink-0">Formula</span>
          </div>
        );
        i++;
        continue;
      }

      // 2. Markdown Table Detection (handles consecutive pipe rows AND blank-line-separated pipe rows)
      if (isTableRowLine(trimmed)) {
        const tableLines: string[] = [trimmed];
        let cursor = i + 1;
        while (cursor < lines.length) {
          const nextTrimmed = lines[cursor].trim();
          if (isTableRowLine(nextTrimmed)) {
            tableLines.push(nextTrimmed);
            cursor++;
          } else if (
            nextTrimmed === '' &&
            cursor + 1 < lines.length &&
            isTableRowLine(lines[cursor + 1].trim())
          ) {
            // Skip single blank lines between markdown table rows
            cursor++;
          } else {
            break;
          }
        }

        const parsedTable = parseMarkdownTableBlock(tableLines);
        if (parsedTable) {
          elements.push(
            <div
              key={`table-${blockKey}-${i}`}
              className="my-5 overflow-x-auto rounded-xl border border-slate-800 bg-[#0d1424] shadow-lg"
            >
              <div className="px-4 py-2 bg-[#121c32] border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Structured Engineering Benchmark &amp; Reference
                </span>
                <span className="text-[11px] font-mono text-emerald-400">
                  {parsedTable.rows.length} {parsedTable.rows.length === 1 ? 'Row' : 'Rows'}
                </span>
              </div>
              <table className="w-full text-left border-collapse text-xs sm:text-[13px]">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300">
                    {parsedTable.headers.map((header, hIdx) => (
                      <th
                        key={hIdx}
                        className="py-2.5 px-4 font-semibold tracking-tight text-white whitespace-nowrap"
                      >
                        {renderInlineTokens(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {parsedTable.rows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className="hover:bg-slate-800/40 transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`py-2.5 px-4 leading-relaxed tabular-nums ${
                            cIdx === 0
                              ? 'font-semibold text-white whitespace-nowrap'
                              : 'text-slate-200'
                          }`}
                        >
                          {renderInlineTokens(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          i = cursor;
          continue;
        }
      }

      // 3. Horizontal Rule
      if (trimmed === '---' || trimmed === '***') {
        elements.push(<hr key={`hr-${blockKey}-${i}`} className="border-slate-800/80 my-6" />);
        i++;
        continue;
      }

      // 4. Headings
      if (trimmed.startsWith('# ')) {
        elements.push(
          <h1
            key={`h1-${blockKey}-${i}`}
            className="text-xl sm:text-2xl font-bold text-white mt-4 mb-3 tracking-tight"
          >
            {renderInlineTokens(trimmed.slice(2))}
          </h1>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2
            key={`h2-${blockKey}-${i}`}
            className="text-base sm:text-lg font-bold text-white mt-7 mb-2.5 pb-2 border-b border-slate-800/90"
          >
            {renderInlineTokens(trimmed.slice(3))}
          </h2>
        );
        i++;
        continue;
      }
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3
            key={`h3-${blockKey}-${i}`}
            className="text-sm sm:text-base font-bold text-emerald-400 mt-5 mb-1.5"
          >
            {renderInlineTokens(trimmed.slice(4))}
          </h3>
        );
        i++;
        continue;
      }

      // 5. Blockquotes / Engineering Callout
      if (trimmed.startsWith('> ')) {
        elements.push(
          <div
            key={`quote-${blockKey}-${i}`}
            className="my-3 p-3.5 rounded-xl bg-[#10192b] border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed"
          >
            {renderInlineTokens(trimmed.slice(2))}
          </div>
        );
        i++;
        continue;
      }

      // 6. Unordered List Item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        elements.push(
          <li
            key={`li-${blockKey}-${i}`}
            className="ml-5 list-disc marker:text-emerald-400 pl-1 leading-relaxed"
          >
            {renderInlineTokens(trimmed.slice(2))}
          </li>
        );
        i++;
        continue;
      }

      // 7. Ordered List Item
      const orderedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
      if (orderedMatch) {
        elements.push(
          <div key={`ol-${blockKey}-${i}`} className="flex items-start gap-2.5 pl-1">
            <span className="font-mono text-xs font-bold text-emerald-400 mt-1 shrink-0 tabular-nums">
              {orderedMatch[1]}.
            </span>
            <div className="leading-relaxed">{renderInlineTokens(orderedMatch[2])}</div>
          </div>
        );
        i++;
        continue;
      }

      // 8. Standard Paragraph
      elements.push(
        <p key={`p-${blockKey}-${i}`} className="leading-relaxed">
          {renderInlineTokens(line)}
        </p>
      );
      i++;
    }

    return (
      <div key={blockKey} className="space-y-2.5 text-slate-300 leading-relaxed text-[15px]">
        {elements}
      </div>
    );
  };

  const processContent = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w+)?\n([\s\S]*?)```/);
        const language = (match ? match[1] : '') || 'text';
        const code = (match ? match[2] : part.slice(3, -3)).trim();
        const isRunnable = [
          'python',
          'py',
          'javascript',
          'js',
          'typescript',
          'ts',
          'sql',
          'html',
          'css',
          'cpp',
          'c++',
          'java',
          'bash',
          'sh',
          'git'
        ].includes(language.toLowerCase());

        return (
          <div
            key={index}
            className="my-5 rounded-xl overflow-hidden bg-[#0b101b] border border-slate-800 shadow-lg"
          >
            <div className="bg-[#131c2e] px-4 py-2 text-xs text-slate-300 border-b border-slate-800 font-mono flex items-center justify-between gap-2">
              <span className="uppercase tracking-wider font-semibold text-emerald-400">
                {language === 'text' ? 'Architecture Diagram & Memory Trace' : `${language} Interactive Example`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(code, index)}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-[11px] font-sans font-medium whitespace-nowrap"
                >
                  {copiedIndex === index ? 'Copied' : 'Copy Code'}
                </button>
                {onTryCode && isRunnable && (
                  <button
                    type="button"
                    onClick={() => onTryCode(code, language.toLowerCase())}
                    className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors text-[11px] font-sans font-semibold whitespace-nowrap flex items-center gap-1"
                  >
                    <span>Try it Yourself</span>
                    <span aria-hidden="true">→</span>
                  </button>
                )}
              </div>
            </div>
            <pre className="p-4 overflow-x-auto text-[13px] font-mono text-slate-200 leading-relaxed">
              <code>{code}</code>
            </pre>
          </div>
        );
      }
      return renderMarkdownBlock(part, index);
    });
  };

  return (
    <div className="markdown-body">
      {svg && (
        <div className="my-5 p-4 sm:p-5 bg-[#0d1424] border border-slate-800 rounded-xl flex flex-col items-center">
          <div className="text-xs text-slate-300 font-semibold mb-3 w-full flex items-center justify-between border-b border-slate-800 pb-2">
            <span>System Architecture &amp; Execution Flow</span>
            <span className="text-[11px] font-mono text-emerald-400">Code It Out Blueprint</span>
          </div>
          <div
            className="w-full overflow-hidden rounded-lg [&>svg]:w-full [&>svg]:h-auto"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(svg) }}
          />
        </div>
      )}
      {processContent(content)}
    </div>
  );
};

export default React.memo(MarkdownRenderer);