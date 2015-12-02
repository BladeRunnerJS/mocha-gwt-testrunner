import GwtTestRunner from '../src/GwtTestRunner';
import TestFixtureFactory from './utils/TestFixtureFactory';

import chai from 'chai';
const expect = chai.expect;
const fail = chai.assert.fail;

GwtTestRunner.initialize(TestFixtureFactory);

describe('Test Fixture', () => {

	let lastTestCalled;

	beforeEach(() => {
		lastTestCalled = '';
	});

	it('has a test that can be continued from', () => {
		lastTestCalled = 'has a test that can be continued from';
	});

	it('can be used to continue from another test', () => {
		given('test.continuesFrom = \'has a test that can be continued from\'')
		when('fixture.prop => \'value2\'');
        then('fixture.prop = \'value2\'');
		expect(lastTestCalled).to.eq('has a test that can be continued from');
	});

	it('can be used to continue from another test using its full title', () => {
		given('test.continuesFrom = \'Test Fixture::has a test that can be continued from\'')
		when('fixture.prop => \'value2\'');
        then('fixture.prop = \'value2\'');
		expect(lastTestCalled).to.eq('has a test that can be continued from');
	});

});