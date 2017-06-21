import React, { PureComponent } from 'react';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import { bundle, K } from '../core-helpers';

const formPath = (formSlug, kappSlug) =>
  `${bundle.spaceLocation()}/${kappSlug || bundle.kappSlug()}/${formSlug}`;

const submissionPath = submissionId =>
  `${bundle.spaceLocation()}/submissions/${submissionId}`;

export const path = ({ submission, kapp, form }) =>
  submission ? submissionPath(submission) : formPath(form, kapp);

export const queryString = ({ review, values }) => {
  const parameters = [];
  if (review === true) {
    parameters.push('review');
  } else if (isString(review)) {
    parameters.push(`review=${encodeURIComponent(review)}`);
  }
  if (isPlainObject(values)) {
    Object.keys(values).forEach((field) => {
      parameters.push(`${encodeURIComponent(`values[${field}]`)}=${encodeURIComponent(values[field])}`);
    });
  }
  return parameters.join('&');
};

export class CoreForm extends PureComponent {
  componentDidMount() {
    this.loadForm();
  }

  componentDidUpdate() {
    this.form.then(form => form.close());
    this.loadForm();
  }

  componentWillUnmount() {
    this.form.then(form => form.close());
  }

  loadForm() {
    this.form = new Promise(
      (resolve) => {
        K.load({
          path: `${path(this.props)}?${queryString(this.props)}`,
          container: this.container,
          loaded: (form) => {
            resolve(form);
            if (typeof this.props.loaded === 'function') {
              this.props.loaded(form);
            }
          },
          unauthorized: this.props.unauthorized,
          forbidden: this.props.forbidden,
          notFound: this.props.notFound,
          error: this.props.error,
          created: this.props.created,
          updated: this.props.updated,
          completed: this.props.completed,
        });
      },
    );
  }

  render() {
    return <div ref={(element) => { this.container = element; }} />;
  }
}
