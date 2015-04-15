"use strict";

(function ($, w) {
  $.fn.layout = function (width, height, margin, selector) {
    if (width)
      width = parseInt(width, 10);
    else
      width = 200;
    if (height)
      height = parseInt(height, 10);
    else
      height = 300;
    if (margin)
      margin = parseInt(margin, 10);
    else
      margin = 32;

    var window_width = this.width();
    var window_height = this.height();
    var current_x = 0;
    var current_y = 0;

    var _wrapper = this;

    this.children(selector).each(function () {
      if (current_x + width > window_width) {
        current_x = 0;
        current_y += height + margin;
      }

      $(this).css({
        left: current_x,
        top: current_y
      });

      current_x += width + margin;
      _wrapper.css('height', current_y + height);
    });
  };
})(window.jQuery, window);
