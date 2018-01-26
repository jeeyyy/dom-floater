(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["DomFloater"] = factory();
	else
		root["DomFloater"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			memo[selector] = fn.call(this, selector);
		}

		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(7);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton) options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var CONSTANTS = exports.CONSTANTS = {
    TIME_SPAN: {
        MS_50: 50,
        MS_300: 300
    },
    MESSAGES: {
        ERROR_NO_DOCUMENT_BODY: "No document or html body present.",
        ERROR_IN_CONFIGURATION_NO_TYPE: "Error in Floater Configuration. No Floater Type provided",
        ERROR_IN_CONFIGURATION_NO_CONTENT_ELEMENT_TYPE: "Error in Floater Configuration. No Content Element Type provided",
        ERROR_IN_CONFIGURATION_NO_POPUP_TARGET: "Error in Floater Configuration. No Popup Target Element provided.",
        ERROR_IN_FINDING_POPUP_SCROLLABLE_PARENT: "Error in finding scrollable parent with supplied selector. Cannot position and track popup position with out correct parent reference. Kindly check supplied selector.",
        ERROR_IN_CONFIGURATION_NO_SLIDEOUT_TARGET: "Error in Floater Configuration. No Slide Out Target Element provided."
    },
    COMMON_KEY_CODES: {
        BACKSPACE: 8,
        RETURN: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        a: 65,
        b: 66,
        F: 70,
        k: 75,
        m: 77,
        WIN_or_CMD: 91 // to detect cmd on key up use this, on keydown you can use event.metaKey
    },
    KEYS: {
        BACKSPACE: 8,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        DELETE: 46,
        HOME: 36,
        END: 35,
        PAGEUP: 33,
        PAGEDOWN: 34,
        INSERT: 45,
        ZERO: 48,
        ONE: 49,
        TWO: 50,
        A: 65,
        L: 76,
        P: 80,
        Q: 81,
        TILDA: 192
    },
    BREAKPOINTS: {
        XS: 400,
        SM: 680,
        MD: 1024,
        LG: 1200
    }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FloaterInstances = exports.FloaterInstances = function () {
    function FloaterInstances() {
        _classCallCheck(this, FloaterInstances);

        this._instances = {}; // dynamically created objects - key value pairs
    }

    _createClass(FloaterInstances, [{
        key: "add",
        value: function add(floater) {
            this._instances[floater.getGuid()] = floater;
            console.debug(this._instances);
        }
    }, {
        key: "destroy",
        value: function destroy(floater) {
            var guid = floater.getGuid();
            var floaterInstance = this._instances[guid];
            if (floaterInstance) floaterInstance.destroy();
            delete this._instances[guid];
            console.debug(this._instances);
        }
    }, {
        key: "getInstanceById",
        value: function getInstanceById(guid) {
            return this._instances[guid];
        }
    }, {
        key: "getInstancesOfType",
        value: function getInstancesOfType(instanceType) {
            var _this = this;

            var instances = Object.keys(this._instances);
            var result = [];
            Object.keys(this._instances).forEach(function (instanceGuid) {
                var instance = _this.getInstanceById(instanceGuid);
                if (instance && instance.getConfiguration().type === instanceType) {
                    result.push(instance);
                }
            });
            return result;
        }
    }]);

    return FloaterInstances;
}();

var floaterInstances = exports.floaterInstances = new FloaterInstances();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DomFloaterManager = exports.DomFloater = undefined;

__webpack_require__(5);

var _floater = __webpack_require__(8);

var domFloater = _interopRequireWildcard(_floater);

var _floaterManager = __webpack_require__(22);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var DomFloater = exports.DomFloater = domFloater;
var DomFloaterManager = exports.DomFloaterManager = _floaterManager.floaterManager;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js!./index.pcss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js??ref--1-1!../node_modules/postcss-loader/lib/index.js!./index.pcss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "// Utility styles on attributes.\r\n[data-is-initialising=\"true\"] {\r\n   opacity: 0;\r\n }\r\n\r\n[data-is-destructing=\"true\"] {\r\n   opacity: 0;\r\n }", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(9);

var _constants = __webpack_require__(2);

var _interfaces = __webpack_require__(11);

var _floaterInstances = __webpack_require__(3);

var _masker = __webpack_require__(12);

var _toasterContainer = __webpack_require__(15);

var _util = __webpack_require__(18);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nanoId = __webpack_require__(19);
var requestInterval = __webpack_require__(21);

/**
 * A floating element that takes any content and intelligently positions as per configuration or to a given target.
 * @constructor
 */
var Floater = function () {
    function Floater(configuration) {
        _classCallCheck(this, Floater);

        this.configuration = configuration;
        this._destroyBoundWithThis = this.destroy.bind(this);
        this._callbacks = {}; // dynamically constructed object
        this._dynamicRefs = {
            CONTENT_ELEMENT_WHEN_NODE_PROPS: {
                PARENT_REF: null,
                SIBLING_REF: null,
                IS_LAST_CHILD: null
            },
            POPUP_PROPS: {
                SCROLLABLE_PARENT_REF: null,
                POSITION_INTERVAL: null,
                PREVIOUS_COMPUTED_RECT_FOR_TARGET: null
            }
        };
        // extend config object with guid
        configuration.guid = nanoId();
        // create DOM
        this._hostElement = document.createElement("ARTICLE");
        this._hostElement.className = this._getClassName(this.configuration);
        this._hostElement.dataset["guid"] = configuration.guid;
        this._hostElement.dataset["isInitialising"] = "true";
        if (configuration.contentElement) {
            if (this.configuration.contentElementType === _interfaces.IFloater.ContentElementType.TEMPLATE) {
                this._hostElement.innerHTML = configuration.contentElement;
            } else if (this.configuration.contentElementType === _interfaces.IFloater.ContentElementType.NODE) {
                this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.PARENT_REF = configuration.contentElement.parentElement;
                this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.SIBLING_REF = configuration.contentElement.nextElementSibling ? configuration.contentElement.nextElementSibling : configuration.contentElement.previousElementSibling;
                this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.IS_LAST_CHILD = configuration.contentElement.nextElementSibling ? false : true;
                this._hostElement.insertBefore(configuration.contentElement, this._hostElement.firstChild); // first child is always empty.
            } else {
                throw new Error(_constants.CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_CONTENT_ELEMENT_TYPE);
            }
        }
        // add to floater instances
        _floaterInstances.floaterInstances.add(this);
    }

    _createClass(Floater, [{
        key: "show",
        value: function show() {
            var getCurrentInstanceOfType = _floaterInstances.floaterInstances.getInstancesOfType(this.configuration.type);
            if (this.configuration.type) {
                switch (this.configuration.type) {
                    case _interfaces.IFloater.Type.MODAL:
                        {
                            return this._handleShowModal(getCurrentInstanceOfType);
                        }
                    case _interfaces.IFloater.Type.TOAST:
                        {
                            return this._handleShowToast(getCurrentInstanceOfType);
                        }
                    case _interfaces.IFloater.Type.POPUP:
                        {
                            return this._handleShowPopup(getCurrentInstanceOfType);
                        }
                    case _interfaces.IFloater.Type.SLIDEOUT:
                        {
                            return this._handleShowSlideOut(getCurrentInstanceOfType);
                        }
                }
            } else {
                throw new Error(_constants.CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_TYPE);
            }
        }
    }, {
        key: "destroy",
        value: function destroy() {
            var _this = this;

            // visual indicator for this element and delegate to the modal
            this._hostElement.dataset["isDestructing"] = "true";
            if (this.configuration.contentElement) {
                if (this.configuration.contentElementType === _interfaces.IFloater.ContentElementType.NODE) {
                    if (this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.PARENT_REF) {
                        this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.PARENT_REF.insertBefore(this.configuration.contentElement, !this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.IS_LAST_CHILD ? this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.SIBLING_REF : this._dynamicRefs.CONTENT_ELEMENT_WHEN_NODE_PROPS.SIBLING_REF.nextSibling);
                    }
                }
            }
            switch (this.configuration.type) {
                case _interfaces.IFloater.Type.MODAL:
                    var doesMaskAlreadyExist = _floaterInstances.floaterInstances.getInstancesOfType(_interfaces.IFloater.Type.MODAL);
                    if (doesMaskAlreadyExist.length <= 1 && this.configuration.modalMask) {
                        _masker.masker.destroy();
                    }
                    break;
                case _interfaces.IFloater.Type.TOAST:
                    break;
                case _interfaces.IFloater.Type.POPUP:
                    if (this._dynamicRefs.POPUP_PROPS.POSITION_INTERVAL) {
                        requestInterval.clear(this._dynamicRefs.POPUP_PROPS.POSITION_INTERVAL);
                    }
                    break;
            }
            this._dynamicRefs = null;
            return new Promise(function (resolve) {
                requestAnimationFrame(function () {
                    // remove floater instance management
                    _floaterInstances.floaterInstances.destroy(_this);
                    // remove from DOM
                    if (_this._hostElement.parentElement) {
                        _this._hostElement.parentElement.removeChild(_this._hostElement);
                    }
                    resolve();
                });
            });
        }
    }, {
        key: "getConfiguration",
        value: function getConfiguration() {
            return this.configuration;
        }
    }, {
        key: "getGuid",
        value: function getGuid() {
            return this.configuration.guid;
        }
    }, {
        key: "getContentElementWithSelector",
        value: function getContentElementWithSelector(selector) {
            return this._hostElement.getElementsByClassName(selector)[0];
        }
    }, {
        key: "getFloaterElementFromChild",
        value: function getFloaterElementFromChild(contentChildElement) {
            while (contentChildElement.parentNode) {
                contentChildElement = contentChildElement.parentNode;
                if (contentChildElement && contentChildElement.classList && contentChildElement.classList.length && contentChildElement.classList.contains("dom-floater-base")) {
                    return contentChildElement;
                }
            }
            return null;
        }
    }, {
        key: "_getClassName",
        value: function _getClassName(config) {
            var baseClass = "dom-floater-base " + config.type;
            switch (config.type) {
                case _interfaces.IFloater.Type.MODAL:
                    return baseClass + " " + (config.modalMask ? config.modalMask : 'MASK');
                case _interfaces.IFloater.Type.TOAST:
                    return baseClass + " " + (config.toastPosition ? config.toastPosition : '');
                case _interfaces.IFloater.Type.POPUP:
                    return "" + baseClass;
                case _interfaces.IFloater.Type.SLIDEOUT:
                    return baseClass + " " + (config.slideOutPosition ? config.slideOutPosition : '') + " " + (config.slideOutMask ? config.slideOutMask : 'MASK');
            }
        }
    }, {
        key: "_getFloaterParentWithSelector",
        value: function _getFloaterParentWithSelector(startEl, selector) {
            while (startEl.parentNode) {
                startEl = startEl.parentNode;
                if (startEl && startEl.classList && startEl.classList.length && startEl.classList.contains(selector)) {
                    return startEl;
                }
            }
            return null;
        }
    }, {
        key: "_destructOnExpiry",
        value: function _destructOnExpiry(expiryDurtaion) {
            var _this2 = this;

            var timer = void 0;
            return function () {
                clearTimeout(timer); // be sure to clear if object exists.
                timer = setTimeout(function () {
                    _this2._destroyBoundWithThis();
                    clearTimeout(timer);
                }, expiryDurtaion);
            };
        }
    }, {
        key: "_destructOnEscape",
        value: function _destructOnEscape() {
            var _this3 = this;

            document.addEventListener("keyup", function (event) {
                if (event.keyCode === _constants.CONSTANTS.COMMON_KEY_CODES.ESC) {
                    _this3._destroyBoundWithThis();
                }
            });
        }
    }, {
        key: "_destructOnDocumentClick",
        value: function _destructOnDocumentClick() {
            var _this4 = this;

            document.addEventListener("click", function (event) {
                var isChildElement = _this4.getFloaterElementFromChild(event.srcElement);
                if (isChildElement === null) {
                    _this4._destroyBoundWithThis();
                }
            });
        }
    }, {
        key: "_handleShowModal",
        value: function _handleShowModal(getCurrentInstanceOfType) {
            // only init a mask element if this is the first modal that is shown
            if (getCurrentInstanceOfType && getCurrentInstanceOfType.length <= 1 && this.configuration.modalMask) {
                _masker.masker.init();
            }
            // create Modal
            document.body.appendChild(this._hostElement);
            this._handleShow();
        }
    }, {
        key: "_handleShowToast",
        value: function _handleShowToast(getCurrentInstanceOfType) {
            // only init a toast container element if does not exist
            if (getCurrentInstanceOfType && getCurrentInstanceOfType.length <= 1) {
                _toasterContainer.toasterContainer.init();
            }
            _toasterContainer.toasterContainer.add(this._hostElement);
            // if has expiry - start destruction timer
            if (this.configuration.expiry) {
                this._destructOnExpiry(this.configuration.expiry)();
            }
            this._handleShow();
        }
    }, {
        key: "_handleShowPopup",
        value: function _handleShowPopup(getCurrentInstanceOfType) {
            var _this5 = this;

            if (this.configuration.popupTargetElement) {
                document.body.appendChild(this._hostElement);
                this._positionPopup();
            } else {
                throw new Error(_constants.CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_POPUP_TARGET);
            }
            // and delete the previous one
            if (getCurrentInstanceOfType && getCurrentInstanceOfType.length > 0) {
                // dispose old one
                getCurrentInstanceOfType.forEach(function (instance) {
                    if (instance.configuration.guid !== _this5.configuration.guid) {
                        instance.destroy();
                    }
                });
            }
            this._handleShow();
        }
    }, {
        key: "_handleShowSlideOut",
        value: function _handleShowSlideOut(getCurrentInstanceOfType) {
            if (this.configuration.slideOutTargetElement) {
                this.configuration.slideOutTargetElement.insertBefore(this._hostElement, this.configuration.slideOutTargetElement.firstChild);
            } else {
                throw new Error(_constants.CONSTANTS.MESSAGES.ERROR_IN_CONFIGURATION_NO_SLIDEOUT_TARGET);
            }
            this._handleShow();
        }
    }, {
        key: "_handleShow",
        value: function _handleShow() {
            var _this6 = this;

            return new Promise(function (resolve, reject) {
                requestAnimationFrame(function () {
                    // the time out waits for the css kicks in.
                    _this6._hostElement.dataset["isInitialising"] = "false";
                });
                requestAnimationFrame(function () {
                    if (_this6.configuration.type === _interfaces.IFloater.Type.POPUP) {
                        _this6._destructOnEscape();
                        _this6._destructOnDocumentClick();
                    }
                    resolve();
                });
            });
        }
    }, {
        key: "_positionPopup",
        value: function _positionPopup() {
            var _this7 = this;

            if (this.configuration.popupIsScrollableParentSelector) {
                // if a scrollable parent's selector is provided - get the parent scrollable element
                this._dynamicRefs.POPUP_PROPS.POSITION_INTERVAL = requestInterval(_constants.CONSTANTS.TIME_SPAN.MS_50, function () {
                    _this7._computePosition();
                });
                this._computePosition();
            } else {
                // there is no parent that can scroll, so position next to target element & do not watch to update on viewport changes.
                var targetElRect = this.configuration.popupTargetElement.getBoundingClientRect();
                this._hostElement.setAttribute("style", (0, _util.getStyleToShowFloater)(targetElRect.right, targetElRect.top));
            }
        }
    }, {
        key: "_computePosition",
        value: function _computePosition() {
            this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF = this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF ? this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF : this._getFloaterParentWithSelector(this.configuration.popupTargetElement, this.configuration.popupIsScrollableParentSelector);
            if (this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF) {
                var parentOverflow = (0, _util.isElementScrollable)(this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF);
                if (parentOverflow.x || parentOverflow.y) {
                    // there is an overflow/ scroll in one of the directions
                    var inView = (0, _util.isInView)(this.configuration.popupTargetElement, this._dynamicRefs.POPUP_PROPS.SCROLLABLE_PARENT_REF);
                    if (inView.isInView) {
                        if (JSON.stringify(this._dynamicRefs.POPUP_PROPS.PREVIOUS_COMPUTED_RECT_FOR_TARGET) !== JSON.stringify(inView.elementRect)) {
                            this._hostElement.setAttribute("style", (0, _util.getStyleToShowFloater)(inView.elementRect.right, inView.elementRect.top));
                            this._dynamicRefs.POPUP_PROPS.PREVIOUS_COMPUTED_RECT_FOR_TARGET = inView.elementRect;
                        }
                    } else {
                        this._hostElement.setAttribute("style", (0, _util.getStyleToHideFloater)());
                        this._dynamicRefs.POPUP_PROPS.PREVIOUS_COMPUTED_RECT_FOR_TARGET = inView.elementRect;
                    }
                }
            } else {
                throw new Error(_constants.CONSTANTS.MESSAGES.ERROR_IN_FINDING_POPUP_SCROLLABLE_PARENT);
            }
        }
    }]);

    return Floater;
}();

exports.default = Floater;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./floater.pcss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./floater.pcss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "/*\nbased on https://github.com/cssrecipes/custom-media-queries/blob/master/index.css\n */\n.dom-floater-base {\r\n  z-index: 1000;\r\n  box-sizing: border-box;\r\n}\n.dom-floater-base.MODAL {\r\n    position: fixed;\r\n    left: 50%;\r\n    top: 50%; \r\n    -webkit-transform: translateX(-50%) translateY(-50%); \r\n            transform: translateX(-50%) translateY(-50%);\r\n  }\n.dom-floater-base.MODAL.MASK {      \r\n    }\n.dom-floater-base.TOAST {\r\n    position: relative;\r\n\r\n  }\n.dom-floater-base.POPUP {\r\n    position: fixed;\r\n  }", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
var IFloater = exports.IFloater = undefined;
(function (IFloater) {
    var Type = void 0;
    (function (Type) {
        Type["MODAL"] = "MODAL";
        Type["POPUP"] = "POPUP";
        Type["TOAST"] = "TOAST";
        Type["SLIDEOUT"] = "SLIDEOUT";
    })(Type = IFloater.Type || (IFloater.Type = {}));
    var ToastPosition = void 0;
    (function (ToastPosition) {
        ToastPosition["TOP"] = "TOP";
        ToastPosition["RIGHT"] = "RIGHT";
        ToastPosition["BOTTOM"] = "BOTTOM";
        ToastPosition["LEFT"] = "LEFT";
        ToastPosition["TOP_RIGHT"] = "TOP_RIGHT";
        ToastPosition["TOP_LEFT"] = "TOP_LEFT";
        ToastPosition["BOTTOM_LEFT"] = "BOTTOM_LEFT";
        ToastPosition["BOTTOM_RIGHT"] = "BOTTOM_RIGHT";
    })(ToastPosition = IFloater.ToastPosition || (IFloater.ToastPosition = {}));
    var PopupTriggerOn = void 0;
    (function (PopupTriggerOn) {
        PopupTriggerOn["CLICK"] = "CLICK";
        PopupTriggerOn["HOVER"] = "HOVER"; // TODO
    })(PopupTriggerOn = IFloater.PopupTriggerOn || (IFloater.PopupTriggerOn = {}));
    var PopupPosition = void 0;
    (function (PopupPosition) {
        PopupPosition["TOP"] = "TOP";
        PopupPosition["RIGHT"] = "RIGHT";
        PopupPosition["BOTTOM"] = "BOTTOM";
        PopupPosition["LEFT"] = "LEFT";
    })(PopupPosition = IFloater.PopupPosition || (IFloater.PopupPosition = {}));
    var SlideOutPosition = void 0;
    (function (SlideOutPosition) {
        SlideOutPosition["TOP"] = "TOP";
        SlideOutPosition["RIGHT"] = "RIGHT";
        SlideOutPosition["BOTTOM"] = "BOTTOM";
        SlideOutPosition["LEFT"] = "LEFT";
    })(SlideOutPosition = IFloater.SlideOutPosition || (IFloater.SlideOutPosition = {}));
    var ContentElementType = void 0;
    (function (ContentElementType) {
        ContentElementType["NODE"] = "NODE";
        ContentElementType["TEMPLATE"] = "TEMPLATE";
    })(ContentElementType = IFloater.ContentElementType || (IFloater.ContentElementType = {}));
})(IFloater || (exports.IFloater = IFloater = {}));

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.masker = exports.Masker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(13);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Masker = exports.Masker = function () {
    function Masker() {
        _classCallCheck(this, Masker);
    }

    _createClass(Masker, [{
        key: "init",
        value: function init() {
            var _this = this;

            this._hostElement = document.createElement("DIV");
            this._hostElement.className = "dom-masker-base";
            this._hostElement.dataset["isInitialising"] = "true";
            document.body.appendChild(this._hostElement);
            requestAnimationFrame(function () {
                // force re-paint
                _this._hostElement.dataset["isInitialising"] = "false";
            });
        }
    }, {
        key: "destroy",
        value: function destroy() {
            var _this2 = this;

            this._hostElement.dataset["isDestructing"] = "true";
            requestAnimationFrame(function () {
                _this2._hostElement.parentElement.removeChild(_this2._hostElement);
            });
        }
    }]);

    return Masker;
}();

var masker = exports.masker = new Masker();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./masker.pcss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./masker.pcss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".dom-masker-base {\r\n  top: 0;\r\n  right: 0;\r\n  bottom: 0;\r\n  left: 0;\r\n  position: fixed;\r\n  z-index: 999;\r\n  background: rgb(0, 0, 0);\r\n  opacity: 0.3;\r\n}", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toasterContainer = exports.ToasterContainer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(16);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ToasterContainer = exports.ToasterContainer = function () {
    function ToasterContainer() {
        _classCallCheck(this, ToasterContainer);
    }

    _createClass(ToasterContainer, [{
        key: "init",
        value: function init() {
            var _this = this;

            this._hostElement = document.createElement("DIV");
            this._hostElement.className = "dom-toaster-container-base";
            this._hostElement.dataset["isInitialising"] = "true";
            document.body.appendChild(this._hostElement);
            requestAnimationFrame(function () {
                _this._hostElement.dataset["isInitialising"] = "false";
            });
        }
    }, {
        key: "add",
        value: function add(toastElement) {
            this._hostElement.appendChild(toastElement);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            var _this2 = this;

            this._hostElement.dataset["isDestructing"] = "true";
            requestAnimationFrame(function () {
                _this2._hostElement.parentElement.removeChild(_this2._hostElement);
            });
        }
    }]);

    return ToasterContainer;
}();

var toasterContainer = exports.toasterContainer = new ToasterContainer();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(17);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./toaster-container.pcss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js??ref--1-1!../../node_modules/postcss-loader/lib/index.js!./toaster-container.pcss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, ".dom-toaster-container-base {\r\n  position: fixed;\r\n  top: 0rem;\r\n  left: 50%;\r\n  -webkit-transform: translateX(-50%) translateY(0);\r\n          transform: translateX(-50%) translateY(0);\r\n  z-index: 1001;\r\n}", ""]);

