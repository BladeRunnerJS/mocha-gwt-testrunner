/**
 * @module br/test/viewhandler/RightClicked
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/RightClicked
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>RightClicked</code> instances of <code>ViewFixtureHandler</code> can be used to trigger <code>contextmenu</code> event for a view element.
 * Example usage:
 *
 * <pre>when('test.page.(#aRealButton).rightclicked => true');</pre>
 */
function RightClicked() {
}
br.implement(RightClicked, ViewFixtureHandler);

RightClicked.prototype.set = function(eElement) {
	Utils.fireMouseEvent(eElement, 'contextmenu');
};

RightClicked.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError('Clicked can\'t be used in a then clause.');
};

export default RightClicked;
