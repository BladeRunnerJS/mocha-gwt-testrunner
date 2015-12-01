
import sinon from 'sinon';
import Fixture from '../../src/Fixture';
import ParentTestFixture from './ParentTestFixture';
import GrandParentTestFixture from './GrandParentTestFixture';

export function createMockTestFixture(canHandleExactMatch) {
	let fixture = sinon.stub(new Fixture());
	fixture.canHandleProperty.returns(false);
	fixture.canHandleProperty.withArgs('prop').returns(true);
	fixture.canHandleExactMatch.returns(canHandleExactMatch);
	return fixture;
}

export default function TestFixtureFactory() {
	this.fixtures = new Map([
		['fixture', createMockTestFixture(false)],
		['propertyFixture', createMockTestFixture(true)],
		['another=fixture', createMockTestFixture(false)],
		['parentFixture', new ParentTestFixture()],
		['grandParentFixture', new GrandParentTestFixture()]
	]);
}

TestFixtureFactory.prototype.getFixture = function(id) {
	return this.fixtures.get(id);
}

TestFixtureFactory.prototype.addFixtures = function(oFixtureRegistry) {
	this.fixtures.forEach((value, key, map) => {
		oFixtureRegistry.addFixture(key, value);
	});
};
