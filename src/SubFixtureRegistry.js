import topiarist from 'topiarist';
import FixtureRegistry from './FixtureRegistry';

/**
 * @private
 * @class
 * @alias module:br/test/SubFixtureRegistry
 * @implements module:br/test/FixtureRegistry
 */
function SubFixtureRegistry(parentFixtureRegistry, scope) {
	this.parentFixtureRegistry = parentFixtureRegistry;
	this.scope = scope;
}

topiarist.inherit(SubFixtureRegistry, FixtureRegistry);

/** @see br.test.FixtureRegistry#addFixture */
SubFixtureRegistry.prototype.addFixture = function(scope, fixture) {
	this.parentFixtureRegistry.addFixture(this.scope + '.' + scope, fixture);
};

export default SubFixtureRegistry;
