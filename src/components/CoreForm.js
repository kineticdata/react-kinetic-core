import React, { Component } from 'react';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import deepEqual from 'deepequal';
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

export const applyGuard = (func, context, args) =>
  typeof func === 'function' && func.apply(context, args);

export class CoreForm extends Component {
  constructor(props) {
    super(props);
    this.state = { pending: true, error: null };
  }

  componentDidMount() {
    this.loadForm(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!deepEqual(this.props, nextProps)) {
      this.closeForm();
      this.setState({ pending: true, error: null });
      this.loadForm(nextProps);
    }
  }

  componentWillUnmount() {
    this.closeForm();
  }

  getGlobalsPromise() {
    if (!this.globalsPromise) {
      if (typeof this.props.globals === 'function') {
        this.globalsPromise = this.props.globals();
      } else if (this.props.globals instanceof Promise) {
        this.globalsPromise = this.props.globals;
      } else {
        this.globalsPromise = Promise.resolve();
      }
    }
    return this.globalsPromise;
  }

  closeForm() {
    this.form.then(form => form.close());
  }

  loadForm(props) {
    this.form = new Promise(
      (resolve) => {
        this.getGlobalsPromise().then(() => {
          K.load({
            path: `${path(props)}?${queryString(props)}`,
            container: this.container,
            loaded: (form) => {
              resolve(form);
              this.setState({ pending: false });
              applyGuard(props.onLoaded || props.loaded, undefined, [form]);
            },
            unauthorized: (...args) => {
              this.setState({ error: 'unauthorized' });
              applyGuard(props.onUnauthorized || props.unauthorized, undefined, args);
            },
            forbidden: (...args) => {
              this.setState({ error: 'forbidden' });
              applyGuard(props.onForbidden || props.forbidden, undefined, args);
            },
            notFound: (...args) => {
              this.setState({ error: 'notFound' });
              applyGuard(props.onNotFound || props.notFound, undefined, args);
            },
            error: (...args) => {
              this.setState({ pending: false });
              applyGuard(props.onError || props.error, undefined, args);
            },
            created: props.onCreated || props.created,
            updated: props.onUpdated || props.updated,
            completed: props.onCompleted || props.completed,
          });
        });
      },
    );
  }

  render() {
    return (
      <div className="embedded-core-form">
        <div
          ref={(element) => { this.container = element; }}
          style={this.state.pending || this.state.error ? { display: 'none' } : {}}
        />
        {
          this.state.pending && this.props.pendingComponent &&
          <this.props.pendingComponent />
        }
        {
          this.state.error === 'unauthorized' && this.props.unauthorizedComponent &&
          <this.props.unauthorizedComponent />
        }
        {
          this.state.error === 'forbidden' && this.props.forbiddenComponent &&
          <this.props.forbiddenComponent />
        }
        {
          this.state.error === 'notFound' && this.props.notFoundComponent &&
          <this.props.notFoundComponent />
        }
      </div>
    );
  }
}
