import React, { Component } from 'react';
import t from 'prop-types';
import isPlainObject from 'lodash.isplainobject';
import isString from 'lodash.isstring';
import deepEqual from 'deepequal';
import moment from 'moment';
import { K, bundle } from '../core-helpers';
import { corePath } from '../apis/http';
import { fetchSubmission, updateSubmission } from '../apis/submissions';
import { fetchForm } from '../apis/forms';

export const LOCKED_BY_FIELD = 'Locked By';
export const LOCKED_UNTIL_FIELD = 'Locked Until';

export const LOCK_TIME_ATTRIBUTE = 'Lock Time';
export const LOCK_CHECK_INTERVAL_ATTRIBUTE = 'Lock Check Interval';
export const LOCK_PROMPT_TIME_ATTRIBUTE = 'Lock Prompt Time';

export const LOCK_TIME_DEFAULT_VALUE = 30; // seconds
export const LOCK_CHECK_INTERVAL_DEFAULT_VALUE = 10; // seconds
export const LOCK_PROMPT_TIME_DEFAULT_VALUE = 20; // seconds

const submissionIncludes =
  'values,form,form.fields,form.attributesMap,form.kapp,form.kapp.attributesMap,form.kapp.space,form.kapp.space.attributesMap';
const formIncludes =
  'fields,attributesMap,kapp,kapp.attributesMap,kapp.space,kapp.space.attributesMap';

const getNumericAttributeValue = (form, name, defaultValue = 0) => {
  const kapp = form ? form.kapp : null;
  const space = kapp ? kapp.space : null;
  return (
    parseInt(
      (form &&
        form.attributesMap &&
        form.attributesMap[name] &&
        form.attributesMap[name][0]) ||
        (kapp &&
          kapp.attributesMap &&
          kapp.attributesMap[name] &&
          kapp.attributesMap[name][0]) ||
        (space &&
          space.attributesMap &&
          space.attributesMap[name] &&
          space.attributesMap[name][0]),
      10,
    ) || defaultValue
  );
};

export const isLockable = (submission, options = {}) =>
  submission &&
  submission.coreState === 'Draft' &&
  submission.values &&
  submission.form &&
  submission.form.fields &&
  submission.form.fields.find(
    f => f.name === (options.lockedByField || LOCKED_BY_FIELD),
  ) &&
  submission.form.fields.find(
    f => f.name === (options.lockedUntilField || LOCKED_UNTIL_FIELD),
  )
    ? true
    : false;

export const isLocked = (submission, options = {}) => {
  if (!isLockable(submission, options)) {
    return false;
  }
  const lockedUntilDate = new Date(
    submission.values[options.lockedUntilField || LOCKED_UNTIL_FIELD],
  ).getTime();
  return lockedUntilDate > 0 && lockedUntilDate > new Date().getTime();
};

export const isLockedByMe = (submission, options = {}) => {
  if (!isLockable(submission, options) || !isLocked(submission, options)) {
    return false;
  }
  return (
    submission.values[options.lockedByField || LOCKED_BY_FIELD] ===
    bundle.identity()
  );
};

export const getLockedBy = (submission, options = {}) => {
  if (!isLockable(submission, options) || !isLocked(submission, options)) {
    return '';
  }
  return submission.values[options.lockedByField || LOCKED_BY_FIELD] || '';
};

export const getTimeLeft = (submission, options = {}) => {
  if (!isLockable(submission, options) || !isLocked(submission, options)) {
    return 0;
  }
  const lockedUntilDate = new Date(
    submission.values[options.lockedUntilField || LOCKED_UNTIL_FIELD],
  ).getTime();
  return lockedUntilDate - new Date().getTime();
};

