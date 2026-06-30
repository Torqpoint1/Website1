import { Fragment } from 'react';

/**
 * Renders *asterisk-wrapped* spans as <em>, leaving the rest as plain text.
 * Lets the service copy keep the occasional italic emphasis from the brief
 * without resorting to dangerouslySetInnerHTML.
 */
export function withEmphasis(text: string): React.ReactNode {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
      <em key={i}>{part.slice(1, -1)}</em>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  );
}
