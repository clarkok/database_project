var updateObject = function (obj, b) {
  var _this = obj;
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
  return obj;
};

var updateFromList = function (obj, b, id_field) {
  var new_obj = {};
  b.forEach(function (item) {
    item.id = item[id_field];
    new_obj[item.id] = item;
  });

  updateObject(obj, new_obj);
};

var s = window.io(window.location.origin);

(function ($, w) {
  var book_ref;

  s.on('query', function (d) {
    console.log(d);
    switch(d.action) {
      case 'query':
        updateFromList(book_ref, d.data, 'bid');
      break;
    };
  });

  w.hookBooks = function (books) {
    book_ref = books;
  }
})(window.jQuery, window);
