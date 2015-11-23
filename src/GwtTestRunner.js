
import {locateClass, stringifyInterface} from './Utils';
import FixtureFactoryInterface from './FixtureFactoryInterface';

import sprintf from 'sprintf';
import topiarist from 'topiarist';

export default function GwtTestRunner(fixtureFactoryClass) {

	this.m_pFixtures = [];

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

