/**
 * @module br/test/viewhandler/IsVisible
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/IsVisible
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>IsVisible</code> instances of <code>ViewFixtureHandler</code> can be used to check if a view element is visible.
 * Example usage:
 *
 * <pre>then("form.view.(.orderSummary).isVisible = true");</pre>
 */
function IsVisible() {
}
br.implement(IsVisible, ViewFixtureHandler);

IsVisible.prototype.set = function(eElement) {
	throw new Errors.InvalidTestError("Visibility can't be used in a Given or When clause.");
};

IsVisible.prototype.get = function(eElement) {
	// Definition of invisible from jQuery API ...
	// Elements can be considered hidden for several reasons:
	//
	//	- They have a CSS display value of none.
	//	- They are form elements with type="hidden".
	//	- Their width and height are explicitly set to 0.
	//	- An ancestor element is hidden, so the element is not shown on the page.
	//
	// NOTE: Elements with visibility: hidden or opacity: 0 are considered to
	// be visible, since they still consume space in the layout.

	var sVisibility = jQuery(eElement).css("visibility");
	return jQuery(eElement).is(":visible") && sVisibility != 'hidden';
};

export default IsVisible;
