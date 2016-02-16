/**
 * @module br/test/viewhandler/RightMarginWidth
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/RightMarginWidth
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>RightMarginWidth</code> instances of <code>ViewFixtureHandler</code> can be used to test the right margin width of an element.
 * Example usage:
 *
 * <pre>and('form.view.([identifier=\'orderForm\'] .order_amount .order_amount_input input).rightMarginWidth = '10'');</pre>
 */
function RightMarginWidth() {
}
br.implement(RightMarginWidth, ViewFixtureHandler);

RightMarginWidth.prototype.set = function(eElement) {
	throw new Errors.InvalidTestError('RightMarginWidth can\'t be used in a Given or When clause.');
};

RightMarginWidth.prototype.get = function(eElement) {
	var sMargin = jQuery(eElement)[0].style.margin;

	var	pWidthValues = sMargin.match(/\d+/g);

	return pWidthValues.length === 4 ? pWidthValues[1] : pWidthValues.length === 2 ? pWidthValues[1] : pWidthValues[0];
};

export default RightMarginWidth;
