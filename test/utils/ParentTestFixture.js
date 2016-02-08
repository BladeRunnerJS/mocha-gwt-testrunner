import Fixture from '../../src/Fixture';
import topiarist from 'topiarist';
import {createMockTestFixture} from './TestFixtureFactory';

export default function ParentTestFixture() {
	this.m_oFirstMockFixture = createMockTestFixture(false);
	this.m_oSecondMockFixture = createMockTestFixture(false);
}
topiarist.inherit(ParentTestFixture, Fixture);

ParentTestFixture.prototype.addSubFixtures = function(oFixtureRegistry) {
	oFixtureRegistry.addFixture('subFixture1', this.m_oFirstMockFixture);
	oFixtureRegistry.addFixture('subFixture2', this.m_oSecondMockFixture);
};

ParentTestFixture.prototype.canHandleExactMatch = function() {
	return false;
};

ParentTestFixture.prototype.canHandleProperty = function(/*sProperty*/) {
	return false;
};

ParentTestFixture.prototype.getFirstMockFixture = function() {
	return this.m_oFirstMockFixture;
};

ParentTestFixture.prototype.getSecondMockFixture = function() {
	return this.m_oSecondMockFixture;
};
