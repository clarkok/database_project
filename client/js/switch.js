(function ($, w) {
  $.fn.switchInit = function () {
    var init = function ($sw) {
      var value = $sw.data('value') || $sw.find('.choose').eq(0).data('value');
      $sw.data('value', value).trigger('change');
      $sw.find('.choose[data-value=' + value + ']').addClass('select');

      $sw.find('.choose').on('click', function () {
        if ($(this).hasClass('select'))
          return;
        $sw.find('.select').removeClass('select');
        $sw.data('value', $(this).data('value')).trigger('change');
        $(this).addClass('select');
      });
    };

    this.each(function () {
      if ($(this).hasClass('switch'))
        init($(this));
    });
    return this;
  };

  var $sw = $('.switch').switchInit();
})(window.jQuery, window);
