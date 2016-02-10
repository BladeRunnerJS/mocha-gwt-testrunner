/**
 * @module br/test/viewhandler/ScrolledHorizontal
 */

import br from '@brjs/br/modules/Core';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/ScrolledHorizontal
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>ScrolledHorizontal</code> instances of <code>ViewFixtureHandler</code> can be used to trigger a horizontal scroll on a view element.
 */
function ScrolledHorizontal() {
}
br.implement(ScrolledHorizontal, ViewFixtureHandler);

ScrolledHorizontal.prototype.set = function(eElement, nOffset) {
	eElement.scrollLeft += parseFloat(nOffset);
	Utils.fireScrollEvent(eElement);
};

ScrolledHorizontal.prototype.get = function(eElement) {
	return eElement.scrollLeft;
};

export default ScrolledHorizontal;
