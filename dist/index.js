'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createCache = _interopDefault(require('@emotion/cache'));
var clsx = _interopDefault(require('clsx'));
var utils = require('@emotion/utils');
var serialize = require('@emotion/serialize');

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var ILLEGAL_ESCAPE_SEQUENCE_ERROR = process.env.NODE_ENV === 'production' ? '' : "You have illegal escape sequence in your template literal, most likely inside content's property value.\nBecause you write your CSS inside a JavaScript string you actually have to do double escaping, so for example \"content: '\\00d7';\" should become \"content: '\\\\00d7';\".\nYou can read more about this here:\nhttps://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#ES2018_revision_of_illegal_escape_sequences";

var createStyled = function (tag, options) {
  if ( options === void 0 ) options = {};

  if (process.env.NODE_ENV !== 'production') {
    if (tag === undefined) {
      throw new Error('You are trying to create a styled element with an undefined component.\nYou may have forgotten to import it.');
    }
  }

  var identifierName = options.label;
  var targetClassName = options.target;
  var isReal = tag.__emotion_real === tag;
  var baseTag = isReal && tag.__emotion_base || tag;
  return function () {
    var args = [], len$1 = arguments.length;
    while ( len$1-- ) args[ len$1 ] = arguments[ len$1 ];

    var styles = isReal && tag.__emotion_styles !== undefined ? tag.__emotion_styles.slice(0) : [];

    if (identifierName !== undefined) {
      styles.push(("label:" + identifierName + ";"));
    }

    if (args[0] === null || args[0].raw === undefined) {
      styles.push.apply(styles, args);
    } else {
      if (process.env.NODE_ENV !== 'production' && args[0][0] === undefined) {
        console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
      }

      styles.push(args[0][0]);
      var len = args.length;
      var i = 1;

      for (; i < len; i++) {
        if (process.env.NODE_ENV !== 'production' && args[0][i] === undefined) {
          console.error(ILLEGAL_ESCAPE_SEQUENCE_ERROR);
        }

        styles.push(args[i], args[0][i]);
      }
    }

    var Styled = {
      functional: true,

      // inject: {
      //   theme: {
      //     default: undefined
      //   }
      // },
      render: function render(h, ref) {
        var data = ref.data;
        var children = ref.children;
        var parent = ref.parent;

        var cache = parent.$emotionCache;

        var _ref = data.attrs || {};
        var as = _ref.as;
        var value = _ref.value;
        var restAttrs = _objectWithoutPropertiesLoose(_ref, ["as", "value"]);

        var className = data.staticClass ? ((data.staticClass) + " ") : '';
        var finalTag = as || baseTag;
        var classInterpolations = [];
        var mergedProps = Object.assign({}, data.attrs, {}, parent.$evergarden);
        var domProps = {
          value: value
        };

        if (data.class) {
          className += utils.getRegisteredStyles(cache.registered, classInterpolations, clsx(data.class));
        }

        var serialized = serialize.serializeStyles(styles.concat(classInterpolations), cache.registered, mergedProps);
        utils.insertStyles(cache, serialized, typeof finalTag === 'string');
        className += (cache.key) + "-" + (serialized.name);

        if (targetClassName !== undefined) {
          className += " " + targetClassName;
        }

        return h(finalTag, Object.assign({}, data, {
          attrs: options.getAttrs ? options.getAttrs(restAttrs) : restAttrs,
          staticClass: undefined,
          class: className,
          domProps: domProps
        }), children);
      }

    };
    Styled.name = identifierName === undefined ? ("Styled" + (typeof baseTag === 'string' ? baseTag : baseTag.name || 'Component')) : identifierName;
    Styled.__emotion_real = Styled;
    Styled.__emotion_base = baseTag;
    Styled.__emotion_styles = styles;
    Object.defineProperty(Styled, 'toString', {
      value: function value() {
        if (targetClassName === undefined && process.env.NODE_ENV !== 'production') {
          return 'NO_COMPONENT_SELECTOR';
        }

        return ("." + targetClassName);
      }

    });

    Styled.withComponent = function (nextTag, nextOptions) {
      return createStyled(nextTag, nextOptions === undefined ? options : Object.assign({}, options || {}, {}, nextOptions)).apply(void 0, styles);
    };

    return Styled;
  };
};

var styled = createStyled;

function insertWithoutScoping(cache, serialized) {
  if (cache.inserted[serialized.name] === undefined) {
    return cache.insert('', serialized, cache.sheet, true);
  }
}

var createGlobalStyle = function () {
  var styles = [], len = arguments.length;
  while ( len-- ) styles[ len ] = arguments[ len ];

  return ({
  functional: true,

  render: function render(_, ref) {
    var parent = ref.parent;
    var data = ref.data;

    var cache = parent.$emotionCache;
    var mergedProps = Object.assign({}, data.attrs, {}, parent.$evergarden);
    var serialized = serialize.serializeStyles(styles, cache.registered, mergedProps);
    insertWithoutScoping(cache, serialized);
  }

});
};

function VueEmotion(Vue) {
  Vue.mixin({
    beforeCreate: function beforeCreate() {
      this.$emotionCache = this.$parent && this.$parent.$emotionCache || createCache();
      this.$emotionCache.compat = true;
    }

  });
}

exports.VueEmotion = VueEmotion;
exports.createGlobalStyle = createGlobalStyle;
exports.styled = styled;