// exports


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isInView = exports.isElementScrollable = exports.getStyleToHideFloater = exports.getStyleToShowFloater = undefined;

var _constants = __webpack_require__(2);

var getStyleToShowFloater = exports.getStyleToShowFloater = function getStyleToShowFloater(x, y) {
    return "left: " + x + "px; top: " + y + "px; visibility: visible; pointer-events: all; opacity: 1.0;";
};
var getStyleToHideFloater = exports.getStyleToHideFloater = function getStyleToHideFloater() {
    return "left: -9999px; top: -9999px; opacity: 0; visibility: hidden; pointer-events: none;";
};
var isElementScrollable = exports.isElementScrollable = function isElementScrollable(element) {
    element = element[0] ? element[0] : element;
    var stylesToCheck = ["visible", "hidden"];
    return {
        y: element.scrollHeight > element.offsetHeight && (stylesToCheck.indexOf(getComputedStyle(element, null).getPropertyValue("overflow")) < 0 || stylesToCheck.indexOf(getComputedStyle(element, null).getPropertyValue("overflow-y")) < 0),
        x: element.scrollWidth > element.offsetWidth && (stylesToCheck.indexOf(getComputedStyle(element, null).getPropertyValue("overflow")) < 0 || stylesToCheck.indexOf(getComputedStyle(element, null).getPropertyValue("overflow-x")) < 0)
    };
};
var isInView = exports.isInView = function isInView(element, containerElement) {
    containerElement = containerElement ? containerElement : document.body;
    if (!containerElement) {
        throw new Error(_constants.CONSTANTS.MESSAGES.ERROR_NO_DOCUMENT_BODY);
    }
    var containerElementRect = containerElement.getBoundingClientRect();
    var elementRect = element.getBoundingClientRect();
    var isVerticallyInBounds = elementRect.top >= containerElementRect.top && elementRect.bottom <= containerElementRect.bottom;
    var isHorizontallyInBounds = elementRect.left >= containerElementRect.left && elementRect.right <= containerElementRect.right;
    if (isVerticallyInBounds && isHorizontallyInBounds) {
        return {
            isInView: true,
            elementRect: elementRect,
            containerRect: containerElementRect
        };
    } else {
        return {
            isInView: false,
            elementRect: elementRect,
            containerRect: containerElementRect
        };
    }
};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

