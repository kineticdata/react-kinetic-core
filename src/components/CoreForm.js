import React, { PureComponent } from 'react';
import { bundle, K } from '../core-helpers';

const formPath = (formSlug, kappSlug) =>
  `${bundle.spaceLocation()}/${kappSlug || bundle.kappSlug()}/${formSlug}`;

const submissionPath = submissionId =>
  `${bundle.spaceLocation()}/submissions/${submissionId}`;

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
    const { submission, kapp, form } = this.props;
    const path = this.submission ? submissionPath(submission) : formPath(form, kapp);
    this.form = new Promise(
      (resolve) => {
        K.load({
          path: this.props.review ? `${path}?review` : path,
          container: this.container,
          loaded: (formData) => {
            resolve(formData);
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
