/**
 * @module br/test/viewhandler/ChildrenCount
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/ChildrenCount
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>ChildrenCount</code> instances of <code>ViewFixtureHandler</code> can be used to get number of child elements for a view element.
 * Example usage:
 *
 * <pre>and('example.view.(select).childrenCount = 5');</pre>
 */
function ChildrenCount() {
}
br.implement(ChildrenCount, ViewFixtureHandler);

ChildrenCount.prototype.get = function(eElement) {
	return jQuery(eElement).children().length;
};

ChildrenCount.prototype.set = function(/*eElement, vValue*/) {
	throw new Errors.InvalidTestError('ChildrenCount value can not be set on an object and therefore should only be used in a then clause.');
};

export default ChildrenCount;
