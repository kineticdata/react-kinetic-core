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

const MyModal = ({ visible, toggle }) => (
  <CoreModal visible={this.state.visible} dismissed={this.toggle}>
    <CoreModalHeader>Header</CoreModalHeader>
    <CoreModalBody>
      This is the modal body.
    </CoreModalBody>
    <CoreModalFooter><button onClick={this.toggle}>Close</button></CoreModalFooter>
  </CoreModal>);
```

### CoreModal

The `CoreModal` component handles all of the modal logic. The other modal components (`CoreModalHeader`, `CoreModalBody`, and `CoreModalFooter`) are used for styling.

You must import the modal CSS (see [Installation](./README.md)) or implement the following CSS classes:

```
// Style for the backdrop/overlay.
.kd-modal-backdrop { /* ... */ }

// Style for the overall modal content container.
.kd-modal-content { /* ... */ }
```

| Property  | Type   | Description |
| --------- | ------ | ----------- |
| visible   | bool   | Whether or not the modal is visible. |
| dismissed | func   | The function to be called when a modal needs to be dismissed |
| size      | string | The size of the modal: `'sm'`, `'md'`, `'lg'` |

### CoreModalHeader

You must import the modal CSS (see [Installation](./README.md)) or implement the following CSS classes:

```
// Style for the backdrop/overlay.
.kd-modal-header { /* ... */ }
```
Only takes children. Intended to be a direct child of `CoreModal`.

### CoreModalBody

You must import the modal CSS (see [Installation](./README.md)) or implement the following CSS classes:

```
// Style for the backdrop/overlay.
.kd-modal-body { /* ... */ }
```

Only takes children. Intended to be a direct child of `CoreModal`.

### CoreModalFooter

You must import the modal CSS (see [Installation](./README.md)) or implement the following CSS classes:

```
// Style for the backdrop/overlay.
.kd-modal-footer { /* ... */ }
```

Only takes children. Intended to be a direct child of `CoreModal`.

### CoreForm

The `CoreForm` component allows you to load an embedded Kinetic CE form.

Examples:

```
const handleLoad = form => {
  console.log('form', form.name());
};

const defaultValues = {
  'Status': 'Open',
  'Owning Team': 'IT',
};

const MyForms = ({ submissionId }) => (
  <div>
    {/* Load a specific form from a specific Kapp. */}
    <CoreForm
      kapp="catalog"
      form="request-ipad"
      onLoaded={handleLoad}
    />
    
    {/* Load a specific submission, in review mode. */}
    <CoreForm
      submission={submissionId}
      onLoaded={handleLoad}
      review
    />
    
    {/* Default field values. */}
    <CoreForm
      kapp="queue"
      form="work-order"
      values={defaultValues}
    />
  </div>
);
```

| Property  | Type   | Arguments | Description |
| --------- | ------ | --------- | ----------- |
| submission | string |  | A submission ID |
| kapp | string  |   | A kapp slug, defaults to the bundle Kapp.  |
| form | string |   | A form slug. |
| review | bool |   | Renders the form in review mode if true. |
| values | object |   | A map of field name to values for default values on the form. |
| globals | func\|Promise |   | A function to load globals or a promise to complete loading globals. |
| onLoaded | func | (form:object) | Handler for form loaded events. |
| onUnauthorized  | func | (...args) | Handler for 401/unauthorized events. |
| onForbidden | func | (...args) | Handler for 403/forbidden events. | 
| onNotFound | func | (...args) | Handler for 404/not found events. |
| onError | func | (...args) | Handler for all other error events. |
| onCreated | func | (response, actions) | Handler for submission created events. |
| onUpdated | func | (response, actions) | Handler for submission updated events. |
| onCompleted | func | (response, actions) | Handler for submission completed events. |

### CoreFormModal

The `CoreFormModal` combines the `CoreForm` and `CoreModal` into a single component. When you use this component it will open a modal containing your form **once the embedded form has fully loaded**. This prevents a _popping_ of the modal size and content.

You can use all of the properties from `CoreModal` and `CoreForm` but **cannot** use the other modal components such as `CoreModalHeader`. The `CoreFormModal` automatically uses these for you.

Example:

```
const MyFormModal = ({ toggle, visible, kappSlug, formSlug, handleLoaded }) => (
  <CoreFormModal
    toggle={toggle}
    visible={visible}
    kapp={kappSlug}
    form={formSlug}
    onLoaded={handleLoaded}
  />
);
```

# Utilities

## loadable

```
Note: The "loadable" HOC has been deprecated and will be removed in 1.0
```

A higher-order-component for routed components that will execute a function when mount and when the match URL changes (but does not cause the component to remount) as well as executing another action when the component unmounts.

```
import { loadable } from 'react-kinetic-core';

const MyLoadableComponent = loadable(
  onMount: props => props.doAction(),
  onUnmount: props => props.undoAction(),
)(MyComponent);
```
