"use strict";

(function ($, w) {
  w.List = function (listenTarget, buildFunc, $list, idPrefix) {
    this.buildFunc = buildFunc;

    var _this = this;

    var insertFunc = function ($item) {
      $current = $list.children().last();

      while ($current.data('id')
        && $current.data('id') > $item.data('id'))
        $current = $current.prev('li');

      $current.after($item);

      setTimeout(function () {
        $item.addClass('show');
      });
    };

    var removeFunc = function (item) {
      var $item = $list.find('#' + idPrefix + item.id).attr('id', '');
      $item.get(0).className = 'hide';
      $item.on('transitionend', function () {
        $item.remove();
      });
    };

    var updateFunc = function (changes) {
      if (changes === undefined) {
        $list.find('.show').remove();
        Object.getOwnPropertyNames(listenTarget).forEach(function (name) {
          if (!isNaN(parseFloat(name)) && isFinite(name))
            insertFunc(_this.buildFunc(listenTarget[name]));
        });
      }
      else {
        changes.forEach(function (change) {
          if (!isNaN(parseFloat(change.name)) && isFinite(change.name))
            switch (change.type) {
              case 'add':
                insertFunc(_this.buildFunc(change.object[change.name]));
                break;
              case 'update':
                removeFunc(change.oldValue);
                insertFunc(_this.buildFunc(change.object[change.name]));
                break;
              case 'delete':
                removeFunc(change.oldValue);
                break;
            }
        });
      }
    };

    this.init = function () {
      Object.observe(listenTarget, updateFunc);
      updateFunc();
    };

    this.deinit = function () {
      Object.unobserve(listenTarget, updateFunc);
    }
  };
})(window.jQuery, window);
