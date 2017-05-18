import React from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/shell/shell';

const DEFAULT_OPTIONS = {
  mode: 'javascript',
  theme: 'material',
  viewportMargin: Infinity,
};

export const ExampleCode = ({ code, options = {} }) => {
  const finalOptions = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  return (
    <CodeMirror
      value={code}
      options={finalOptions}
    />
  );
};
