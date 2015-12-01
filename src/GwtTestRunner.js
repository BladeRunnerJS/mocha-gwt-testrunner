
import {locateClass, stringifyInterface} from './Utils';
import FixtureFactory from './FixtureFactory';
import SubFixtureRegistry from './SubFixtureRegistry';

import sprintf from 'sprintf';
import topiarist from 'topiarist';
import getGlobal from 'get-global';

const INIT_PHASE = 0;
const GIVEN_PHASE = 1;
const GIVEN_AND_PHASE = 1.5;
const WHEN_PHASE = 2;
const WHEN_AND_PHASE = 2.5;
const THEN_PHASE = 3;
const THEN_AND_PHASE = 3.5;

const REGEX_NEWLINE_PLACEHOLDER = '<!--space--!>';

export const ERROR_MESSAGES = {
	GIVEN_BEFORE_WHEN_AND_THEN: '\'GIVEN\' statements must occur before \'WHEN\' and \'THEN\' statements.',
	WHEN_AFTER_GIVEN_AND_BEFORE_THEN: '\'WHEN\' statements must occur after \'GIVEN\' statements, but before \'THEN\' statements.',
	THEN_AFTER_GIVEN_AND_WHEN: '\'THEN\' statements must occur after \'GIVEN\' and \'WHEN\' statements.',
	AND_MUST_OCCUR_AFTER_GIVEN_WHEN_THEN: '\'AND\' statements can not occur until a \'GIVEN\', \'WHEN\' or \'THEN\' statement has been made.',
	UNTERMINATED_TEST: 'Tests must finish with one or more \'THEN\' statements',
	INVALID_PHASE_MESSAGE: 'Invalid phase state, current phase: \'%s\', called method phase \'%\'',
	WHEN_STATEMENTS_MUST_USE_BECOMES: '\'WHEN\' statements should use => as an operator',
	INVALID_STATEMENT_FORMAT: 'Statements should have the form <fixtureName>.<propertyName> <operator> <propertyValue>',
	FIXTURE_NOT_FOUND: 'The fixture for \'%s\' does not exist',
	UNABLE_TO_PARSE_PROPERTY: 'Unable to parse the property value \'%s\'. It was not a boolean, string or array.'
};

function majorPhase(phase) {
	return Math.floor(phase);
}

function getNextPhase(currentPhase, calledMethodPhase) {
	let currentMajorPhase = majorPhase(currentPhase);
	switch(calledMethodPhase) {
		case GIVEN_PHASE:
			if (currentMajorPhase === INIT_PHASE || currentPhase === GIVEN_AND_PHASE) {
				return (currentPhase === GIVEN_AND_PHASE) ? currentPhase : GIVEN_PHASE;
			}
			throw new Error( ERROR_MESSAGES.GIVEN_BEFORE_WHEN_AND_THEN );
		case WHEN_PHASE:
			if (currentMajorPhase === GIVEN_PHASE || currentPhase === WHEN_AND_PHASE) {
				return (currentPhase === WHEN_AND_PHASE) ? currentPhase : WHEN_PHASE;
			}
			throw new Error( ERROR_MESSAGES.WHEN_AFTER_GIVEN_AND_BEFORE_THEN );
		case THEN_PHASE:
			if (currentMajorPhase === GIVEN_PHASE || currentMajorPhase === WHEN_PHASE || currentPhase === THEN_AND_PHASE) {
				return (currentPhase === THEN_AND_PHASE) ? currentPhase : THEN_PHASE;
			}
			throw new Error( ERROR_MESSAGES.THEN_AFTER_GIVEN_AND_WHEN );
	}
	throw new Error( sprintf( ERROR_MESSAGES.INVALID_PHASE, currentPhase, calledMethodPhase) );
}

function addFixtureToStatement(oStatement, fixtures) {

	for(var i = 0, l = fixtures.length; i < l; ++i) {
		var oNextFixture = fixtures[i];

		if (oStatement.property.match(oNextFixture.scopeMatcher)) {
			var sFixtureProperty = oStatement.property.substr(oNextFixture.scopeLength);
			var bCanHandleProperty = (sFixtureProperty.length > 0) ? oNextFixture.fixture.canHandleProperty(sFixtureProperty) :
				oNextFixture.fixture.canHandleExactMatch();

			if (bCanHandleProperty) {
				oStatement.fixture = oNextFixture.fixture;
				oStatement.propertyName = sFixtureProperty;
				break;
			}
		}
	}
}

function getTypedPropertyValue(sValue) {

	if (sValue === 'true') {
		return true;
	} else if (sValue === 'false') {
		return false;
	} else if (sValue === 'undefined') {
		return undefined;
	} else if (sValue.match(/^'[.\s\S]*'$/)) {
		return sValue.substr(1, sValue.length - 2);
	} else if (!isNaN(sValue)) {
		return Number(sValue);
	} else if (sValue.match(/^\[.*\]$/)) {
		var pItems = sValue.substr(1, sValue.length - 2).split(/ *, */);

		let vValue = [];
		for(var i = 0, l = pItems.length; i < l; ++i) {
			vValue[i] = getTypedPropertyValue(pItems[i]);
		}
		return vValue;
	}

	throw new Error( sprintf(ERROR_MESSAGES.UNABLE_TO_PARSE_PROPERTY, sValue) );
}

