
const definedSuites = [];

let mochaDescribe;
let mochaIt;

function createProxyDescribeFunction(proxyFunction) {
	return function() {
		let suite = proxyFunction();
		let suiteTitle = suite.fullTitle();
		if (definedSuites.includes(suiteTitle)) {
			throw new Error('The suite \''+suiteTitle+'\' has already been defined');
		}
		definedSuites.push(suiteTitle);
	};
}

function createProxyItFunction(proxyFunction) {
	return proxyFunction;
}

export default {
	install: function() {
		mochaDescribe = global.describe;
		mochaIt = global.it;

		global.describe = createProxyDescribeFunction(mochaDescribe);
		global.it = createProxyItFunction(mochaIt);
	}
}