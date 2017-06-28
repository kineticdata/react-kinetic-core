import React, { Component } from 'react';

// Widget.js
/*
  import React from 'react';
  const LoadingState = () =>
    <div className="spinner" />;
  const LoadedState = ({ widget }) =>
    <div>{widget.name}</div>;
  export const Widget = ({ loading, widget }) =>
    loading ? <LoadingState /> : <LoadedState widget={widget} />;
*/

// WidgetContainer.js
/*
  import { connect } from 'react-redux';
  import { loadable } from '../helpers/loadable';
  import { actions as widgetActions } from '../redux/modules/widget';
  import { Widget } from './Widget';
  export const stateMapper = ({ widgetState }) => ({
    widget: widgetState.widget,
  });
  export const actions = {
    fetchWidget: widgetActions.fetchWidget,
    resetWidget: widgetActions.resetWidget,
  };
  export const LoadableWidget = loadable({
    onMount: props => props.fetchWidget(),
    onUmount: props => props.resetWidget(),
  })(Widget);
  export const WidgetContainer = connect(stateMapper, actions)(LoadableWidget);
*/

export const loadable = ({ onMount, onUnmount }) => WrappedComponent =>
  class extends Component {
    // eslint-disable-next-line class-methods-use-this
    mountComponent(props) {
      if (typeof onMount === 'function') {
        onMount(props);
      }
    }

    unmountComponent() {
      if (typeof onUnmount === 'function') {
        onUnmount(this.props);
      }
    }

    componentWillMount() {
      this.mountComponent(this.props);
    }

    componentWillUpdate(nextProps) {
      if (this.props.match && this.props.match.url !== nextProps.match.url) {
        this.unmountComponent();
        this.mountComponent(nextProps);
      }
    }

    componentWillUnmount() {
      this.unmountComponent();
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
};
