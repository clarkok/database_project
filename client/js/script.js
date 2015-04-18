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
})();

var route = {};

var $wrapper = $('#wrapper');

var books = {};
hookBooks(books);

var cards = {};

// query
(function ($, w) {
  var $list = $('#query-main-list');
  var $table = $('#query-main-table');

  var buildBookList = function (book) {
    book.id = book.bid;
    return $('<li />').append(
      $('<div />').addClass('column title').text(book.title),
      $('<div />').addClass('column category').text(book.category),
      $('<div />').addClass('column press').text(book.press),
      $('<div />').addClass('column year').text(book.year),
      $('<div />').addClass('column author').text(book.author),
      $('<div />').addClass('column op').append(
        $('<a />').attr('href', '#borrow?bid=' + book.bid).attr('alt', 'borrow')
          .addClass('borrow').append(
            $('<i />').addClass('fa fa-book')
          ),
        $('<a />').attr('href', '#return?bid=' + book.bid).attr('alt', 'return')
          .addClass('return').append(
            $('<i />').addClass('fa fa-undo')
          )
      )
    ).data('original', book);
  };

  var buildBookTable = function (book) {
    book.id = book.bid;
    return $('<li />').append(
      $('<div />').addClass('info').append(
        $('<div />').addClass('positioner').append(
          $('<p />').addClass('title').text(book.title),
          $('<p />').append(
            $('<span />').addClass('author').text(book.author),
            $('<span />').addClass('year').text(book.year)
          ),
          $('<p />').addClass('press').text(book.press),
          $('<p />').addClass('op').append(
            $('<a />').attr('href', '#borrow?bid=' + book.bid).attr('alt', 'borrow')
              .addClass('borrow').append(
                $('<i />').addClass('fa fa-book')
              ),
            $('<a />').attr('href', '#return?bid=' + book.bid).attr('alt', 'return')
              .addClass('return').append(
                $('<i />').addClass('fa fa-undo')
              )
          )
        )
      )
    ).data('original', book).css('background-image', 'url(' + book.cover + ')');
  };

  var filterArray = function () {
    var ret = [];

    var Filter = function (name, op, value) {
      this.column = name;
      this.operator = op;
      this.value = value;
    }

    $('#query-filter').children('li.show').each(function () {
      var $this = $(this);
      ret.push(new Filter(
        $this.find('.filter-name select').val(),
        $this.find('.filter-relation select').val(),
        $this.find('.filter-value input').val()
      ));
    });

    return ret;
  }

  $('#query-filter').filterInit([
    'bid',
    'category',
    'title',
    'press',
    'year',
    'author',
    'price',
    'total',
    'stock'
  ]).on('filterchange', function () {
    var conditions = filterArray();
    console.log(conditions);

    var query_obj = {
      action : 'query',
      data : {
        conditions : conditions
      }
    };

    w.setTimeout(function () {
      s.emit('query', query_obj);
    }, 50);
  }).trigger('filterchange');

  var list = new w.List(books, buildBookList, $list, 'b');
  var table = new w.List(books, buildBookTable, $table, 'bt');

  var reLayout = function () {
    console.log('re_layout');
    $table.layout(200, 300, 32, '.show');
  };

  $('#query-disp-mode').on('change', function () {
    if ($(this).data('value') == 'list') {
      $list.show();
      $table.hide();
      $(window).off('resize', reLayout);
      $table.off('listupdated', reLayout);
    }
    else {
      $list.hide();
      $table.show();
      $(window).on('resize', reLayout).trigger('resize');
      $table.on('listupdated', reLayout);
    }
  }).trigger('change');

  list.init();
  table.init();

  route['query'] = {
    init : function () {
    },
    deinit : function () {
    }
  };
})(window.jQuery, window);

// cards
(function ($, w) {
  var $list = $('#cards-main-list');

  var buildCardList = function (card) {
    card.id = card.cid;
    return $('<li />').append(
      $('<div />').addClass('column cid').text(card.cid),
      $('<div />').addClass('column c-name').text(card.name),
      $('<div />').addClass('column unit').text(card.unit),
      $('<div />').addClass('column c-category').text(card.category)
    ).data('original', card);
  };

  $('#cards-filter').filterInit([
    'cid',
    'name',
    'unit',
    'category'
  ]).on('filterchange', function () {
  });

  var list = new w.List(cards, buildCardList, $list, 'b');

  route['cards'] = {
    init : function () {
      if ($('body').hasClass('unlogin')) {
        w.location.hash = '#query';
        return;
      }
      list.init();
    },
    deinit : function () {
      list.deinit();
    }
  };
})(window.jQuery, window);

// logout
(function ($, w) {
  route['logout'] = {
    init : function () {
      $.get('/logout', function (d) {
        if (d.code === 0) {
          $('body').get(0).className = 'unlogin';
          w.location.hash = '#query';
        }
      })
    },
    deinit : function () {
    }
  }
})(window.jQuery, window);

