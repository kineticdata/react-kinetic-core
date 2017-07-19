<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [Components](#components)
    - [Modal Component](#modal-component)
        - [CoreModal](#coremodal)
        - [CoreModalHeader](#coremodalheader)
        - [CoreModalBody](#coremodalbody)
        - [CoreModalFooter](#coremodalfooter)
        - [CoreForm](#coreform)
        - [CoreFormModal](#coreformmodal)
- [Utilities](#utilities)
    - [loadable](#loadable)

<!-- markdown-toc end -->

# Components

## Modal Component

Example:
```
import { CoreModal, CoreModalHeader, CoreModalBody, CoreModalFooter} from 'react-kinetic-core';

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
}
```

### CoreModal

The `CoreModal` component handles all of the modal logic. The other modal components (`CoreModalHeader`, `CoreModalBody`, and `CoreModalFooter`) are used for styling.

| Property  | Type   | Description |
| --------- | ------ | ----------- |
| visible   | bool   | Whether or not the modal is visible. |
| dismissed | func   | The function to be called when a modal needs to be dismissed |
| size      | string | The size of the modal: `'sm'`, `'md'`, `'lg'` |

### CoreModalHeader

Only takes children. Intended to be a direct child of `CoreModal`.

### CoreModalBody

Only takes children. Intended to be a direct child of `CoreModal`.

### CoreModalFooter

Only takes children. Intended to be a direct child of `CoreModal`.

### CoreForm

| Property  | Type   | Description |
| --------- | ------ | ----------- |
| submission | string | A submission ID |
| kapp | string  | A kapp slug. |
| form | string | A form slug. |
| review | bool | Renders the form in review mode if true. |
| values | object | A map of field name to values for default values on the form. |
| globals | func\|Promise | A function to load globals or a promise to complete loading globals. |
| onLoaded | func | |
| loaded | func | |
| onUnauthorized | func | |
| unauthorized | func | |
| onForbidden | func | |
| forbidden | func | |
| onNotFound | func | |
| notFound | func | |
| onError | func | |
| error | func | |
| onCreated | func | |
| created | func | |
| onUpdated | func | |
| updated | func | |
| onCompleted | func | |
| completed | func | |

### CoreFormModal

# Utilities

## loadable

A higher-order-component for routed components that will execute a function when mount and when the match URL changes (but does not cause the component to remount) as well as executing another action when the component unmounts.

```
import { loadable } from 'react-kinetic-core';

const MyLoadableComponent = loadable(
  onMount: props => props.doAction(),
  onUnmount: props => props.undoAction(),
)(MyComponent);
```
