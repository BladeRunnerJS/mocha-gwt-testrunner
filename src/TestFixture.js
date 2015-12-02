'use strict';

import Fixture from './Fixture';
import topiarist from 'topiarist';
import ContinueFrom from 'continuable-mocha';
// var ViewFixture = require('br/test/ViewFixture');


export default function TestFixture(gwtTestRunner) {
	this.m_oGwtTestRunner = gwtTestRunner;
}
topiarist.inherit(TestFixture, Fixture);

TestFixture.prototype.initialize = function() {
	ContinueFrom.install();
}

TestFixture.prototype.canHandleExactMatch = function() {
	return false;
};

TestFixture.prototype.canHandleProperty = function(property) {
	return property === 'continuesFrom';
};

TestFixture.prototype.addSubFixtures = function(fixtureRegistry) {
	// fixtureRegistry.addFixture('page', new ViewFixture('body'));
};

TestFixture.prototype.doGiven = function(propertyName, value) {
	if (propertyName === 'continuesFrom') {
		global.continueFrom(value);
		return;
	}
	throw new Error(propertyName+' is not property name supported by TestFixture');
};

TestFixture.prototype.doWhen = function(propertyName, value) {
	throw new Error('when is not supported by TestFixture');
};

TestFixture.prototype.doThen = function(propertyName, value) {
	throw new Error('then is not supported by TestFixture');
};

module.exports = TestFixture;