export const lockSubmission = ({ id, datastore, options = {} }) => {
  return fetchSubmission({
    id,
    datastore: !!datastore,
    include: submissionIncludes,
  }).then(({ submission, serverError, error, errors }) => {
    if (serverError || error || errors) {
      return { serverError, error, errors };
    } else if (!isLockable(submission, options)) {
      return {
        submission,
        error: 'Submission is not lockable.',
      };
    } else if (
      isLocked(submission, options) &&
      !isLockedByMe(submission, options)
    ) {
      return {
        submission,
        error: 'Submission is locked by another user.',
      };
    }

    const lockTime = getNumericAttributeValue(
      submission.form,
      options.lockTimeAttribute || LOCK_TIME_ATTRIBUTE,
      LOCK_TIME_DEFAULT_VALUE,
    );

    return updateSubmission({
      id: submission.id,
      include: submissionIncludes,
      values: {
        [options.lockedByField || LOCKED_BY_FIELD]: bundle.identity(),
        [options.lockedUntilField || LOCKED_UNTIL_FIELD]: new Date(
          new Date().getTime() + lockTime * 1000,
        ).toISOString(),
      },
    }).then(response => ({ submission, ...response }));
  });
};

export const unlockSubmission = ({
  id,
  datastore,
  options = {},
  adminLockOverride,
}) => {
  return fetchSubmission({
    id,
    datastore: !!datastore,
    include: submissionIncludes,
  }).then(({ submission, serverError, error, errors }) => {
    if (serverError || error || errors) {
      return { serverError, error, errors };
    } else if (!isLockable(submission, options)) {
      return {
        submission,
        error: 'Submission is not lockable.',
      };
    } else if (!isLocked(submission, options)) {
      return {
        submission,
        error: 'Submission is not locked.',
      };
    } else if (!isLockedByMe(submission, options) && !adminLockOverride) {
      return {
        submission,
        error: 'Submission is locked by another user.',
      };
    }

    return updateSubmission({
      id: submission.id,
      include: submissionIncludes,
      values: {
        [options.lockedByField || LOCKED_BY_FIELD]: '',
        [options.lockedUntilField || LOCKED_UNTIL_FIELD]: '',
      },
    }).then(response => ({ submission, ...response }));
  });
};

export const queryString = ({ review, values }) => {
  const parameters = [];
  if (review === true) {
    parameters.push('review');
  } else if (isString(review)) {
    parameters.push(`review=${encodeURIComponent(review)}`);
  }
  if (isPlainObject(values)) {
    Object.keys(values).forEach(field => {
      parameters.push(
        `${encodeURIComponent(`values[${field}]`)}=${encodeURIComponent(
          values[field],
        )}`,
      );
    });
  }
  return parameters.join('&');
};

export const applyGuard = (func, context, args) =>
  typeof func === 'function' && func.apply(context, args);

const defaultState = {
  pending: true,
  submission: null,
  form: null,
  error: false,
  lock: null,
};

