/*global document*/
/**
 * @module br/test/viewhandler/Clicked
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';
import Utils from '../Utils';

/**
 * @class
 * @alias module:br/test/viewhandler/Clicked
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>Clicked</code> instances of <code>ViewFixtureHandler</code> can be used to trigger a click on a view element.
 * Example usage:
 *
 * <pre>when('form.view.(.executeOrder [identifier=\'buttonOrder\'] .order_button).clicked => true');</pre>
 */
function Clicked() {
}
br.implement(Clicked, ViewFixtureHandler);

Clicked.prototype.set = function(eElement, mArgs) {

	var jqueryElement = jQuery(eElement);

	if ( jqueryElement.hasClass('disabled') || jqueryElement.is(':disabled') ) {
		return;
	}

	if (document.activeElement && document.activeElement !== eElement &&
			document.activeElement.tagName &&
			document.activeElement.tagName.toLowerCase() !== 'body') {

		var activeElement = document.activeElement;
		var jqueryActiveElement = jQuery(activeElement);
		jqueryActiveElement.trigger('focusout');

		var activeNodeName = jqueryActiveElement[0].nodeName.toLowerCase();
		var activeInputType = (jqueryActiveElement.attr('type')) ? jqueryActiveElement.attr('type').toLowerCase() : '';
		if ( activeNodeName === 'select' || ( activeNodeName === 'input' && activeInputType !== 'submit' ) ) {
			/*
			 * DO NOT use JQuery for the change events here.
			 * Knockout doesn't listen for the jQuery change event unless jQuery appears before the knockout library
			 * and in order to make that happen presenter-knockout has to directly depends on jQuery.
			*/
			Utils.fireDomEvent(activeElement, 'change');
		}
	}

	var elementNodeName = jqueryElement[0].nodeName.toLowerCase();
	var elementInputType = (jqueryElement.attr('type')) ? jqueryElement.attr('type').toLowerCase() : '';

	jqueryElement.trigger('focusin');
	jqueryElement.trigger('focus');
	try {
		document.activeElement = eElement;
	} catch (e) {
		setActive(eElement);
	}

	Utils.fireMouseEvent(eElement, 'click', mArgs);

	if ( elementNodeName === 'select' ||
			( elementNodeName === 'input' && elementInputType !== 'submit' ) ) {
		Utils.fireDomEvent(eElement, 'change');
	}

	if ( ( (elementNodeName === 'input' && elementInputType === 'submit')
				|| elementNodeName === 'button') ) {
		var elementParentForm = jqueryElement.parents('form');
		if (elementParentForm != null && (elementParentForm.attr('action') != null || elementParentForm.attr('onsubmit') != null)) {
			elementParentForm.trigger('submit');
		}
	}
};

Clicked.prototype.get = function(/*eElement*/) {
	throw new Errors.InvalidTestError('Clicked can\'t be used in a then clause.');
};

function setActive(eElement){
	if (eElement.setActive) {
		try {
			eElement.setActive();
		}
		catch (e) //IE10 and IE11 occasionally throw invalid function error for setActive
		{
			if(eElement.focus){
				eElement.focus();
			}
		}
	}
}

export default Clicked;
