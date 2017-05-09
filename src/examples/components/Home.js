import React, { Component } from 'react';
// eslint-disable-next-line
import { CoreModal, CoreModalHeader, CoreModalFooter, CoreModalBody } from 'react-kinetic-core';
import { ExampleCode } from './ExampleCode';

import './modal.scss';

const controlledModal =
`import { CoreModal, CoreModalHeader, CoreModalBody, CoreModalFooter} from 'react-kinetic-core';

// Controlled modal component
class ControlledModal extends Component {
  render() {
    return (
      <CoreModal visible={this.state.visible} dismissed={this.toggle}>
        <CoreModalHeader>Header</CoreModalHeader>
        <CoreModalBody>
          This is the modal body.
        </CoreModalBody>
        <CoreModalFooter><button onClick={this.toggle}>Close</button></CoreModalFooter>
      </CoreModal>
    );
  }
}`;

const modalProperties =
`CoreModal.propTypes = {
  visible: PropTypes.bool,      // If not provided modal defaults to hidden.
  dismissed: PropTypes.func,    // Called when modal is dismissed (overlay or keyboard).
  size: PropTypes.string,       // Valid options: sm, md, or lg.
};

CoreModalHeader.propTypes = {}; // Only takes children.
CoreModalBody.propTypes = {};   // Only takes children.
CoreModalFooter.propTypes = {}; // Only takes children.
`;

export class Home extends Component {
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);

    this.state = {
      visible: false,
    };
  }

  toggle() {
    this.setState({ visible: !this.state.visible });
  }

  render() {
    return (
      <div>
        <h2>Core Modal</h2>

        <p>
          The <strong>CoreModal</strong> is used to create a generic modal dialog class
          which can be easily be customized, blah blah blah.
        </p>

        <h3>Demo</h3>
        <button onClick={this.toggle}>Show Modal</button>
        <CoreModal visible={this.state.visible} dismissed={this.toggle}>
          <CoreModalHeader>Header</CoreModalHeader>
          <CoreModalBody>
            This is the modal body.
          </CoreModalBody>
          <CoreModalFooter><button onClick={this.toggle}>Close</button></CoreModalFooter>
        </CoreModal>

        <h3>Example</h3>

        <ExampleCode code={controlledModal} />

        <h3>Properties</h3>
        <ExampleCode code={modalProperties} />
      </div>
    );
  }
}