export class CoreForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...defaultState };
  }

  setStateSafe = (...args) =>
    !this._unmounted ? this.setState(...args) : undefined;

  componentDidMount() {
    if (this.props.submission && this.props.lock) {
      this.obtainLock();
    } else {
      this.fetchData();
    }
  }

  resetComponent() {
    this.closeForm();
    this.setStateSafe({ ...defaultState });
    if (this.props.submission && this.props.lock) {
      this.obtainLock();
    } else {
      this.fetchData();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // If props changed, reset component
    if (!deepEqual(this.props, prevProps)) {
      if (prevState.lock && prevState.lock.isLockedByMe) {
        this.releaseLock({ state: prevState, props: prevProps }).then(() => {
          this.resetComponent();
        });
      } else {
        this.resetComponent();
      }
    }

    // If pending and submission or form state has just been set, load form
    if (
      this.state.pending &&
      (this.state.submission || this.state.form) &&
      !prevState.submission &&
      !prevState.form
    ) {
      this.loadForm({
        ...this.props,
        // If locking is enabled and form is locked by someone else, open in review mode
        review:
          this.props.review ||
          (this.state.lock && !this.state.lock.isLockedByMe),
      });
    }

    // If locking is turned on and has been initalized
    if (this.state.lock && this.state.lock.init) {
      const lockPromptTime = getNumericAttributeValue(
        this.state.form,
        this.props.lockPromptTimeAttribute || LOCK_PROMPT_TIME_ATTRIBUTE,
        LOCK_PROMPT_TIME_DEFAULT_VALUE,
      );

      // If I obtained the lock, start the poller
      if (this.state.lock.isLockedByMe && !this.state.lock.poller) {
        const lockCheckInterval = getNumericAttributeValue(
          this.state.form,
          this.props.lockCheckIntervalAttribute ||
            LOCK_CHECK_INTERVAL_ATTRIBUTE,
          LOCK_CHECK_INTERVAL_DEFAULT_VALUE,
        );
        this.setStateSafe({
          lock: {
            ...this.state.lock,
            poller: setInterval(() => {
              this.pollSubmission();
            }, lockCheckInterval * 1000),
            isExpiring: false,
            lockLost: false,
          },
        });
        // If form is loaded and is in review mode but should be editable, close and re-load it
        this.form &&
          !this.props.review &&
          this.form.then(form => {
            if (form && form.reviewMode()) {
              this.closeForm();
              this.loadForm(this.props);
            }
          });
      }

      // If lock has been renewed, reset poller
      if (
        this.state.lock.isLockedByMe &&
        this.state.lock.poller &&
        prevState.lock &&
        prevState.lock.isLockedByMe &&
        this.state.lock.timeLeft > prevState.lock.timeLeft
      ) {
        const lockCheckInterval = getNumericAttributeValue(
          this.state.form,
          this.props.lockCheckIntervalAttribute ||
            LOCK_CHECK_INTERVAL_ATTRIBUTE,
          LOCK_CHECK_INTERVAL_DEFAULT_VALUE,
        );

        clearInterval(this.state.lock.poller);
        this.setStateSafe({
          lock: {
            ...this.state.lock,
            poller: setInterval(() => {
              this.pollSubmission();
            }, lockCheckInterval * 1000),
          },
        });
      }

      // If I lost the lock, stop the poller
      if (!this.state.lock.isLockedByMe && this.state.lock.poller) {
        clearInterval(this.state.lock.poller);
        this.setStateSafe({
          lock: {
            ...this.state.lock,
            poller: null,
            isExpiring: false,
            lockLost: true,
          },
        });
      }

      // If remaining lock time is less than lock prompt time, prompt user
      if (
        this.state.lock.isLockedByMe &&
        this.state.lock.timeLeft <= lockPromptTime * 1000 &&
        prevState.lock &&
        prevState.lock.timeLeft > lockPromptTime * 1000
      ) {
        this.setStateSafe({ lock: { ...this.state.lock, isExpiring: true } });
      }
    }

    // If submission is no longer lockable, stop poller
    if (!this.state.lock && prevState.lock && prevState.lock.poller) {
      clearInterval(prevState.lock.poller);
    }
  }

  componentWillUnmount() {
    this._unmounted = true;
    if (this.state.lock) {
      this.releaseLock(undefined, true).then(() => {
        this.closeForm();
      });
    } else {
      this.closeForm();
    }
  }

  fetchData() {
    return this.props.submission
      ? fetchSubmission({
          id: this.props.submission,
          datastore: !!this.props.datastore,
          include: submissionIncludes,
        }).then(({ submission, serverError, error, errors }) => {
          this.setStateSafe({
            submission,
            form: submission ? submission.form : null,
            error: serverError
              ? { statusCode: serverError.status, message: serverError.error }
              : error || errors
              ? { message: error || (errors && errors[0]) || '' }
              : null,
          });
        })
      : fetchForm({
          datastore: !!this.props.datastore,
          kappSlug: this.props.kapp,
          formSlug: this.props.form,
          include: formIncludes,
        }).then(({ form, serverError, error, errors }) => {
          this.setStateSafe({
            form,
            error: serverError
              ? { statusCode: serverError.status, message: serverError.error }
              : error || errors
              ? { message: error || (errors && errors[0]) || '' }
              : null,
          });
        });
  }

  pollSubmission() {
    return this.props.submission
      ? fetchSubmission({
          id: this.props.submission,
          datastore: !!this.props.datastore,
          include: submissionIncludes,
        }).then(({ submission, serverError, error, errors }) => {
          this.setStateSafe({
            submission,
            form: submission ? submission.form : null,
            error: serverError
              ? { statusCode: serverError.status, message: serverError.error }
              : error || errors
              ? { message: error || (errors && errors[0]) || '' }
              : null,
            lock: isLockable(submission, this.props)
              ? {
                  ...this.state.lock,
                  isLocked: isLocked(submission, this.props),
                  isLockedByMe: isLockedByMe(submission, this.props),
                  lockedBy: getLockedBy(submission, this.props),
                  timeLeft: getTimeLeft(submission, this.props),
                }
              : null,
          });
        })
      : new Promise(resolve =>
          resolve({
            error: { message: 'Submission Id was not provided to CoreForm.' },
          }),
        );
  }

  obtainLock() {
    return this.props.submission
      ? lockSubmission({
          id: this.props.submission,
          datastore: this.props.datastore,
          options: this.props,
        }).then(({ submission, serverError, error, errors }) => {
          if (submission) {
            this.setStateSafe({
              submission,
              form: submission ? submission.form : null,
              lock: isLockable(submission, this.props)
                ? {
                    ...this.state.lock,
                    init: true,
                    isExpiring: false,
                    lockLost: false,
                    isLocked: isLocked(submission, this.props),
                    isLockedByMe: isLockedByMe(submission, this.props),
                    lockedBy: getLockedBy(submission, this.props),
                    timeLeft: getTimeLeft(submission, this.props),
                    lockError: serverError
                      ? {
                          statusCode: serverError.status,
                          message: serverError.error,
                        }
                      : error || errors
                      ? { message: error || (errors && errors[0]) || '' }
                      : null,
                  }
                : null,
            });
          } else {
            this.setStateSafe({
              error: serverError
                ? {
                    statusCode: serverError.status,
                    message: serverError.error,
                  }
                : error || errors
                ? { message: error || (errors && errors[0]) || '' }
                : null,
            });
          }
        })
      : new Promise(resolve =>
          resolve({
            error: { message: 'Submission Id was not provided to CoreForm.' },
          }),
        );
  }

  releaseLock(
    { state = this.state, props = this.props, adminLockOverride = false } = {},
    unmounting,
  ) {
    return this.props.submission
      ? unlockSubmission({
          id: props.submission,
          options: props,
          adminLockOverride,
        }).then((submission, serverError, error, errors) => {
          clearInterval(state.lock.poller);
          if (!unmounting) {
            this.setStateSafe({
              submission,
              lock: isLockable(submission, props)
                ? {
                    ...state.lock,
                    poller: null,
                    isExpiring: false,
                    isLocked: isLocked(submission, props),
                    isLockedByMe: isLockedByMe(submission, props),
                    lockedBy: getLockedBy(submission, props),
                    timeLeft: getTimeLeft(submission, props),
                    lockError: serverError
                      ? {
                          statusCode: serverError.status,
                          message: serverError.error,
                        }
                      : error || errors
                      ? { message: error || (errors && errors[0]) || '' }
                      : null,
                  }
                : null,
            });
          }
        })
      : new Promise(resolve =>
          resolve({
            error: { message: 'Submission Id was not provided to CoreForm.' },
          }),
        );
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
    if (this.form) {
      this.form.then(form => form.close());
    }
  }

  loadForm(props) {
    this.setStateSafe({ pending: true, error: null });
    this.form = new Promise(resolve => {
      this.getGlobalsPromise().then(() => {
        K.load({
          path: `${corePath(props)}?${queryString(props)}`,
          container: this.container,
          loaded: form => {
            resolve(form);
            this.setStateSafe({ pending: false, error: null });
            applyGuard(props.onLoaded || props.loaded, undefined, [form]);
          },
          unauthorized: (...args) => {
            this.setStateSafe({ pending: false, error: { statusCode: 401 } });
            applyGuard(
              props.onUnauthorized || props.unauthorized,
              undefined,
              args,
            );
          },
          forbidden: (...args) => {
            this.setStateSafe({ pending: false, error: { statusCode: 403 } });
            applyGuard(props.onForbidden || props.forbidden, undefined, args);
          },
          notFound: (...args) => {
            this.setStateSafe({ pending: false, error: { statusCode: 404 } });
            applyGuard(props.onNotFound || props.notFound, undefined, args);
          },
          error: (...args) => {
            this.setStateSafe({
              pending: false,
              error: this.state.error || {},
            });
            applyGuard(props.onError || props.error, undefined, args);
          },
          created: props.onCreated || props.created,
          updated: props.onUpdated || props.updated,
          completed: props.onCompleted || props.completed,
          originId: props.originId,
          parentId: props.parentId,
        });
      });
    });
  }

  handleRef = element => {
    this.container = element;
  };

  render() {
    const {
      pendingComponent: Pending = DefaultLoadingComponent,
      unauthorizedComponent: Unauthorized = DefaultErrorComponent,
      forbiddenComponent: Forbidden = DefaultErrorComponent,
      notFoundComponent: NotFound = DefaultErrorComponent,
      unexpectedErrorComponent: Unexpected = DefaultErrorComponent,
      lockMessageComponent: LockMessage = DefaultLockMessage,
      layoutComponent: Layout,
    } = this.props;
    const { init, poller, ...lockProps } = this.state.lock || {};
    const actions = {
      refreshSubmission: () => this.pollSubmission(),
      releaseLock: this.state.lock
        ? adminLockOverride => this.releaseLock({ adminLockOverride })
        : undefined,
      obtainLock: this.state.lock ? () => this.obtainLock() : undefined,
    };
    const lockMessage = (
      <LockMessage lock={init ? lockProps : undefined} actions={actions} />
    );
    const content = (
      <div className="embedded-core-form">
        {!Layout && lockMessage}
        <div
          ref={this.handleRef}
          style={
            this.state.pending || this.state.error ? { display: 'none' } : {}
          }
        />
        {this.state.pending && !this.state.error && <Pending />}
        {this.state.error &&
          (this.state.error.statusCode === 401 ? (
            <Unauthorized message="You are unauthorized" />
          ) : this.state.error.statusCode === 403 ? (
            <Forbidden message="You do not have access" />
          ) : this.state.error.statusCode === 404 ? (
            <NotFound
              message={`${
                this.props.submission ? 'Submission' : 'Form'
              } not found`}
            />
          ) : (
            <Unexpected />
          ))}
      </div>
    );
    return Layout ? (
      <Layout
        submission={this.state.submission}
        form={this.state.form}
        error={this.state.error}
        content={content}
        actions={actions}
        lockMessage={lockMessage}
        lock={init ? lockProps : undefined}
      />
    ) : (
      content
    );
  }
}

