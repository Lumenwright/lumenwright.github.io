import React from 'react';

/**
 * Parses a string containing **bold** markers into React nodes.
 * Text wrapped in double asterisks is rendered as <strong>.
 * Example: "Versatile **senior Unity developer**" → "Versatile <strong>senior Unity developer</strong>"
 */
export function parseInlineBold(text: string): React.ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith('**')
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : part
  );
}
