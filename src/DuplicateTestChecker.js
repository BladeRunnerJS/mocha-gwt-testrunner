const definedSuites = {};

let mochaDescribe;
let mochaIt;

function createProxyDescribeFunction(proxyFunction) {
	return function(title, func) {
		let suite = proxyFunction(title, func);
		let suiteTitle = suite.fullTitle();
		if (definedSuites[suiteTitle]) {
			throw new Error('The suite \'' + suiteTitle + '\' has already been defined');
		}
		definedSuites[suiteTitle] = true;
		return suite;
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
};