const DefaultLoadingComponent = () => (
  <div className="text-center p-3">
    <div>
      <span className="fa fa-spinner fa-spin fa-lg fa-fw" />
    </div>
  </div>
);

const DefaultErrorComponent = ({ message }) => (
  <div className="text-center text-danger p-3">
    <div>
      <strong>Oops! An error occurred.</strong>
    </div>
    {message && <small>{message}</small>}
  </div>
);

const DefaultLockMessage = ({ lock, actions }) => {
  if (!lock) {
    return null;
  }
  return lock.isLocked ? (
    !lock.isLockedByMe ? (
      <div>
        <span>
          <span className="fa fa-lock fw-fw mr-1" />
          {`This submission is locked by ${lock.lockedBy} until ${moment()
            .add(lock.timeLeft, 'ms')
            .format('LTS')}.`}
        </span>
        <button className="btn btn-link" onClick={actions.refreshSubmission}>
          Refresh
        </button>
      </div>
    ) : lock.isExpiring ? (
      <div>
        <span>
          <span className="fa fa-lock fw-fw mr-1" />
          {`Your lock on this submission will expire at ${moment()
            .add(lock.timeLeft, 'ms')
            .format('LTS')}.`}
        </span>
        <button className="btn btn-link" onClick={actions.obtainLock}>
          Renew Lock
        </button>
      </div>
    ) : null
  ) : !lock.lockLost ? (
    <div>
      <span>
        <span className="fa fa-unlock fw-fw mr-1" />
        This submission is currently unlocked.
      </span>
      <button className="btn btn-link" onClick={actions.obtainLock}>
        Obtain Lock
      </button>
    </div>
  ) : (
    <div>
      <span>
        <span className="fa fa-unlock fw-fw mr-1" />
        Your lock on this submission has expired.
      </span>
      <button className="btn btn-link" onClick={actions.obtainLock}>
        Obtain Lock
      </button>
    </div>
  );
};

