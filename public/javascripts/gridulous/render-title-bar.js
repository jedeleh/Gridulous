var TitleBarRenderer = Class.$extend({
  __init__: function(configuration) {
    this.configuration = configuration;
  },

  bind_table_hide: function(element, event_string, grid) {
    $(element).bind(event_string, function() {
      $(grid).find(".total-table").toggle();
    });
  },

  bind_column_configure: function(element, event_string, grid) {
    return false;
  },
  /*
  .title-bar
    .title-span
      %span Album collections
    .title-bar-column-configure{:title => "Configure Columns"}
      %span.ui-icon.ui-icon-triangle-1-sw
    .title-bar-toggle{:title => "Minimize/Maximize Table"}
      %span
  */

  render: function() {
    var $grid = this.configuration.grid();
    $grid.attr("style","width: "+this.configuration.size.width+"px;");

    var $title_bar_div = $("<div></div>");
    $title_bar_div.addClass("title-bar");
    $grid.append($title_bar_div);
    var $title_span_div = $("<div></div>");
    $title_span_div.addClass("title-span");
    $title_bar_div.append($title_span_div);
    var $title_bar_span = $("<span></span>");
    $title_bar_span.text(this.configuration.metadata.title);
    $title_span_div.append($title_bar_span);

    if (this.configuration.layout.use_column_visibility_widget) {
      var $title_bar_column_configure = $("<div></div>");
      $title_bar_column_configure.addClass("title-bar-column-configure");
      $title_bar_column_configure.attr("title", "Configure Columns");
      $title_bar_div.append($title_bar_column_configure);
      var $toggle_span = $("<span></span>");
      $toggle_span.addClass("ui-icon");
      $toggle_span.addClass("ui-icon-triangle-1-sw");
      $title_bar_column_configure.append($toggle_span);
    }

    var $title_bar_toggle = $("<div></div>");
    $title_bar_toggle.addClass("title-bar-toggle");
    $title_bar_toggle.attr("title", "Minimize/Maximize Table");
    $title_bar_div.append($title_bar_toggle);
    var $toggle_span = $("<span></span>");
    $title_bar_toggle.append($toggle_span);

    // hook in the hide table event
    this.bind_table_hide($title_bar_toggle, "click", $grid);
    this.bind_column_configure($title_bar_column_configure, "click", $grid);
  }

});

