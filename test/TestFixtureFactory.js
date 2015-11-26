
import sinon from 'sinon';
import Fixture from '../src/Fixture';

export default function TestFixtureFactory() {
	this.fixtureStub = sinon.stub(new Fixture());
	this.fixtureStub.canHandleProperty.returns(false);
	this.fixtureStub.canHandleProperty.withArgs('prop').returns(true);
}

TestFixtureFactory.prototype.addFixtures = function(oFixtureRegistry) {
	oFixtureRegistry.addFixture('fixture', this.fixtureStub);
};
