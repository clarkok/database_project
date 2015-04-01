"use struct";

var route = {};

var $wrapper = $('#wrapper');

// query
(function ($, w) {
  route['query'] = {
    init : function () {
    },
    deinit : function () {
    }
  };
})(window.jQuery, window);

// login
(function ($, w) {
  var $login = $('#login-content');

  var checkLength = function () {
    if ($(this).val().length > 0)
      $(this).addClass('not-empty');
    else
      $(this).removeClass('not-empty');
  };

  route['login'] = {
    init : function () {
      $login.find('input').on('blur', checkLength);
    },
    deinit : function () {
      $login.find('input').off('blur', checkLength);
    }
  };
})(window.jQuery, window);

(function ($, w) {
  var original_hash = "";

  $(window).on('hashchange', function () {
    var hash = window.location.hash;
    var matched = /#([^\?]*)(\?(.*))?/.exec(hash);
    var hash_name = matched[1];
    var query_body = matched[3];

    if (route.hasOwnProperty(original_hash)) {
      route[original_hash].deinit();
    }

    if (route.hasOwnProperty(hash_name)) {
      $wrapper.get(0).className = hash_name;
      $('#wrapper section.show').removeClass('show');
      $('#' + hash_name + '-content').addClass('show');
      route[hash_name].init();
    }

    $('aside .current').removeClass('current');
    $('a[href=#' + hash_name + ']').addClass('current');
  }).trigger('hashchange');
})(window.jQuery, window);
