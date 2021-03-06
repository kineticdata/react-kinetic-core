import * as Form from './components/CoreForm';
import * as Modal from './components/CoreModal';
import * as FormModal from './components/CoreFormModal';
import { K, bundle } from './core-helpers';
import { loadable } from './components/utils/loadable';

// APIs
import * as BridgeModelsAPI from './apis/bridgeModels';
import * as CategoriesAPI from './apis/categories';
import * as FormsAPI from './apis/forms';
import * as KappsAPI from './apis/kapps';
import * as SpaceAPI from './apis/space';
import * as SubmissionsAPI from './apis/submissions';
import * as TeamsAPI from './apis/teams';
import * as ProfileAPI from './apis/profile';
import * as UsersAPI from './apis/users';
import * as BridgedResourcesAPI from './apis/bridgedresources';
import * as VersionAPI from './apis/version';
import { deserializeAttributes, serializeAttributes } from './apis/http';
import axios from 'axios';

// Export helpers.
export { K, bundle, loadable };

const addRequestInterceptor = (fulfilled, rejected) => {
  axios.interceptors.request.use(fulfilled, rejected);
};
const addResponseInterceptor = (fulfilled, rejected) => {
  axios.interceptors.response.use(fulfilled, rejected);
};

// Export APIs.
export const CoreAPI = {
  ...BridgeModelsAPI,
  ...CategoriesAPI,
  ...FormsAPI,
  ...KappsAPI,
  ...SpaceAPI,
  ...SubmissionsAPI,
  ...TeamsAPI,
  ...ProfileAPI,
  ...UsersAPI,
  ...BridgedResourcesAPI,
  ...VersionAPI,
  deserializeAttributes,
  serializeAttributes,
  addRequestInterceptor,
  addResponseInterceptor,
};

// Export Components.
export const CoreForm = Form.CoreForm;
export const CoreFormModal = FormModal.CoreFormModal;
export const CoreModal = Modal.CoreModal;
export const CoreModalBody = Modal.CoreModalBody;
export const CoreModalFooter = Modal.CoreModalFooter;
export const CoreModalHeader = Modal.CoreModalHeader;
