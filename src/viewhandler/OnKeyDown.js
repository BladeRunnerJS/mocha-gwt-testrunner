/**
 * @module br/test/viewhandler/OnKeyDown
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/OnKeyDown
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 */
function OnKeyDown() {
}
br.implement(OnKeyDown, ViewFixtureHandler);

OnKeyDown.prototype.set = function(eElement, mValues) {
	Utils.fireKeyEvent(eElement, "keydown", mValues, null);
};

OnKeyDown.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError("The keyDown event cannot be used in a doGiven or doThen");
};

export default OnKeyDown;
