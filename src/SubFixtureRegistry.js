'use strict';

import topiarist from 'topiarist';
import FixtureRegistry from './FixtureRegistry';

/**
 * @private
 * @class
 * @alias module:br/test/SubFixtureRegistry
 * @implements module:br/test/FixtureRegistry
 */
function SubFixtureRegistry(parentFixtureRegistry, scope) {
	this.m_oParentFixtureRegistry = parentFixtureRegistry;
	this.m_sScope = scope;
};

topiarist.inherit(SubFixtureRegistry, FixtureRegistry);

/** @see br.test.FixtureRegistry#addFixture */
SubFixtureRegistry.prototype.addFixture = function(scope, fixture) {
	this.m_oParentFixtureRegistry.addFixture(this.m_sScope + '.' + scope, fixture);
};

export default SubFixtureRegistry;
