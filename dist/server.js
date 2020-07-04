'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var createEmotionServer = _interopDefault(require('create-emotion-server'));

var renderStyle = function (cache, html) {
  var emotionServer = createEmotionServer(cache);
  var ref = emotionServer.extractCritical(html);
  var css = ref.css;
  var ids = ref.ids;
  return ("<style data-emotion-" + (cache.key) + "=\"" + (ids.join(' ')) + "\">" + css + "</style>");
};

exports.renderStyle = renderStyle;
