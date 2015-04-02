(function ($, w) {
  w.List = function (listenTarget, buildFunc, $list, idPrefix) {
    var insertFunc = function ($item) {
      $current = $list.children('li:last-child');

      while ($current.data('id')
        && $current.data('id') > $item.data('id'))
        $current = $current.prev('li');

      console.log($current);

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
        Object.getOwnPropertyNames(listenTarget).forEach(function (item) {
          insertFunc(buildFunc(item));
        });
      }
      else {
        changes.forEach(function (change) {
          switch (change.type) {
            case 'add':
              insertFunc(buildFunc(change.object[change.name]));
              break;
            case 'update':
              removeFunc(change.oldValue);
              insertFunc(buildFunc(change.object[change.name]));
              break;
            case 'delete':
              removeFunc(change.oldValue);
              break;
          }
        });
      }
    };

    this.init = function () {
      console.log('list init');
      Object.observe(listenTarget, updateFunc);
      updateFunc();
    };

    this.deinit = function () {
      console.log('list deinit');
      Object.unobserve(listenTarget, updateFunc);
    }
  };
})(window.jQuery, window);
