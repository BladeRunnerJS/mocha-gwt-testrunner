/**
 * @module br/test/viewhandler/Height
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/Height
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>Height</code> instances of <code>ViewFixtureHandler</code> can be used to get height of a view element.
 * Example usage:
 *
 * <pre>then('dynamicComponent.view.(.component).height = 200');</pre>
 */
function Height() {
}
br.implement(Height, ViewFixtureHandler);

Height.prototype.set = function(eElement) {
	throw new Errors.InvalidTestError('The Height attribute for a element cannot be set directly and should be set via the viewModel.');
};

Height.prototype.get = function(eElement) {
	return jQuery(eElement).height();
};

export default Height;
