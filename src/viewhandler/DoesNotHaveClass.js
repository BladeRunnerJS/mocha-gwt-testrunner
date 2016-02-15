/**
 * @module br/test/viewhandler/DoesNotHaveClass
 */

import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import ViewFixtureHandler from './ViewFixtureHandler';

/**
 * @class
 * @alias module:br/test/viewhandler/DoesNotHaveClass
 * @implements module:br/test/viewhandler/ViewFixtureHandler
 *
 * @classdesc
 * <code>DoesNotHaveClass</code> instances of <code>ViewFixtureHandler</code> can be used to verify that a view element
 * does not have a particular class. Example usage:
 *
 * <pre>then('test.page.(#aRealButton).doesNotHaveClass = 'hover'');</pre>
 */
function DoesNotHaveClass() {
}
br.implement(DoesNotHaveClass, ViewFixtureHandler);

DoesNotHaveClass.prototype.get = function(eElement, sClassName) {
	if (eElement.className.match('(^| )' + sClassName + '($| )')) {
		return null;
	} else {
		return sClassName;
	}
};

DoesNotHaveClass.prototype.set = function(eElement, sClassName) {
	throw new Errors.InvalidTestError('doesNotHaveClass can\'t be used in a Given or When clause.');
};

export default DoesNotHaveClass;
