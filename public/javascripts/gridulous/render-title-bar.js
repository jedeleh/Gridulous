var TitleBarRenderer = Class.$extend({
  __init__: function(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  },

  bind_table_hide: function(element, event_string, grid) {
    $(element).bind(event_string, function() {
      $(grid).find(".total-table-id").toggle();
    });
  },

  render: function() {
    var $grid = this.configuration.grid();
    $grid.attr("style","width: "+this.configuration.size.width+"px;");

    var $title_bar_div = this.utils.new_div("title-bar");
    $grid.append($title_bar_div);
    var $title_span_div = this.utils.new_div("title-span");
    $title_bar_div.append($title_span_div);
    var $title_bar_span = this.utils.new_tag("span");
    $title_bar_span.text(this.configuration.metadata.title);
    $title_span_div.append($title_bar_span);

    var $search = this.utils.new_div("title-bar-button title-bar-search");
    $search.attr("title", "Search filters");
    $title_bar_div.append($search);
    var $toggle_span = this.utils.new_tag("span", "ui-icon ui-icon-search");
    $search.append($toggle_span);

    var $title_bar_column_configure = this.utils.new_div("title-bar-button title-bar-column-configure");
    $title_bar_column_configure.attr("title", "Configure Columns");
    $title_bar_div.append($title_bar_column_configure);
    var $toggle_span = this.utils.new_tag("span", "ui-icon ui-icon-triangle-1-sw");
    $title_bar_column_configure.append($toggle_span);

    var $title_bar_toggle = this.utils.new_div("title-bar-button title-bar-toggle");
    $title_bar_toggle.attr("title", "Minimize/Maximize Table");
    $title_bar_div.append($title_bar_toggle);
    var $toggle_span = this.utils.new_tag("span", "ui-icon ui-icon-triangle-2-n-s");
    $title_bar_toggle.append($toggle_span);

    // hook in the hide table event -- this one has behavior, the others open dialogs
    this.bind_table_hide($title_bar_toggle, "click", $grid);
  }
});

