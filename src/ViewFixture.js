/*global assertEquals*/
/**
 * @module br/test/ViewFixture
 */

/**
 * @class
 * @alias module:br/test/ViewFixture
 *
 * @classdesc
 * <p>The <code>ViewFixture</code> enables interacting with the rendered view via <code>ViewFixtureHandlers</code>. An
 * element in the view can be selected with jQuery selectors. In Given and When phases the selected element in the
 * view as well as its desired value will be passed as arguments to the <code>set()</code> method of a
 * <code>ViewFixtureHandler</code> which will update the element accordingly. In the Then phase the same arguments
 * will be passed to the <code>get()</code> method of a <code>ViewFixtureHandler</code>, which will then inspect the
 * selected view element and return a value of a particular property of this element to the <code>ViewFixture</code>.
 * The <code>ViewFixture</code> should mainly be used to check that the bindings between view elements in templates
 * and the corresponding presentation model properties have been specified correctly. A test might set a value on the
 * view element in the Given or When phases and then check in the Then phase that this value has been updated after
 * updating the relevant presentation model property.</p>
 *
 * <p>Assuming that the <code>ViewFixture</code> has been added with the identifier <code>view</code> as a subfixture
 * of the <code>ComponentFixture</code> which has the identifier <code>form</code>, then the <code>ViewFixture</code>
 * can be used in the following way in a test:</p>
 *
 * <pre>then("form.view.(.orderSummary [identifier=\'orderStatus\']).text = 'complete'");</pre>
 *
 * <p>In the above example the jQuery selector for the element in the view is
 * <code>.spotGeneralSummary [identifier=\'dealSubmittedFor\']</code> and it must be specified within parentheses. The
 * following part of the statement, <code>.text = 'test phrase'</code>, specifies the ViewFixtureHandler
 * (<code>Text</code>) and the value (<code>'test phrase'</code>) which will be passed to it. The <code>Text</code>
 * <code>ViewFixtureHandler</code> will then get the text value of the selected view element and return this value to
 * the <code>ViewFixture</code>. The test will pass if the text value of the selected view element is indeed equal to
 * <code>'test phrase'</code>.</p>
 */

import jQuery from 'jquery';
import br from '@brjs/br/modules/Core';
import Errors from '@brjs/br/modules/Errors';
import Fixture from './Fixture';

import BlurHandler from './viewhandler/BlurHandler';
import Blurred from './viewhandler/Blurred';
import Checked from './viewhandler/Checked';
import ChildrenCount from './viewhandler/ChildrenCount';
import ClassName from './viewhandler/ClassName';
import Clicked from './viewhandler/Clicked';
import BackgroundImage from './viewhandler/BackgroundImage';
import DoesNotHaveClass from './viewhandler/DoesNotHaveClass';
import Enabled from './viewhandler/Enabled';
import FocusIn from './viewhandler/FocusIn';
import FocusOut from './viewhandler/FocusOut';
import Focused from './viewhandler/Focused';
import HasClass from './viewhandler/HasClass';
import Height from './viewhandler/Height';
import IsVisible from './viewhandler/IsVisible';
import MouseDown from './viewhandler/MouseDown';
import MouseMove from './viewhandler/MouseMove';
import MouseOut from './viewhandler/MouseOut';
import MouseOver from './viewhandler/MouseOver';
import MouseUp from './viewhandler/MouseUp';
import OnKeyUp from './viewhandler/OnKeyUp';
import Options from './viewhandler/Options';
import Readonly from './viewhandler/Readonly';
import RightClicked from './viewhandler/RightClicked';
import ScrolledHorizontal from './viewhandler/ScrolledHorizontal';
import ScrolledVertical from './viewhandler/ScrolledVertical';
import Selected from './viewhandler/Selected';
import Text from './viewhandler/Text';
import TypedValue from './viewhandler/TypedValue';
import Value from './viewhandler/Value';
import Width from './viewhandler/Width';
import BorderWidth from './viewhandler/BorderWidth';
import BorderColor from './viewhandler/BorderColor';
import TopMarginWidth from './viewhandler/TopMarginWidth';
import BottomMarginWidth from './viewhandler/BottomMarginWidth';
import RightMarginWidth from './viewhandler/RightMarginWidth';
import LeftMarginWidth from './viewhandler/LeftMarginWidth';
import Color from './viewhandler/Color';
import OnKeyDown from './viewhandler/OnKeyDown';
import Top from './viewhandler/Top';

