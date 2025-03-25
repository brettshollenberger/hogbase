import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';

const theme = {
  plain: {
    color: '#F8F8F2',
    backgroundColor: '#282A36',
  },
  styles: [
    {
      types: ['prolog', 'constant', 'builtin'],
      style: {
        color: '#FF79C6',
      },
    },
    {
      types: ['inserted', 'function'],
      style: {
        color: '#50FA7B',
      },
    },
    {
      types: ['deleted'],
      style: {
        color: '#FF5555',
      },
    },
    {
      types: ['changed'],
      style: {
        color: '#FFB86C',
      },
    },
    {
      types: ['punctuation', 'symbol'],
      style: {
        color: '#F8F8F2',
      },
    },
    {
      types: ['string', 'char', 'tag', 'selector'],
      style: {
        color: '#FF79C6',
      },
    },
    {
      types: ['keyword', 'variable'],
      style: {
        color: '#BD93F9',
        fontStyle: 'italic',
      },
    },
    {
      types: ['comment'],
      style: {
        color: '#6272A4',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: '#50FA7B',
      },
    },
  ],
};

export default function CodeBlock({ children, className }) {
  const language = className?.replace(/language-/, '') || 'typescript';

  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={children.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={className} style={{ ...style, padding: '1rem', borderRadius: '0.5rem' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
}
