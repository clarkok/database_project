"use struct";

var route = {};

var $wrapper = $('#wrapper');

// query
(function ($, w) {
  var books = {};
  var $list = $('#query-content ul');

  var buildBook = function (book) {
    return $('<li />').append(
      $('<div />').addClass('column bid').text(book.bid),
      $('<div />').addClass('column category').text(book.category),
      $('<div />').addClass('column title').text(book.title),
      $('<div />').addClass('column press').text(book.press),
      $('<div />').addClass('column year').text(book.year),
      $('<div />').addClass('column author').text(book.author),
      $('<div />').addClass('column price').text(book.price),
      $('<div />').addClass('column total').text(book.total),
      $('<div />').addClass('column stock').text(book.stock)
    );
  };

  var insertBook = function ($book) {
    if ()
  };

  Object.observe(books, function (changes) {
    changes.forEach(function (change) {
      switch (change.type) {
        case "add":
        case "update":
        case "delete":
        default:
      };
    });
  });

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
