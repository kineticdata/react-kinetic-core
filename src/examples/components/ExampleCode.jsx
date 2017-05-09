import React from 'react';
import CodeMirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';

export const ExampleCode = ({ code, options = {} }) => {
  const finalOptions = { ...options, mode: 'javascript', theme: 'material', viewportMargin: Infinity };
  return (
    <CodeMirror
      value={code}
      options={finalOptions}
    />
  );
};
