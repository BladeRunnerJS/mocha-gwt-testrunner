/**
 * @module br/test/viewhandler/ScrolledVertical
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/ScrolledVertical
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>ScrolledVertical</code> instances of <code>ViewFixtureHandler</code> can be used to trigger a vertical scroll on a view element.
 */
function ScrolledVertical() {
}
br.implement(ScrolledVertical, ViewFixtureHandler);

ScrolledVertical.prototype.set = function(eElement, nOffset) {
	eElement.scrollTop += parseFloat(nOffset);
	Utils.fireScrollEvent(eElement);
};

ScrolledVertical.prototype.get = function(eElement) {
	throw new Errors.InvalidTestError("ScrolledVertical can't be used in a then clause.");
};

export default ScrolledVertical;
