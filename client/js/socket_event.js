"use strict";

var s = window.io(window.location.origin);

(function ($, w) {
  w.socketEvents = {
    name_map : {},
    addListener : function (name, cb) {
      if (this.name_map.hasOwnProperty(name))
        this.name_map[name].push(cb);
      else
        this.name_map[name] = [cb];
    },
    trigger : function (name, data) {
      if (this.name_map.hasOwnProperty(name))
        this.name_map[name].forEach(function (item) {
          item.call(window, data);
        });
    }
  };

  s.on('query', function (d) {
    console.log(d);
    w.socketEvents.trigger(d.action, d.data);
  });

  s.on('error', function (d) {
    console.log(d);
  });

  s.on('change', function (d) {
    console.log(d);
    w.socketEvents.trigger('change', d);
  });
})(window.jQuery, window);
