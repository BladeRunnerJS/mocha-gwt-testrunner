/**
 * @module br/test/viewhandler/MouseOver
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/MouseOver
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>MouseOver</code> instances of <code>ViewFixtureHandler</code> can be used to trigger <code>mouseover</code> event for a view element.
 * Example usage:
 *
 * <pre>when("test.page.(#aRealButton).mouseOver => true");</pre>
 */
function MouseOver() {
}
br.implement(MouseOver, ViewFixtureHandler);

MouseOver.prototype.set = function(eElement, mValues) {
	Utils.fireMouseEvent(eElement, 'mouseover', mValues);
};

MouseOver.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError("The mouseOver event cannot be used in a doGiven or doThen");
};

export default MouseOver;