var checkLength = function () {
  console.log('check length');
  if ($(this).val().length > 0)
    $(this).addClass('not-empty');
  else
    $(this).removeClass('not-empty');
};

$('.input-span input').each(function () {
  $(this).on('blur', checkLength);
  console.log(this);
});

// login
(function ($, w) {
  var $login = $('#login-content');

  route['login'] = {
    init : function () {
      $login.find('form button').on('click', function (e) {
        var username = $('#username').val();
        var password = $('#passwd').val();
        password = $.md5(password);

        console.log(username, password);

        $.post('/login', {
          username: username,
          password: password
        }, function (ret) {
          if (ret.code === 0) {
            $('body').get(0).className = 'login';
            if (w.location.query.redir)
              w.location.hash = decodeURIComponent(w.location.query.redir);
            else
              w.location.hash = 'query';
          }
          else {
            w.alert('Error on login');
          }
        });
      });
    },
    deinit : function () {
      $login.find('input').off('blur', checkLength);
      $login.find('form button').off('click');
    }
  };
})(window.jQuery, window);

var buildBookInfo = function (book) {
  return $('<div />').addClass('book-info').append(
    $('<div />').addClass('cover')
      .css('background-image', 'url(' + book.cover + ')'),
    $('<div />').addClass('info').append(
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('Title'),
        $('<span />').addClass('value').text(book.title)
      ),
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('ID'),
        $('<span />').addClass('value').text(book.bid)
      ),
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('Category'),
        $('<span />').addClass('value').text(book.category)
      ),
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('Press'),
        $('<span />').addClass('value').text(book.press)
      ),
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('Year'),
        $('<span />').addClass('value').text(book.year)
      ),
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('Author'),
        $('<span />').addClass('value').text(book.author)
      ),
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('Price'),
        $('<span />').addClass('value').text(book.price)
      ),
      $('<div />').addClass('line').append(
        $('<span />').addClass('name').text('Stock / Total'),
        $('<span />').addClass('value').text(book.stock + '/' + book.total)
      )
    )
  );
};

// borrow
(function ($, w) {
  w.socketEvents.addListener('borrow', function (d) {
    switch (d) {
      case 0:
        $('#borrow-content span.submit').addClass('succeed');
        w.setTimeout(function () {
          $('#borrow-content span.submit').removeClass('succeed');
          w.location.hash='#query';
        }, 5000);
        break;
      case 1:
        w.alert('Not enough stock. Closest return date is ' + d.data.date);
        break;
      case -1:
        w.alert('Invalid bid');
        break;
      default:
        w.alert('Unknown error');
        break;
    }
  });

  route['borrow'] = {
    init : function () {
      if ($('body').hasClass('unlogin')) {
        w.location.hash = '#login?redir=' + 
          encodeURIComponent(w.location.hash.replace('#', ''));
        return;
      }
      if (!w.location.query['bid']) {
        w.location.hash = '#query';
        return;
      }
      $('#borrow-content').find('.book-info')
        .replaceWith(buildBookInfo(books[parseInt(w.location.query['bid'], 10)]));
      $('#borrow-content').find('button').on('click', function () {
        console.log('click');
        s.emit('query', {
          action: 'borrow',
          data: {
            cid: $('#borrow-cid').val(),
            bid: w.location.query['bid']
          }
        });
      });
    },
    deinit : function () {
    }
  };
})(window.jQuery, window);

// return
(function ($, w) {
  w.socketEvents.addListener('return', function (d) {
    switch (d) {
      case 0:
        $('#return-content span.submit').addClass('succeed');
        w.setTimeout(function () {
          $('#return-content span.submit').removeClass('succeed');
          w.location.hash='#query';
        }, 5000);
        break;
      default:
        w.alert('Unknown error');
        break;
    }
  });

  route['return'] = {
    init : function () {
      if ($('body').hasClass('unlogin')) {
        w.location.hash = '#login?redir=' + 
          encodeURIComponent(w.location.hash.replace('#', ''));
        return;
      }
      if (!w.location.query['bid']) {
        w.location.hash = '#query';
        return;
      }
      $('#return-content').find('.book-info')
        .replaceWith(buildBookInfo(books[parseInt(w.location.query['bid'], 10)]));
      $('#return-content').find('button').on('click', function () {
        console.log('click');
        s.emit('query', {
          action: 'return',
          data: {
            cid: $('#return-cid').val(),
            bid: w.location.query['bid']
          }
        });
      });
    },
    deinit : function () {
    }
  };
})(window.jQuery, window);

(function ($, w) {
  var original_hash = "";

  $(window).on('hashchange', function () {
    var hash = window.location.hash;
    var matched = /#([^\?]*)(\?(.*))?/.exec(hash);

    if (!matched) {
      w.location.hash = "#query";
      return;
    }

    var hash_name = matched[1];
    var query_body = matched[3];

    w.location.query = w.parseQuery(query_body);

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
