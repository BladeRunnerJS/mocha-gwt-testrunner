/**
 * @module br/test/viewhandler/BlurHandler
 */

import jQuery from 'jquery';

/**
 * @private
 * @class
 * @alias module:br/test/viewhandler/BlurHandler
 */
function BlurHandler(eViewElement) {
	this.fOnBlur = this._onBlur.bind(this);
	this.eViewElement = eViewElement;
	this.sOnBlurListenerId = jQuery(this.eViewElement).on('blur', this.fOnBlur);
}

BlurHandler.prototype.destroy = function() {
	jQuery(this.eViewElement).off('blur', this.fOnBlur);
};

BlurHandler.prototype._onBlur = function(oEvent) {
	var eElement = oEvent.target || oEvent.srcElement;

	if (eElement.fireOnChange) {
		delete eElement.fireOnChange;
		jQuery(eElement).trigger('change');
	}
};

export default BlurHandler;
