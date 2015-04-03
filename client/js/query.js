"use strict";

(function ($, w) {
  w.parseQuery = function (query_body) {
    var ret = {};
    if (!query_body)
      return ret;

    query_body.split('&').forEach(function (item) {
      var key_val = item.split('=');
      if (key_val.length == 1)
        ret[key_val[0]] = 'true';
      else
        ret[key_val[0]] = key_val[1];
    });

    return ret;
  };
})(window.jQuery, window);
