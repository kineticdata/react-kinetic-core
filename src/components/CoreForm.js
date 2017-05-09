import React, { Component } from 'react';
import { bundle, K } from '../core-helpers';

const formPath = (formSlug, kappSlug) =>
  `${bundle.spaceLocation()}/${kappSlug || bundle.kappSlug()}/${formSlug}`;

const submissionPath = submissionId =>
  `${bundle.spaceLocation()}/submissions/${submissionId}`;

export class CoreForm extends Component {
  componentDidMount() {
    const path = this.props.submission
      ? submissionPath(this.props.submission)
      : formPath(this.props.form, this.props.kapp);
    K.load({
      path: this.props.review ? `${path}?review` : path,
      container: this.container,
      loaded: (form) => {
        this.form = form;
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
  }

  componentWillUnmount() {
    this.form.close();
  }

  render() {
    return <div ref={(element) => { this.container = element; }} />;
  }
}
