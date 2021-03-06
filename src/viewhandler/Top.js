/**
 * @module br/test/viewhandler/Top
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/Top
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>Top</code> instances of <code>ViewFixtureHandler</code> can be used to get style.top value of a view element.
 * Example usage:
 *
 * <pre>then('dynamicComponent.view.(.component).top = 20');</pre>
 */
function Top() {
}
br.implement(Top, ViewFixtureHandler);

Top.prototype.set = function(eElement) {
	throw new Errors.InvalidTestError('The Top attribute for a element cannot be set directly and should be set via the viewModel.');
};

Top.prototype.get = function(eElement) {
	return jQuery(eElement)[0].style.top;
};

export default Top;
