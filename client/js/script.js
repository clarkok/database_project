"use struct";

(function () {
  var clone = function (obj) {
    var ret = {};
    Object.getOwnPropertyNames(obj).forEach(function (name) {
      if (
        name != '_observe_array_' &&
        name != '_observe_interval_'
        )
        ret[name] = obj[name];
    });
    return ret;
  };

  var generate_change = function (obj, cb) {
    var _last_obj;

    return function () {
      if (_last_obj) {
        var changes = [];
        Object.getOwnPropertyNames(obj).forEach(function (name) {
          if (name == '_observe_array_' || name == '_observe_interval_')
            return;
          if (!_last_obj.hasOwnProperty(name)) {
            changes.push({
              type: 'add',
              name: name,
              oldValue: undefined,
              object: obj
            });
          }
          else if (_last_obj[name] !== obj[name]) {
            changes.push({
              type: 'update',
              name: name,
              oldValue: _last_obj[name],
              object: obj
            });
          }
        });
        Object.getOwnPropertyNames(_last_obj).forEach(function (name) {
          if (!obj.hasOwnProperty(name)) {
            changes.push({
              type: 'delete',
              name: name,
              oldValue: _last_obj[name],
              object: obj
            });
          }
        });

        cb.call(obj, changes);
      }
      _last_obj = clone(obj);
    };
  };

  if (!Object.observe) {
    Object.observe = function (obj, cb) {
      if (!obj._observe_interval_) {
        obj._observe_interval_ = setInterval(generate_change(obj, cb), 30);
        obj._observe_array_ = [];
      }
      obj._observe_array_.push(cb);
    }

    Object.unobserve = function (obj, cb) {
      obj._observe_array_.splice(
        obj._observe_array_.indexOf(cb), 1
      );
      if (!obj._observe_array_.length) {
        clearInterval(obj._observe_interval_);
        obj._observer_interval_ = undefined;
      }
    }
  }
})()

Object.prototype.update = function (b) {
  var _this = this;
  Object.getOwnPropertyNames(_this).forEach(function (item) {
    if (b.hasOwnProperty(item))
      _this[item] = b[item];
    else
      delete _this[item];
  });
  Object.getOwnPropertyNames(b).forEach(function (item) {
    if (!_this.hasOwnProperty(item))
      _this[item] = b[item];
  });
};

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

  route['query'] = new w.List(books, buildBookList, $list, 'b');

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

    original_hash = hash_name;

    if (route.hasOwnProperty(hash_name)) {
      $wrapper.get(0).className = hash_name;
      $('#wrapper section.show').removeClass('show');
      $('#' + hash_name + '-content').addClass('show');
      route[hash_name].init();
    }

    $('aside .current').removeClass('current');
    $('aside a.' + hash_name).addClass('current');
  }).trigger('hashchange');
})(window.jQuery, window);

var MOCK_BOOK = [
  {
    bid: 0,
    category: 'category',
    title: 'title',
    press: 'press',
    year: 1995,
    author: 'Clarkok Zhang',
    price: 100,
    total: 100,
    stock: 99
  },
  {
    bid: 1,
    category: 'category',
    title: 'title',
    press: 'press',
    year: 1995,
    author: 'Clarkok Zhang',
    price: 100,
    total: 100,
    stock: 99
  },
  {
    bid: 2,
    category: 'category',
    title: 'title',
    press: 'press',
    year: 1995,
    author: 'Clarkok Zhang',
    price: 100,
    total: 100,
    stock: 99
  },
  {
    bid: 20,
    category: 'category',
    title: 'title',
    press: 'press',
    year: 1995,
    author: 'Clarkok Zhang',
    price: 100,
    total: 100,
    stock: 99
  }
];

setTimeout(function () {
  alert("test");

  var _books = {};

  MOCK_BOOK.forEach(function (item) {
    item.id = item.bid;
    _books[item.id] = item;
  });

  books.update(books);
}, 3000);