var random = __webpack_require__(20)

var url = '_~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

/**
 * Generate secure URL-friendly unique ID.
 *
 * By default, ID will have 21 symbols to have a collision probability similar
 * to UUID v4.
 *
 * @param {number} [size=21] The number of symbols in ID.
 *
 * @return {string} Random string.
 *
 * @example
 * var nanoid = require('nanoid')
 * model.id = nanoid() //=> "Uakgb_J5m9g~0JDMbcJqL"
 *
 * @name nanoid
 */
module.exports = function (size) {
  size = size || 21
  var id = ''
  var bytes = random(size)
  while (0 < size--) {
    id += url[bytes[size] & 63]
  }
  return id
}


/***/ }),
/* 20 */
/***/ (function(module, exports) {

var crypto = window.crypto || window.msCrypto

module.exports = function (bytes) {
  return crypto.getRandomValues(new Uint8Array(bytes))
}


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = interval;
function interval(delay, fn) {
  var start = Date.now();
  var data = {};
  data.id = requestAnimationFrame(loop);

  return data;

  function loop() {
    data.id = requestAnimationFrame(loop);

    if (Date.now() - start >= delay) {
      fn();
      start = Date.now();
    }
  }
}


exports.clear = clearInterval;
function clearInterval(data) {
  cancelAnimationFrame(data.id);
}


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.floaterManager = exports.FloaterManager = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _floaterInstances = __webpack_require__(3);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// wrapper class to encapsulate floater instances
var FloaterManager = exports.FloaterManager = function () {
    function FloaterManager() {
        _classCallCheck(this, FloaterManager);
    }

    _createClass(FloaterManager, [{
        key: "getInstanceById",
        value: function getInstanceById(guid) {
            return _floaterInstances.floaterInstances.getInstanceById(guid);
        }
    }, {
        key: "destroy",
        value: function destroy(instance) {
            _floaterInstances.floaterInstances.destroy(instance);
        }
    }]);

    return FloaterManager;
}();

var floaterManager = exports.floaterManager = new FloaterManager();

/***/ })
/******/ ]);
});
//# sourceMappingURL=dom-floater.js.map