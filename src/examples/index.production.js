/**
 * README - ...
 */

// In the production build we need to set the public path based on the bundle's
// location.  The 'bundle' global variable has a helper to tell us where that is
// and then we require the main index.
// eslint-disable-next-line no-undef, camelcase
__webpack_public_path__ = `${window.bundle.config.staticLocation}/`;

// The index.js file MUST be loaded with 'require' and not 'import' because
// imports are "lifted" (evaluated before other statements), which would cause
// assets to be loaded before the asset path (__webpack_public_path__) is set.
require('./index');