CoreForm.propTypes = {
  /** Code to load prior to loading the form. */
  globals: t.oneOfType([t.func, t.instanceOf(Promise)]),
  /** Id of the submission to load. */
  submission: t.string,
  /** Slug of the form to load if submission id is not provided. */
  formSlug: t.string,
  /** Slug of the kapp which contains the form defined by formSlug. */
  kappSlug: t.string,
  /** Boolean determining if the form defined by formSlug is a datastore form. */
  datastore: t.bool,
  /** Map of field values to pass to the form. */
  values: t.object,
  /** Boolean determining if the form should be opened in review mode. */
  review: t.bool,
  /** Boolean determining if the submission should be locked when opened. */
  lock: t.bool,
  /** Callback function that will execute when the form is loaded. */
  onLoaded: t.func,
  loaded: t.func,
  /** Callback function that will execute when the form returns a 401 error. */
  onUnauthorized: t.func,
  unauthorized: t.func,
  /** Callback function that will execute when the form returns a 403 error. */
  onForbidden: t.func,
  forbidden: t.func,
  /** Callback function that will execute when the form returns a 404 error. */
  onNotFound: t.func,
  notFound: t.func,
  /** Callback function that will execute when the form returns any error. */
  onError: t.func,
  error: t.func,
  /** Callback function that will execute when a submission is created. */
  onCreated: t.func,
  created: t.func,
  /** Callback function that will execute when a submission is updated. */
  onUpdated: t.func,
  updated: t.func,
  /** Callback function that will execute when a submission is completed. */
  onCompleted: t.func,
  completed: t.func,
  /**  */
  originId: t.string,
  parentId: t.string,
  /** Component to display when the form is loading. */
  pendingComponent: t.func,
  /** Component to display when the form returns a 401 error. */
  unauthorizedComponent: t.func,
  /** Component to display when the form returns a 403 error. */
  forbiddenComponent: t.func,
  /** Component to display when the form returns a 404 error. */
  notFoundComponent: t.func,
  /** Component to display when the form returns any other error. */
  unexpectedErrorComponent: t.func,
  /** Component used to display the locking messages. */
  lockMessageComponent: t.func,
  /** Component used to display the entire content of the CoreForm. */
  layoutComponent: t.func,
  /** Name of field which should be used to store the locked by username. */
  lockedByField: t.string,
  /** Name of field which should be used to store the locked until value. */
  lockedUntilField: t.string,
  /** Name of attribute which stores the lock time value in seconds. */
  lockTimeAttribute: t.string,
  /** Name of attribute which stores the lock prompt time value in seconds. */
  lockPromptTimeAttribute: t.string,
  /** Name of attribute which stores the lock check interval value in seconds. */
  lockCheckIntervalAttribute: t.string,
};
