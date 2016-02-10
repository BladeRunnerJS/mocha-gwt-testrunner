/**
 * @module br/test/viewhandler/OnKeyUp
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/OnKeyUp
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 */
function OnKeyUp() {
}
br.implement(OnKeyUp, ViewFixtureHandler);

OnKeyUp.prototype.set = function(eElement, mValues) {
	Utils.fireKeyEvent(eElement, "keyup", mValues.sKey, mValues);
};

OnKeyUp.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError("The keyUp event cannot be used in a doGiven or doThen");
};

export default OnKeyUp;
