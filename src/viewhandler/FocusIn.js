/**
 * @module br/test/viewhandler/FocusIn
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/FocusIn
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>FocusIn</code> instances of <code>ViewFixtureHandler</code> can be used to trigger <code>focusin</code> on a view element.
 * Example usage:
 *
 * <pre>and('form.view.(#theField).focusIn => true');</pre>
 */
function FocusIn() {
}
br.implement(FocusIn, ViewFixtureHandler);

FocusIn.prototype.set = function(eElement) {
	jQuery(eElement).trigger('focusin');
};

FocusIn.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError('The focusIn event cannot be used in a doGiven or doThen');
};

export default FocusIn;
