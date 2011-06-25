var PaginationRenderer = Class.$extend({
  __init__: function(configuration){
    this.configuration = configuration;
    this.utils = new RenderUtils();
  },

  render: function(total_table) {
    var $pagination_div = this.utils.new_div("pagination-div");
    total_table.append($pagination_div);

    var $pagination_inner = this.utils.new_div("pagination-inner-div");
    $pagination_div.append($pagination_inner);

    if (this.configuration.filters.use_advanced_search == true) {
      this._render_advanced_search($pagination_inner);

      $separator = this.utils.new_div("button-separator");
      $pagination_inner.append($separator);
    }

    this._render_page_size_select($pagination_inner);

    $separator = this.utils.new_div("button-separator");
    $pagination_inner.append($separator);

    this._render_before($pagination_inner);

    $separator = this.utils.new_div("button-separator");
    $pagination_inner.append($separator);

    this._render_current($pagination_inner);

    $separator = this.utils.new_div("button-separator");
    $pagination_inner.append($separator);

    this._render_after($pagination_inner);

    $separator = this.utils.new_div("button-separator");
    $pagination_inner.append($separator);

    this._render_display_text($pagination_inner);

    $clear_both = this.utils.new_div("clear-both");
    $pagination_inner.append($clear_both);

  },

  _render_display_text: function(pagination) {
    // this is the "displaying x to y of z items" string
    var $pagination_group = this.utils.new_div("pagination-group");
    pagination.append($pagination_group);
    var $span = $("<span></span>");
    $span.addClass("displaying-span");
    $span.attr("id", "displaying-string");
    $span.text(this.configuration.pagination.no_results_string);
    $pagination_group.append($span);
  },


  _render_before: function(pagination) {
    // group for the previous and first buttons
    var $pagination_group = this.utils.new_div("pagination-group");
    pagination.append($pagination_group);

    // first page button
    var $first_button = this.utils.new_div("pagination-button");
    $first_button.attr("id", "first-button");
    $pagination_group.append($first_button);
    var $first_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-first");
    $first_button.append($first_page_span);

    // previous page button
    var $previous_button = this.utils.new_div("pagination-button");
    $previous_button.attr("id", "previous-button");
    $pagination_group.append($previous_button);
    var $previous_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-prev");
    $previous_button.append($previous_page_span);
  },

  _render_after: function(pagination) {
    // group for the next and last buttons
    $pagination_group = this.utils.new_div("pagination-group");
    pagination.append($pagination_group);

    // next page button
    var $next_button = this.utils.new_div("pagination-button");
    $next_button.attr("id", "next-button");
    $pagination_group.append($next_button);
    var $next_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-next");
    $next_button.append($next_page_span);

    // last page button
    var $last_button = this.utils.new_div("pagination-button");
    $last_button.attr("id", "last-button");
    $pagination_group.append($last_button);
    var $last_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-end");
    $last_button.append($last_page_span);
  },

  _render_current: function(pagination) {
    // group for page text box
    $pagination_group = this.utils.new_div("pagination-group");
    pagination.append($pagination_group);
    $span = $("<span></span>");
    $span.addClass("pagination-counter");
    $span.html("Page&nbsp;&nbsp;");
    $pagination_group.append($span);
    var $input = $("<input></input>");
    $input.addClass("query-input-field");
    $input.attr("type", "text");
    $input.attr("size", "4");
    $input.attr("id", "current-page");
    $input.val(this.configuration.query.page);
    $pagination_group.append($input);
    $span = $("<span></span>");
    $span.attr("id", "total-pages");
    $span.html("&nbsp;&nbsp; of " + this.configuration.query.page);
    $pagination_group.append($span);
  },

  _render_advanced_search: function(pagination) {
    var $pagination_group = this.utils.new_div("pagination-group");
    pagination.append($pagination_group);
    var $advanced_search = this.utils.new_div("pagination-image-advanced-search");
    $advanced_search.addClass("pagination-button");
    $advanced_search.attr("id", "advanced-search-button");
    $pagination_group.append($advanced_search);
    var $advanced_span = $("<span></span>");
    $advanced_search.append($advanced_span);
  },


  _render_page_size_select: function(pagination) {
    var $pagination_group = this.utils.new_div("pagination-group");
    pagination.append($pagination_group);
    var $select = $("<select></select>");
    $select.attr("id", "page-size"); // select event bound to this id!
    $pagination_group.append($select);
    for (var i = 0; i < this.configuration.pagination.page_size_options.length; i++) {
      option = this.configuration.pagination.page_size_options[i];
      var $option = $("<option></option>");
      $option.text(option);
      $option.val(option);
      if (option == this.configuration.query.page_size) {
        $option.attr("selected", "selected");
      }
      $select.append($option);
    }
  },

});
