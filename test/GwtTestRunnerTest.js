
import GwtTestRunner from '../src/GwtTestRunner';

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

});
