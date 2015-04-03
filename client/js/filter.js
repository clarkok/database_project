"use strict";

(function ($, w) {
  $.fn.filterInit = function (column_list) {
    var init = function ($filter) {
      $filter.get(0).filter_inited = true;

      var buildSelectKeys = function (list) {
        return $('<select />').append(
          list.map(function (item) {
            return $('<option />').attr('value', item).text(item);
          })
        );
      };

      var buildFilterListItem = function () {
        return $('<li />').append(
          $('<div />').addClass('column filter-name').append(
            $('<span />').addClass('delete').text('-'),
            buildSelectKeys(column_list).addClass('name')
          ),
          $('<div />').addClass('column filter-relation').append(
            buildSelectKeys(['=', '<>', '>', '<', '<=', '>='])
              .addClass('relation')
          ),
          $('<div />').addClass('column filter-value').append(
            $('<input />').attr('type', 'text').addClass('value')
          )
        ).addClass('show');
      };

      var appendFilter = function () {
        $filter.children('li.add').before(buildFilterListItem);
        $filter.trigger('filterchange');
      };

      var removeFilter = function () {
        var $parent = $(this).parents('li.show');
        $parent.get(0).className = 'hide';
        $parent.on('transitionend', function () {
          $parent.remove();
        });
        $filter.trigger('filterchange');
      };

      $filter.on('click', 'li.add', appendFilter);
      $filter.on('click', 'span.delete', removeFilter);
      $filter.on('change', 'select, input', function () {
        $filter.trigger('filterchange');
      });
    };

    this.each(function () {
      init($(this));
    });
  };

  $.fn.getFilterArray = function () {
    if (this.get(0).filter_inited) {
      var ret = [];

      this.eq(0).find('.show').each(function () {
        ret.push({
          name : $(this).find('select.name').val(),
          relation : $(this).find('select.relation').val(),
          value : $(this).find('input.value').val()
        });
      });

      return ret;
    }
    return [];
  };

})(window.jQuery, window);
