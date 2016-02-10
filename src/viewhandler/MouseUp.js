/**
 * @module br/test/viewhandler/MouseUp
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/MouseUp
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>MouseUp</code> instances of <code>ViewFixtureHandler</code> can be used to trigger <code>mouseup</code> event for a view element.
 * Example usage:
 *
 * <pre>when("test.page.(#aRealButton).mouseUp => true");</pre>
 */
function MouseUp() {
}
br.implement(MouseUp, ViewFixtureHandler);

MouseUp.prototype.set = function(eElement, mValues) {
	Utils.fireMouseEvent(eElement, 'mouseup', mValues);
};

MouseUp.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError("The mouseUp event cannot be used in a doGiven or doThen");
};

export default MouseUp;
