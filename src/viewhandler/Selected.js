/**
 * @module br/test/viewhandler/Selected
 */

import jQuery from 'jquery';
import Utils from '../Utils';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/Selected
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>Selected</code> instances of <code>ViewFixtureHandler</code> can be used to get or set <code>selected</code>
 * property of an OPTION view element.
 * Example usage:
 *
 * <pre>when('demo.view.(#multiSelectBox option:last).selected => true');</pre>
 */
function Selected(){
}
br.implement(Selected, ViewFixtureHandler);

Selected.prototype.get = function(eElement) {
	if (eElement.selected === undefined) {
		throw new Errors.InvalidTestError('Only Option elements have the \'selected\' property.');
	}
	return eElement.selected;
};

Selected.prototype.set = function(eElement, vValue) {
	if (eElement.selected === undefined) {
		throw new Errors.InvalidTestError('Only Option elements have their \'selected\' property set.');
	}
	if (!(vValue === true || vValue === false)) {
		throw new Errors.InvalidTestError('the \'selected\' property can only be set to true or false.');
	}
	if (eElement.selected !== vValue) {
		eElement.selected = vValue;

		// needed for options within optgroup tags in IE8
		if(eElement.selected !== vValue) {
			(eElement.previousSibling || eElement.nextSibling).selected = true;
		}

		Utils.fireDomEvent(jQuery(eElement).parent('select'), 'change');
	}
};

export default Selected;
