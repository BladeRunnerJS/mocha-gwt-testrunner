/**
* @module br/test/viewhandler/BackgroundImage
*/

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/BackgroundImage
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>BackgroundImage</code> instances of <code>ViewFixtureHandler</code> can be used to test the background image value.
 * Example usage:
 *
 * <pre>and("form.view.([identifier=\'orderForm\'] .order_amount .order_amount_input input).backgroundImage = 'images/image.png'");</pre>
 */
function BackgroundImage() {
}
br.implement(BackgroundImage, ViewFixtureHandler);

BackgroundImage.prototype.set = function(/*eElement*/) {
	throw new Errors.InvalidTestError('BackgroundImage can\'t be used in a Given or When clause.');
};

BackgroundImage.prototype.get = function(eElement) {
	var sProperty = 'div.' + eElement.className;
	return jQuery(sProperty)[0].style.backgroundImage;
};

export default BackgroundImage;
