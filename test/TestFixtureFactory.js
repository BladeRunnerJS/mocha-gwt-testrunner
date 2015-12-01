
import sinon from 'sinon';
import Fixture from '../src/Fixture';

function createMockTestFixture(canHandleExactMatch) {
	let fixture = sinon.stub(new Fixture());
	fixture.canHandleProperty.returns(false);
	fixture.canHandleProperty.withArgs('prop').returns(true);
	fixture.canHandleExactMatch.returns(canHandleExactMatch);
	return fixture;
}

export default function TestFixtureFactory() {
	this.fixtureStub = createMockTestFixture(false);
	this.propertyFixtureStub = createMockTestFixture(true);
}

TestFixtureFactory.prototype.addFixtures = function(oFixtureRegistry) {
	oFixtureRegistry.addFixture('fixture', this.fixtureStub);
	oFixtureRegistry.addFixture('propertyFixture', this.propertyFixtureStub);
	oFixtureRegistry.addFixture('another=fixture', this.fixtureStub);
};
