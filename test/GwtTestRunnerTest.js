
import GwtTestRunner, {ERROR_MESSAGES} from '../src/GwtTestRunner';
import TestFixtureFactory from './TestFixtureFactory';

import chai from 'chai';
let expect = chai.expect;

describe('GWT Test Runner', () => {

	beforeEach(() => {

	});

	it('throws an error on undefined factory class', () => {
        expect(() => {
            new GwtTestRunner();
        }).to.throw('fixtureFactoryClass must be an object or a constructor function');
    });

	it('throws an error if factory constructor throws an error', () => {
		let ErrorThrowingTestFixtureFactory = function(){
			throw new Error('ERROR!');
		};
        expect(() => {
            new GwtTestRunner(ErrorThrowingTestFixtureFactory);
        }).to.throw('An error occured when creating the fixture factory (ErrorThrowingTestFixtureFactory): ERROR!');
    });

	it('throws an error if fixture factory class is wrong type', () => {
		let InvalidTestFixtureFactory = function(){};

        expect(() => {
            new GwtTestRunner(InvalidTestFixtureFactory);
        }).to.throw('The provided fixture factory does not implement the interface { addFixtures: function addFixtures() {} }');
	});

	it('does not throw an error when the fixture factory is valid', () => {
		let ValidFixtureFactory = { addFixtures: function() {} };
		new GwtTestRunner(ValidFixtureFactory);
	});

	it('throws an error if \'when\' is used before \'given\'', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();

		expect(() => {
            oTestRunner.doWhen('fixture.prop => \'value\'');
        }).to.throw(ERROR_MESSAGES.WHEN_AFTER_GIVEN_AND_BEFORE_THEN_MSG);
	});

	it('throws an error if \'then\' is used before \'given\'', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();

		expect(() => {
            oTestRunner.doThen('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.THEN_AFTER_GIVEN_AND_WHEN_MSG);
	});

	it('throws an error if \'and\' is used before \'given\'', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();

		expect(() => {
            oTestRunner.doAnd('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.AND_MUST_OCCUR_AFTER_GIVEN_WHEN_THEN_MSG);
	});

	it('throws an error if only a \'given\' is used', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();
        // this.stubMockFixture(oTestRunner, 'fixture');

        oTestRunner.doGiven('fixture.prop = \'value\'');

		expect(() => {
            oTestRunner.endTest();
        }).to.throw(ERROR_MESSAGES.UNTERMINATED_TEST_MSG);
	});

	it('throws an error if only a \'given\' and \'when\' are used', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();
		// this.stubMockFixture(oTestRunner, 'fixture');

		oTestRunner.doGiven('fixture.prop = \'value\'');
		oTestRunner.doWhen('fixture.prop => \'value\'');

		expect(() => {
            oTestRunner.endTest();
        }).to.throw(ERROR_MESSAGES.UNTERMINATED_TEST_MSG);
	});

	it('throws an error if \'given\' is used after \'when\'', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();
		// this.stubMockFixture(oTestRunner, 'fixture');

        oTestRunner.doGiven('fixture.prop = \'value\'');
		oTestRunner.doWhen('fixture.prop => \'value\'');

        expect(() => {
            oTestRunner.doGiven('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.GIVEN_BEFORE_WHEN_AND_THEN_MSG);
	});

	it('throws an error if \'given\' is used after \'then\'', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();
		// this.stubMockFixture(oTestRunner, 'fixture');

        oTestRunner.doGiven('fixture.prop = \'value\'');
        oTestRunner.doThen('fixture.prop = \'value\'');

		expect(() => {
            oTestRunner.doGiven('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.GIVEN_BEFORE_WHEN_AND_THEN_MSG);
	});

	it('throws an error if \'when\' is used after \'then\'', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();
		// this.stubMockFixture(oTestRunner, 'fixture');

		expect(() => {
            oTestRunner.doWhen('fixture.prop => \'value\'');
        }).to.throw(ERROR_MESSAGES.WHEN_AFTER_GIVEN_AND_BEFORE_THEN_MSG);
	});

	it('does not throw an error if \'given\' \'when\' and \'then\' are used in the correct order', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
		oTestRunner.startTest();
		// this.stubMockFixture(oTestRunner, 'fixture');

		oTestRunner.doGiven('fixture.prop = \'value\'');
		oTestRunner.doWhen('fixture.prop => \'value\'');
		oTestRunner.doThen('fixture.prop = \'value\'');
		oTestRunner.endTest();
	});

	it('does not throw an error if \'given\' and \'then\' are used in the correct order', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();
        // this.stubMockFixture(oTestRunner, 'fixture');

        oTestRunner.doGiven('fixture.prop = \'value\'');
        oTestRunner.doThen('fixture.prop = \'value\'');
        oTestRunner.endTest();
	});

	it('can chain methods together using \'and\'', () => {
		var oTestRunner = new GwtTestRunner(TestFixtureFactory);
        oTestRunner.startTest();
        // this.stubMockFixture(oTestRunner, 'fixture');

        oTestRunner.doGiven('fixture.prop = \'value\'');
        oTestRunner.doAnd('fixture.prop = \'value\'');
        oTestRunner.doAnd('fixture.prop = \'value\'');

        oTestRunner.doWhen('fixture.prop => \'value\'');
        oTestRunner.doAnd('fixture.prop => \'value\'');
        oTestRunner.doAnd('fixture.prop => \'value\'');

        oTestRunner.doThen('fixture.prop = \'value\'');
        oTestRunner.doAnd('fixture.prop = \'value\'');
        oTestRunner.doAnd('fixture.prop = \'value\'');

        oTestRunner.endTest();
	});

});
