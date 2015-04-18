"use strict";

(function ($, w) {
  w.List = function (listenTarget, buildFunc, $list, idPrefix) {
    this.buildFunc = buildFunc;
    this.$list = $list;

    var _this = this;

    var buildFuncWrapper = function (item) {
      var ret = _this.buildFunc(item);
      ret.data('id', item.id);
      ret.attr('id', idPrefix + item.id.toString());
      return ret;
    };

    var insertFunc = function ($item) {
      var $current = _this.$list.children().last();
      if (!$current.length) {
        _this.$list.append($item);
      }
      else {
        while ($current.data('id')
          && $current.data('id') > $item.data('id'))
          $current = $current.prev('li');

        if ($current.length)
          $current.after($item);
        else
          _this.$list.prepend($item);
      }

      setTimeout(function () {
        $item.addClass('show');
      });
    };

    var removeFunc = function (item) {
      console.log('#' + idPrefix + item.id);
      console.log(_this.$list.find('#' + idPrefix + item.id));
      var $item = _this.$list.find('#' + idPrefix + item.id);
      $item.attr('id', '');
      $item.get(0).className = 'hide';
      $item.on('transitionend', function () {
        $item.remove();
      });
      w.setTimeout(function () {
        $item.remove();
      }, 1000);
    };

    var updateFunc = function (changes) {
      if (changes === undefined) {
        _this.$list.find('.show').remove();
        Object.getOwnPropertyNames(listenTarget).forEach(function (name) {
          if (!isNaN(parseFloat(name)) && isFinite(name))
            insertFunc(buildFuncWrapper(listenTarget[name]));
        });
      }
      else {
        changes.forEach(function (change) {
          if (!isNaN(parseFloat(change.name)) && isFinite(change.name))
            switch (change.type) {
              case 'add':
                insertFunc(buildFuncWrapper(change.object[change.name]));
                break;
              case 'update':
                removeFunc(change.oldValue);
                insertFunc(buildFuncWrapper(change.object[change.name]));
                break;
              case 'delete':
                removeFunc(change.oldValue);
                break;
            }
        });

        setTimeout(function () {
          _this.$list.trigger('listupdated');
        }, 45);
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
