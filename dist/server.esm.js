import createEmotionServer from 'create-emotion-server';

var renderStyle = function (cache, html) {
  var emotionServer = createEmotionServer(cache);
  var ref = emotionServer.extractCritical(html);
  var css = ref.css;
  var ids = ref.ids;
  return ("<style data-emotion-" + (cache.key) + "=\"" + (ids.join(' ')) + "\">" + css + "</style>");
};

export { renderStyle };
