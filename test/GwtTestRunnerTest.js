//TODO: check that fixture values are actually assigned - e.g. allows number values - check the value updates
// TODO: test setup and teardown on fixture factory are called
// TODO: 'test' and 'time' fixtures
// TODO: use continues from library


import GwtTestRunner, {ERROR_MESSAGES} from '../src/GwtTestRunner';
import TestFixtureFactory from './utils/TestFixtureFactory';

import chai from 'chai';
const expect = chai.expect;
const fail = chai.assert.fail;

describe('GWT Test Runner', () => {

	let oTestRunner;
	let oTestFixtureFactory;
	let replacedDescribeFn;
	let replacedBeforeEachFn;
	let replacedAfterEachFn;

	beforeEach(() => {
		oTestFixtureFactory = new TestFixtureFactory();
		oTestRunner = new GwtTestRunner(oTestFixtureFactory);
        oTestRunner.startTest();
	});

	afterEach(() => {
		if (typeof replacedDescribeFn !== 'undefined') {
			global.describe = replacedDescribeFn;
			replacedDescribeFn = null;
		}
		if (typeof replacedBeforeEachFn !== 'undefined') {
			global.beforeEach = replacedBeforeEachFn;
			replacedBeforeEachFn = null;
		}
		if (typeof replacedAfterEachFn !== 'undefined') {
			global.afterEach = replacedAfterEachFn;
			replacedAfterEachFn = null;
		}
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
        }).to.throw('The provided fixture factory does not implement the Fixture interface');
	});

	it('does not throw an error when the fixture factory is valid', () => {
		let ValidFixtureFactory = { addFixtures: function() {} };
		new GwtTestRunner(ValidFixtureFactory);
	});

	it('throws an error if \'when\' is used before \'given\'', () => {
		expect(() => {
            oTestRunner.doWhen('fixture.prop => \'value\'');
        }).to.throw(ERROR_MESSAGES.WHEN_AFTER_GIVEN_AND_BEFORE_THEN);
	});

	it('throws an error if \'then\' is used before \'given\'', () => {
		expect(() => {
            oTestRunner.doThen('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.THEN_AFTER_GIVEN_AND_WHEN);
	});

	it('throws an error if \'and\' is used before \'given\'', () => {
		expect(() => {
            oTestRunner.doAnd('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.AND_MUST_OCCUR_AFTER_GIVEN_WHEN_THEN);
	});

	it('throws an error if only a \'given\' is used', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');

		expect(() => {
            oTestRunner.endTest();
        }).to.throw(ERROR_MESSAGES.UNTERMINATED_TEST);
	});

	it('throws an error if only a \'given\' and \'when\' are used', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');
		oTestRunner.doWhen('fixture.prop => \'value\'');

		expect(() => {
            oTestRunner.endTest();
        }).to.throw(ERROR_MESSAGES.UNTERMINATED_TEST);
	});

	it('throws an error if \'given\' is used after \'when\'', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');
		oTestRunner.doWhen('fixture.prop => \'value\'');

        expect(() => {
            oTestRunner.doGiven('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.GIVEN_BEFORE_WHEN_AND_THEN);
	});

	it('throws an error if \'given\' is used after \'then\'', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');
        oTestRunner.doThen('fixture.prop = \'value\'');

		expect(() => {
            oTestRunner.doGiven('fixture.prop = \'value\'');
        }).to.throw(ERROR_MESSAGES.GIVEN_BEFORE_WHEN_AND_THEN);
	});

	it('throws an error if \'when\' is used after \'then\'', () => {
		expect(() => {
            oTestRunner.doWhen('fixture.prop => \'value\'');
        }).to.throw(ERROR_MESSAGES.WHEN_AFTER_GIVEN_AND_BEFORE_THEN);
	});

	it('does not throw an error if \'given\' \'when\' and \'then\' are used in the correct order', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');
		oTestRunner.doWhen('fixture.prop => \'value\'');
		oTestRunner.doThen('fixture.prop = \'value\'');
		oTestRunner.endTest();
	});

	it('does not throw an error if \'given\' and \'then\' are used in the correct order', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');
        oTestRunner.doThen('fixture.prop = \'value\'');
        oTestRunner.endTest();
	});

	it('can chain methods together using \'and\'', () => {
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

	it('will throw an error if \'whens\' use equals and not becomes', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');

		expect(() => {
            oTestRunner.doWhen('fixture = \'value\'');
        }).to.throw(ERROR_MESSAGES.WHEN_STATEMENTS_MUST_USE_BECOMES);
	});

	it('will throw an error if statements dont have a property', () => {
		expect(() => {
            oTestRunner.doGiven(' = \'value\'');
        }).to.throw(ERROR_MESSAGES.INVALID_STATEMENT_FORMAT);
	});

	it('will throw an error if statements dont have a value', () => {
		expect(() => {
            oTestRunner.doGiven('fixture.prop = ');
        }).to.throw(ERROR_MESSAGES.INVALID_STATEMENT_FORMAT);
	});

	it('will throw an error if a fixture doesnt exist', () => {
		expect(() => {
            oTestRunner.doGiven('nonExistentFixture.prop = \'value\'');
        }).to.throw('The fixture for \'nonExistentFixture.prop\' does not exist');
	});

	it('will throw an error if a fixture\'s property doesnt exist', () => {
		expect(() => {
            oTestRunner.doGiven('fixture.nonExistentProperty = \'value\'');
        }).to.throw('The fixture for \'fixture.nonExistentProperty\' does not exist');
	});

	it('allows equals sign to be contained in fixture name', () => {
		oTestRunner.doGiven('another=fixture.prop = \'value\'');
	});

	it('allows string values', () => {
		oTestRunner.doGiven('fixture.prop = \'value\'');
	});

	it('allows empty string values', () => {
		oTestRunner.doGiven('fixture.prop = \'\'');
	});

	it('allows apostrophes in string values', () => {
		oTestRunner.doGiven('fixture.prop = \'prop\'s value\'');
	});

	it('allows numbers as values', () => {
		oTestRunner.doGiven('fixture.prop = 42');
	});

	it('allows boolean values', () => {
		oTestRunner.doGiven('fixture.prop = true');
		oTestRunner.doAnd('fixture.prop = false');
	});

	it('allows array values', () => {
		oTestRunner.doGiven('fixture.prop = [\'value\', 42, true]');
	});

	it('throws an error if strings are not quoted', () => {
		expect(() => {
			oTestRunner.doGiven('fixture.prop = foo bar');
		}).to.throw('Unable to parse the property value \'foo bar\'. It was not a boolean, string or array.');
	});

	it('throws an error if fixtures are used as property fixtures', () => {
		expect(() => {
			oTestRunner.doGiven('fixture = \'value\'');
		}).to.throw('The fixture for \'fixture\' does not exist');
	});

	it('does not throw an error assigning values to property fixtures', () => {
		oTestRunner.doGiven('propertyFixture = \'value\'');
	});

	it('throws an error if no property on a property fixture is defined', () => {
		expect(() => {
			oTestRunner.doGiven('propertyFixture. = \'value\'');
		}).to.throw('The fixture for \'propertyFixture.\' does not exist');
	});

	it('does not throw an error assigning property values to property fixtures', () => {
		oTestRunner.doGiven('propertyFixture.prop = \'value\'');
	});

	it('allows symbols in property values', () => {
		oTestRunner.doGiven('propertyFixture.prop = \'value :@~#?!£$%^&* key\'');
	});

	it('allows newlines in property values', () => {
		oTestRunner.doGiven('propertyFixture.prop = \'1\n2\'');
        oTestRunner.doAnd('propertyFixture.prop = \'1\n2\n3\n4\'');
	});

	it('allows subfixtures to be accessed via their parent fixture', () => {
		oTestRunner.doGiven('parentFixture.subFixture1.prop = \'value\'');
		oTestRunner.doAnd('parentFixture.subFixture2.prop = \'value2\'');
	});

	it('allows subfixtures to be accessed via their grandparent fixture', () => {
		oTestRunner.doGiven('grandParentFixture.childFixture.subFixture1.prop = \'value\'');
	});

	xit('allows continuing from other tests', () => {
		// TODO: install continuable mocha here
		describe('test-suite #1', function()
        {
            it('test #1', function()
            {
                oTestRunner.doGiven('fixture.prop = \'value1\'');
            });
        });

		oTestRunner.doGiven('test.continuesFrom = \'test #1\'');
        oTestRunner.doGiven('fixture.prop = \'value2\'');
        oTestRunner.doThen('fixture.prop = \'value2\'');
        oTestRunner.endTest();
	});

	it('throws an error if a suite is already defined', () => {
		replacedDescribeFn = global.describe;
		replacedBeforeEachFn = global.beforeEach;
		replacedAfterEachFn = global.afterEach;
		global.describe = function() {
			return {
				fullTitle: function() {
					return 'my suite'
				}
			}
		};
		global.beforeEach = global.afterEach = function() { };
		expect(() => {
			GwtTestRunner.initialize(TestFixtureFactory);
			describe('my suite', function() { });
            describe('my suite', function() { });
		}).to.throw('The suite \'my suite\' has already been defined');
	});

});