/**
 * Constructs a <code>br.test.ViewFixture</code>.
 * @implements module:br/test/Fixture
 * @alias module:br/test/ViewFixture
 * @class
 * @param {String} viewSelector (optional) CSS selector to identify the parent view element for this fixture
 */
function ViewFixture(viewSelector) {
	this.sViewSelector = viewSelector || null;

	this.mViewHandlers = {
		blurred: new Blurred(),
		checked: new Checked(),
		childrenCount: new ChildrenCount(),
		className: new ClassName(),
		clicked: new Clicked(),
		backgroundImage: new BackgroundImage(),
		doesNotHaveClass: new DoesNotHaveClass(),
		enabled: new Enabled(),
		focusIn: new FocusIn(),
		focusOut: new FocusOut(),
		focused: new Focused(),
		hasClass: new HasClass(),
		height: new Height(),
		isVisible: new IsVisible(),
		mouseDown: new MouseDown(),
		mouseMove: new MouseMove(),
		mouseOut: new MouseOut(),
		mouseOver: new MouseOver(),
		mouseUp: new MouseUp(),
		onKeyUp: new OnKeyUp(),
		options: new Options(),
		readonly: new Readonly(),
		rightClicked: new RightClicked(),
		scrolledHorizontal: new ScrolledHorizontal(),
		scrolledVertical: new ScrolledVertical(),
		selected: new Selected(),
		text: new Text(),
		typedValue: new TypedValue(),
		value: new Value(),
		width: new Width(),
		borderWidth: new BorderWidth(),
		borderColor: new BorderColor(),
		topMarginWidth: new TopMarginWidth(),
		bottomMarginWidth: new BottomMarginWidth(),
		rightMarginWidth: new RightMarginWidth(),
		leftMarginWidth: new LeftMarginWidth(),
		color: new Color(),
		onKeyDown: new OnKeyDown(),
		top: new Top()
	};

	this.mSelectorMappings = {};
}
br.inherit(ViewFixture, Fixture);

ViewFixture.prototype.setUp = function() {
	var viewElements;

	if (this.sViewSelector) {
		viewElements = jQuery(this.sViewSelector);
		this._verifyOnlyOneElementSelected(viewElements, this.sViewSelector);
		this.setViewElement(viewElements[0]);
	}
};

ViewFixture.prototype.tearDown = function() {
	this.eViewElement = null;

	if (this.oBlurHandler) {
		this.oBlurHandler.destroy();
	}
};

/**
 * Allows custom view handlers to be added.
 * @param {Map} viewHandlersMap A map of handler name to handler class constructor reference.
 * @throws {br.Errors.InvalidParametersError} If an attempt is made to override an existing handler.
 */
ViewFixture.prototype.addViewHandlers = function(viewHandlersMap) {
	var keys = Object.keys(viewHandlersMap),
		existingHandlers = [];

	keys.forEach(function(key) {
		if (this.mViewHandlers.hasOwnProperty(key)) {
			existingHandlers.push('\'' + key + '\'');
			return;
		}
	}, this);

	if (existingHandlers.length > 0) {
		throw new Errors.InvalidParametersError(
			'The following view handlers were not added to the registry as they already exist: ' +
				existingHandlers.join(',')
		);
	}

	keys.forEach(function(key) {
		this.mViewHandlers[key] = new (viewHandlersMap[key])();
	}, this);
};

/**
 * Set the selector mappings to use with this fixture.
 * <p>This allows users to create a shorthand for a selector, so that the same selector doesn't need to be repeated
 *  across different tests.</p>
 * <p>Calling: <code>viewFixture.setSelectorMappings({'my-mapping': '.some .selector'});</code> then allows you to use
 *  that mapping in the test: <code>then("form.view.(my-mapping).text = 'foo'");</code>.</p>
 * @param {Object} selectorMappings Map of selector mappings.
 */
