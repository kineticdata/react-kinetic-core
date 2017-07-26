import * as Form from './components/CoreForm';
import * as Modal from './components/CoreModal';
import * as FormModal from './components/CoreFormModal';
import { K, bundle } from './core-helpers';
import { loadable } from './components/utils/loadable';

// APIs
import * as CategoriesAPI from './apis/categories';
import * as FormsAPI from './apis/forms';
import * as KappsAPI from './apis/kapps';
import * as SpaceAPI from './apis/space';
import * as SubmissionsAPI from './apis/submissions';
import * as TeamsAPI from './apis/teams';
import * as ProfileAPI from './apis/profile';
import * as UsersAPI from './apis/users';
import * as BridgedResourcesAPI from './apis/bridgedresources';
import { deserializeAttributes, serializeAttributes } from './apis/http';


// Export helpers.
export { K, bundle, loadable };

// Export APIs.
export const CoreAPI = {
  ...CategoriesAPI,
  ...FormsAPI,
  ...KappsAPI,
  ...SpaceAPI,
  ...SubmissionsAPI,
  ...TeamsAPI,
  ...ProfileAPI,
  ...UsersAPI,
  ...BridgedResourcesAPI,
  deserializeAttributes,
  serializeAttributes,
};

// Export Components.
export const CoreForm = Form.CoreForm;
export const CoreFormModal = FormModal.CoreFormModal;
export const CoreModal = Modal.CoreModal;
export const CoreModalBody = Modal.CoreModalBody;
export const CoreModalFooter = Modal.CoreModalFooter;
export const CoreModalHeader = Modal.CoreModalHeader;
