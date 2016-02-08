import Fixture from '../../src/Fixture';
import topiarist from 'topiarist';
import {createMockTestFixture} from './TestFixtureFactory';

export default function ParentTestFixture() {
	this.firstMockFixture = createMockTestFixture(false);
	this.secondMockFixture = createMockTestFixture(false);
}
topiarist.inherit(ParentTestFixture, Fixture);

ParentTestFixture.prototype.addSubFixtures = function(oFixtureRegistry) {
	oFixtureRegistry.addFixture('subFixture1', this.firstMockFixture);
	oFixtureRegistry.addFixture('subFixture2', this.secondMockFixture);
};

ParentTestFixture.prototype.canHandleExactMatch = function() {
	return false;
};

ParentTestFixture.prototype.canHandleProperty = function(/*sProperty*/) {
	return false;
};

ParentTestFixture.prototype.getFirstMockFixture = function() {
	return this.firstMockFixture;
};

ParentTestFixture.prototype.getSecondMockFixture = function() {
	return this.secondMockFixture;
};
