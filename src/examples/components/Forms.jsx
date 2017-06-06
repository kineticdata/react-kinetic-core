import React from 'react';
import { ExampleCode } from './ExampleCode';

const coreFormExample = `
  import { CoreForm } from 'react-kinetic-core';
`;

const coreFormProperties = `
CoreForm.propTypes = {
  submission: PropTypes.string,
  form: PropTypes.string,
  kapp: PropTypes.string,
  review: PropTypes.bool,
  loaded: PropTypes.func,
  unauthorized: PropTypes.func,
  forbidden: PropTypes.func,
  notFound: PropTypes.func,
  error: PropTypes.func,
  created: PropTypes.func,
  updated: PropTypes.func,
  completed: PropTypes.func,
};
`;
export const Forms = () => (
  <div>
    <h2>Core Forms</h2>

    <p>The <strong>CoreForm</strong> component is used to load Kinetic forms and submissions
      into your React bundle.
    </p>

    <h3>Example</h3>

    <ExampleCode code={coreFormExample} />

    <h3>Properties</h3>
    <ExampleCode code={coreFormProperties} />
  </div>
);
