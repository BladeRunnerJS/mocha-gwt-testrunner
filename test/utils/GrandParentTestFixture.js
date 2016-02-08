import topiarist from 'topiarist';
import Fixture from '../../src/Fixture';
import ParentTestFixture from './ParentTestFixture';

export default function GrandParentTestFixture() {
	this.childMockFixture = new ParentTestFixture();
}
topiarist.inherit(GrandParentTestFixture, Fixture);

GrandParentTestFixture.prototype.addSubFixtures = function(oFixtureRegistry) {
	oFixtureRegistry.addFixture('childFixture', this.childMockFixture);
};

GrandParentTestFixture.prototype.canHandleExactMatch = function() {
	return false;
};

GrandParentTestFixture.prototype.canHandleProperty = function(/*sProperty*/) {
	return false;
};

GrandParentTestFixture.prototype.getChildMockFixture = function() {
	return this.childMockFixture;
};
