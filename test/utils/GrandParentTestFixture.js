import topiarist from 'topiarist';
import Fixture from '../../src/Fixture';
import ParentTestFixture from './ParentTestFixture';

export default function GrandParentTestFixture() {
	this.m_oChildMockFixture = new ParentTestFixture();
}
topiarist.inherit(GrandParentTestFixture, Fixture);

GrandParentTestFixture.prototype.addSubFixtures = function(oFixtureRegistry) {
	oFixtureRegistry.addFixture('childFixture', this.m_oChildMockFixture);
};

GrandParentTestFixture.prototype.canHandleExactMatch = function() {
	return false;
};

GrandParentTestFixture.prototype.canHandleProperty = function(/*sProperty*/) {
	return false;
};

GrandParentTestFixture.prototype.getChildMockFixture = function() {
	return this.m_oChildMockFixture;
};
