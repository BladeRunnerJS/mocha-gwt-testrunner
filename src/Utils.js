import getGlobal from 'get-global';

function parsePath(path, root, separator) {
	return path.split(separator).reduce(function(accumulator, value) {
		if (typeof accumulator !== 'undefined' && accumulator !== null) {
			return accumulator[value];
		}
		return undefined;
	}, root);
}

export function locateClass(path, root) {
	if (typeof path !== 'string') {
		throw new TypeError('Utility.locate: Path must be a string, was ' + typeof path + '.');
	}

	if (arguments.length < 2) {
		root = getGlobal();
	}

	if (path.indexOf('.') > -1 && path.indexOf('/') === -1) {
		return parsePath(path, root, '.');
	}

	if (path.indexOf('/') > -1 && path.indexOf('.') === -1) {
		return parsePath(path, root, '/');
	}

	var parsedPath = parsePath(path, root, '.');
	if (typeof parsedPath === 'undefined') {
		parsedPath = parsePath(path, root, '/');
	}
	return parsedPath;
}

export function stringifyInterface(fInterface) {
	let separator = ', ';

	let stringyValue = '{ ';

	for (var property in fInterface) {
		if (fInterface.hasOwnProperty(property)) {
			stringyValue += property + ': ' + fInterface[property] + separator;
		}
	}
	// remove the final separator that was added
	stringyValue = stringyValue.slice(0, stringyValue.length - separator.length);

	stringyValue += ' }';

	return stringyValue;
}
