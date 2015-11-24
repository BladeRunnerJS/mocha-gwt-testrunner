
import {locateClass, stringifyInterface} from './Utils';
import FixtureFactoryInterface from './FixtureFactoryInterface';

import sprintf from 'sprintf';
import topiarist from 'topiarist';
import getGlobal from 'get-global';

const INIT_PHASE = 1;
const GIVEN_PHASE = 2;
const WHEN_PHASE = 3;
const THEN_PHASE = 4;

export const ERROR_MESSAGES = {
	GIVEN_BEFORE_WHEN_AND_THEN_MSG: '\'GIVEN\' statements must occur before \'WHEN\' and \'THEN\' statements.',
	WHEN_AFTER_GIVEN_AND_BEFORE_THEN_MSG: '\'WHEN\' statements must occur after \'GIVEN\' statements, but before \'THEN\' statements.',
	THEN_AFTER_GIVEN_AND_WHEN_MSG: '\'THEN\' statements must occur after \'GIVEN\' and \'WHEN\' statements.',
	AND_MUST_OCCUR_AFTER_GIVEN_WHEN_THEN_MSG: '\'AND\' statements can not occur until a \'GIVEN\', \'WHEN\' or \'THEN\' statement has been made.',
	UNTERMINATED_TEST_MSG: 'Tests must finish with one or more \'THEN\' statements',
	INVALID_PHASE_MESSAGE: 'Invalid phase state, current phase: \'%s\', called method phase \'%\''
};

function getNextPhase(currentPhase, calledMethodPhase) {
	switch(calledMethodPhase) {
		case GIVEN_PHASE:
			if (currentPhase === INIT_PHASE) {
				return GIVEN_PHASE;
			}
			throw new Error( ERROR_MESSAGES.GIVEN_BEFORE_WHEN_AND_THEN_MSG );
		case WHEN_PHASE:
			if (currentPhase === GIVEN_PHASE) {
				return WHEN_PHASE;
			}
			throw new Error( ERROR_MESSAGES.WHEN_AFTER_GIVEN_AND_BEFORE_THEN_MSG );
		case THEN_PHASE:
			if (currentPhase === GIVEN_PHASE || currentPhase === WHEN_PHASE) {
				return THEN_PHASE;
			}
			throw new Error( ERROR_MESSAGES.THEN_AFTER_GIVEN_AND_WHEN_MSG );
	}
	throw new Error( sprintf( ERROR_MESSAGES.INVALID_PHASE_MSG, currentPhase, calledMethodPhase) );
}

export default function GwtTestRunner(fixtureFactoryClass) {

	this.currentPhase = -1;

	switch (typeof fixtureFactoryClass) {
		case 'function':
			try {
				this.m_oFixtureFactory = new fixtureFactoryClass();
			} catch (e) {
				throw new Error( sprintf('An error occured when creating the fixture factory (%s): %s', fixtureFactoryClass.name, e.message) );
			}
			break;
		case 'object':
			this.m_oFixtureFactory = fixtureFactoryClass;
			break;
		default:
			throw new Error('fixtureFactoryClass must be an object or a constructor function');
	}

	if (!topiarist.fulfills(this.m_oFixtureFactory, FixtureFactoryInterface)) {
		throw new Error( sprintf('The provided fixture factory does not implement the interface %s', stringifyInterface(FixtureFactoryInterface)) );
	}

}

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
		throw new Error( ERROR_MESSAGES.UNTERMINATED_TEST_MSG );
	}
};

GwtTestRunner.prototype.doGiven = function(sStatement) {
	this.currentPhase = getNextPhase(this.currentPhase, GIVEN_PHASE);
};

GwtTestRunner.prototype.doWhen = function(sStatement) {
	this.currentPhase = getNextPhase(this.currentPhase, WHEN_PHASE);
};

GwtTestRunner.prototype.doThen = function(sStatement) {
	this.currentPhase = getNextPhase(this.currentPhase, THEN_PHASE);
};

GwtTestRunner.prototype.doAnd = function(sStatement) {
	switch (this.currentPhase) {
		case GIVEN_PHASE:
			this.doGiven(sStatement);
			break;
		case WHEN_PHASE:
			this.doWhen(sStatement);
			break;
		case THEN_PHASE:
			this.doThen(sStatement);
			break;
		default:
			throw new Error( ERROR_MESSAGES.AND_MUST_OCCUR_AFTER_GIVEN_WHEN_THEN_MSG );
	}
};
