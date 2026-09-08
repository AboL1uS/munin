import React from 'react';

/**
 * Renders task text, parsing inline backtick code snippets (e.g. `extends`, `super`)
 * into stylish monospace code badges with dynamic theme colors.
 */
export function FormattedText({ text, completed }: { text: string; completed?: boolean }) {
  const parts = text.split(/(`[^`]+`)/g);

  return (
    <span
      className={`text-xs sm:text-sm leading-relaxed transition-colors ${
        completed
          ? 'line-through text-[var(--text-subtle)] opacity-60'
          : 'text-[var(--text-main)]'
      }`}
    >
      {parts.map((part, index) => {
        if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
          const codeContent = part.slice(1, -1);
          return (
            <code
              key={index}
              className={`inline-block px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs border ${
                completed
                  ? 'bg-[var(--bg-subtle)] border-[var(--border-subtle)] text-[var(--text-subtle)]'
                  : 'bg-[var(--bg-subtle)] border-[var(--border-card)] text-[var(--text-main)] font-medium shadow-none'
              }`}
            >
              {codeContent}
            </code>
          );
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}