ViewFixture.prototype.setSelectorMappings = function(selectorMappings) {
	this.mSelectorMappings = selectorMappings;
};

ViewFixture.prototype.setViewElement = function(viewElement) {
	this.eViewElement = viewElement;
	this.oBlurHandler = new BlurHandler(viewElement);
};

ViewFixture.prototype.getViewElement = function() {
	return this.eViewElement;
};

ViewFixture.prototype.setViewElementWithoutAttachingBlurHandler = function(viewElement) {
	this.eViewElement = viewElement;
};

ViewFixture.prototype.setComponent = function(Component) {
	this.oComponent = Component;
};

ViewFixture.prototype.getComponent = function() {
	return this.oComponent;
};

ViewFixture.prototype.canHandleProperty = function(/*propertyName*/) {
	return true;
};

ViewFixture.prototype.canHandleExactMatch = function() {
	return false;
};

ViewFixture.prototype.doGivenAndDoWhen = function(propertyName, value) {
	var handler = this._getHandler(propertyName, value);

	if (handler.property === 'count') {
		throw new Errors.InvalidTestError('The "count" property can only be used in then statements.');
	} else {
		handler.viewFixtureHandler.set(handler.selectedElement, value);
	}
};

ViewFixture.prototype.doGiven = ViewFixture.prototype.doGivenAndDoWhen;
ViewFixture.prototype.doWhen = ViewFixture.prototype.doGivenAndDoWhen;

ViewFixture.prototype.doThen = function(propertyName, value) {
	var handler = this._getHandler(propertyName, value);

	if (handler.property === 'count') {
		assertEquals('"count" should be ' + value, value, handler.elements.length);
	} else {
		assertEquals(
			'"' + handler.property + '" should be ' + value,
			value,
			handler.viewFixtureHandler.get(handler.selectedElement, value)
		);
	}
};

/** @private */
ViewFixture.prototype._getHandler = function(propertyName, value) {
	var handler = {};

	handler.property = this._getPropertyName(propertyName);
	handler.elements = this._getViewElements(propertyName);

	if (handler.property !== 'count') {
		handler.viewFixtureHandler = this._getViewHandler(handler.property);

		if (handler.elements.length === 1) {
			handler.selectedElement = handler.elements[0];
		} else {
			this._verifyOnlyOneElementSelected(handler.elements, handler.property, propertyName, value);
		}
	}

	return handler;
};

/** @private */
ViewFixture.prototype._getPropertyName = function (propertyName) {
	return propertyName.match(/[^\.]*$/)[0];
};

/** @private */
ViewFixture.prototype._getViewElements = function(propertyName) {
	var selector = propertyName.match(/\((.*)\)\.[^.]+/)[1];

	if (typeof this.mSelectorMappings[selector] !== 'undefined') {
		selector = this.mSelectorMappings[selector];
	}

	return jQuery(this.eViewElement).find(selector);
};

/** @private */
ViewFixture.prototype._verifyOnlyOneElementSelected = function(elements, viewHandler, propertyName, value) {
	var exceptionMessage = '';
	if (elements.length === 0) {
		exceptionMessage = 'No view element found for "' + viewHandler + '".';
	} else if (elements.length > 1) {
		exceptionMessage = 'More than one view element found for "' + viewHandler + '".';
	}

	if (exceptionMessage !== '') {
		if (typeof propertyName !== 'undefined') {
			exceptionMessage += ' Processing property "' + propertyName + '" and looking for value "' + value + '".';
		}

		throw exceptionMessage;
	}
};

ViewFixture.prototype._getViewHandler = function(propertyName) {
	var handler = this.mViewHandlers[propertyName];

	if (!handler) {
		throw new Errors.InvalidTestError('Undefined view fixture handler "' + propertyName + '"');
	}

	return handler;
};

export default ViewFixture;
