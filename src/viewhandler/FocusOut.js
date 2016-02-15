/**
 * @module br/test/viewhandler/FocusOut
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/FocusOut
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>FocusOut</code> instances of <code>ViewFixtureHandler</code> can be used to trigger <code>focusout</code> on a view element.
 * Example usage:
 *
 * <pre>and('form.view.(#theField).focusOut => true');</pre>
 */
function FocusOut() {
}
br.implement(FocusOut, ViewFixtureHandler);

FocusOut.prototype.set = function(eElement) {
	jQuery(eElement).trigger('focusout');
};

FocusOut.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError('The focusOut event cannot be used in a doGiven or doThen');
};

export default FocusOut;
