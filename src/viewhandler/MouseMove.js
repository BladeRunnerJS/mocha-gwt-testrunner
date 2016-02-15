/**
 * @module br/test/viewhandler/MouseMove
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/MouseMove
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>MouseMove</code> instances of <code>ViewFixtureHandler</code> can be used to trigger <code>mousemove</code> event for a view element.
 * Example usage:
 *
 * <pre>when('test.page.(#aRealButton).mouseMove => true');</pre>
 */
function MouseMove() {
}
br.implement(MouseMove, ViewFixtureHandler);

MouseMove.prototype.set = function(eElement, mValues) {
	Utils.fireMouseEvent(eElement, 'mousemove', mValues);
};

MouseMove.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError('The mouseMove event cannot be used in a doGiven or doThen');
};

export default MouseMove;
