"use struct";

var route = {};

var $wrapper = $('#wrapper');

var books = {};

// query
(function ($, w) {
  var $list = $('#query-main');

  var buildBookList = function (book) {
    return $('<li />').attr('id', 'b' + book.bid).append(
      $('<div />').addClass('column bid').text(book.bid),
      $('<div />').addClass('column category').text(book.category),
      $('<div />').addClass('column title').text(book.title),
      $('<div />').addClass('column press').text(book.press),
      $('<div />').addClass('column year').text(book.year),
      $('<div />').addClass('column author').text(book.author),
      $('<div />').addClass('column price').text(book.price),
      $('<div />').addClass('column total').text(book.total),
      $('<div />').addClass('column stock').text(book.stock)
    ).data('original', book);
  };

  var buildBook = buildBookList;

  var insertBook = function ($book) {
    var $current = $list.last();

    // find the property index
    while ($current.data('original') 
      && $current.data('original').bid > $book.data('original').bid) {
      $current = $current.prev('li');
    }

    $current.append($book);

    // to start transition
    setTimeout(function () {
      $book.addClass('show');
    }, 15);
  };

  var removeBook = function (book) {
    var $book = $list.find('#b' + book.bid).attr('id', '');
    $book.get(0).className = 'hide';
    $book.on('transitionend', function () {
      $book.remove();
    });
  };

  var updateBooks = function (changes) {
    if (changes === undefined) {
      $list.find('.show').remove();
      Object.getOwnPropertyNames(books).forEach(function (item) {
        insertBook(buildBook(item));
      });
    }
    else {
      changes.forEach(function (change) {
        switch (change.type) {
          case "add":
            insertBook(buildBook(change.object[change.name]));
            break;
          case "update":
            removeBook(change.oldValue);
            insertBook(buildBook(change.object[change.name]));
            break;
          case "delete":
            removeBook(change.oldValue);
            break;
          default:
        };
      });
    }
  };

  route['query'] = {
    init : function () {
      Object.observe(books, updateBooks);
      updateBooks();
    },
    deinit : function () {
      console.log('dinit');
      Object.unobserve(books, updateBooks);
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
      console.log('hash deinit');
      route[original_hash].deinit();
    }

    original_hash = hash_name;

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