function parseStatement(sStatement, currentPhase, fixtures) {
	sStatement = sStatement.replace(new RegExp('\n', 'g'), REGEX_NEWLINE_PLACEHOLDER);

	/**
	 * Parses Statements in the format <fixtureName>.<propertyName> <operator> <propertyValue>
	 * uses '[\x21-\x7E]' rather than '.' to match any character so that newlines can be included too
	 */
	var pStatement = /(.+) (\=\>|\=) (.+)/i.exec(sStatement);

	if (pStatement) {
		for (var i = 0; i < pStatement.length; i++) {
			pStatement[i] = (pStatement[i].trim());
		}
	}

	if (!pStatement || (pStatement.length !== 4) || !pStatement[1] || !pStatement[2] || !pStatement[3]) {
		throw new Error(ERROR_MESSAGES.INVALID_STATEMENT_FORMAT);
	}

	var oStatement = {
		property: (pStatement[1].trim()),
		operator: pStatement[2],
		propertyValue: getTypedPropertyValue(pStatement[3].replace(new RegExp(REGEX_NEWLINE_PLACEHOLDER, 'g'), '\n'))
	};

	let currentMajorPhase = majorPhase(currentPhase);
	if (currentMajorPhase === WHEN_PHASE && oStatement.operator !== '=>') {
		throw new Error('\'WHEN\' statements should use => as an operator');
	}

	addFixtureToStatement(oStatement, fixtures);
	if (!oStatement.fixture) {
		throw new Error( sprintf(ERROR_MESSAGES.FIXTURE_NOT_FOUND, oStatement.property) );
	}

	return oStatement;
}



/*############ PUBLIC API ############*/

export default function GwtTestRunner(FixtureFactoryClass) {

	this.currentPhase = -1;
	this.fixtures = [];

	switch (typeof FixtureFactoryClass) {
		case 'function':
			try {
				this.m_oFixtureFactory = new FixtureFactoryClass();
			} catch (e) {
				throw new Error( sprintf('An error occured when creating the fixture factory (%s): %s', FixtureFactoryClass.name, e.message) );
			}
			break;
		case 'object':
			this.m_oFixtureFactory = FixtureFactoryClass;
			break;
		default:
			throw new Error('fixtureFactoryClass must be an object or a constructor function');
	}

	if (!topiarist.fulfills(this.m_oFixtureFactory, FixtureFactory)) {
		throw new Error( sprintf('The provided fixture factory does not implement the Fixture interface', stringifyInterface(FixtureFactory)) );
	}

	this.m_oFixtureFactory.addFixtures(this);

}

GwtTestRunner.prototype.addFixture = function(sScope, oFixture) {
	this.fixtures.push({scopeMatcher:new RegExp('^' + sScope + '(\\..+|$)'), scopeLength:sScope.length + 1, fixture:oFixture});
	oFixture.addSubFixtures(new SubFixtureRegistry(this, sScope));
};

GwtTestRunner.prototype.startTest = function() {
	const GLOBAL = getGlobal();

	let createTestMethod = function(oTestRunner, sMethod) {
		return function(sStatement) {
			oTestRunner[sMethod](sStatement);
		};
	};

	this.currentPhase = INIT_PHASE;

	GLOBAL.given = createTestMethod(this, 'doGiven');
	GLOBAL.when = createTestMethod(this, 'doWhen');
	GLOBAL.then = createTestMethod(this, 'doThen');
	GLOBAL.and = createTestMethod(this, 'doAnd');

};

GwtTestRunner.prototype.endTest = function() {
	if (!this.m_bTestFailed && (this.currentPhase === GIVEN_PHASE || this.currentPhase === WHEN_PHASE)) {
		throw new Error( ERROR_MESSAGES.UNTERMINATED_TEST );
	}
};

GwtTestRunner.prototype.doGiven = function(sStatement) {
	this.currentPhase = getNextPhase(this.currentPhase, GIVEN_PHASE);
	let oStatement = parseStatement(sStatement, this.currentPhase, this.fixtures);
};

GwtTestRunner.prototype.doWhen = function(sStatement) {
	this.currentPhase = getNextPhase(this.currentPhase, WHEN_PHASE);
	let oStatement = parseStatement(sStatement, this.currentPhase, this.fixtures);
};

GwtTestRunner.prototype.doThen = function(sStatement) {
	this.currentPhase = getNextPhase(this.currentPhase, THEN_PHASE);
	let oStatement = parseStatement(sStatement, this.currentPhase, this.fixtures);
};

GwtTestRunner.prototype.doAnd = function(sStatement) {
	switch (this.currentPhase) {
		case GIVEN_PHASE:
		case GIVEN_AND_PHASE:
			this.currentPhase = GIVEN_AND_PHASE;
			this.doGiven(sStatement);
			break;
		case WHEN_PHASE:
		case WHEN_AND_PHASE:
			this.currentPhase = WHEN_AND_PHASE;
			this.doWhen(sStatement);
			break;
		case THEN_PHASE:
		case THEN_AND_PHASE:
			this.currentPhase = THEN_AND_PHASE;
			this.doThen(sStatement);
			break;
		default:
			throw new Error( ERROR_MESSAGES.AND_MUST_OCCUR_AFTER_GIVEN_WHEN_THEN );
	}
};
