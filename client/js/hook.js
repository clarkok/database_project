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

(function ($, w) {
  var book_ref;
  var card_ref;

  w.socketEvents.addListener('query', function (d) {
    updateFromList(book_ref, d, 'bid');
  });

  w.socketEvents.addListener('list_card', function (d) {
    console.log(d);
    updateFromList(card_ref, d, 'cid');
  });

  w.hookBooks = function (books) {
    book_ref = books;
  }

  w.hookCards = function (cards) {
    card_ref = cards;
  }
})(window.jQuery, window);
