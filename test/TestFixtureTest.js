import GwtTestRunner from '../src/GwtTestRunner';
import TestFixtureFactory from './utils/TestFixtureFactory';

import chai from 'chai';
const expect = chai.expect;

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
		given('test.continuesFrom = \'has a test that can be continued from\'');
		when('fixture.prop => \'value2\'');
        then('fixture.prop = \'value2\'');
		expect(lastTestCalled).to.eq('has a test that can be continued from');
	});

	it('can be used to continue from another test using its full title', () => {
		given('test.continuesFrom = \'Test Fixture::has a test that can be continued from\'');
		when('fixture.prop => \'value2\'');
        then('fixture.prop = \'value2\'');
		expect(lastTestCalled).to.eq('has a test that can be continued from');
	});

	it('throws an error for any properties other than continuesFrom', () => {
		expect(() => {
			given('test.someProperty = \'1234\'');
			then('fixture.prop = \'value2\'');
		}).to.throw('test.someProperty');
	});

	it('throws an error for any when call', () => {
		expect(() => {
			given('fixture.prop = \'value\'');
			when('test.someProperty => \'value\'');
		}).to.throw('test.someProperty');
	});

	it('throws an error for any then call', () => {
		expect(() => {
			given('fixture.prop = \'value\'');
			then('test.someProperty => \'value\'');
		}).to.throw('test.someProperty');
	});

});
