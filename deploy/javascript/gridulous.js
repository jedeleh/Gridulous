/*
Gridulous -- coffeescript web application framework agnostic table widget.
  Requires: jQuery & HAML
    For building from source, you'll also need SASS and CoffeeScript
  Author: JD Kaplan
  Github URL: https://github.com/jedeleh/Gridulous
  License: MIT

List of Classes
================
class Bindings
class ButtonBarRenderer
class ColumnChooserRenderer
class ColumnHeadersRenderer
class Console
class DataEngine
class GridButton
class GridButtons
class GridColumn
class GridConfiguration
class GridFilters
class GridFramework
class GridHooks
class GridLayout
class GridPagination
class GridQuery
class GridSize
class PaginationRenderer
class Renderer
class RenderUtils
class SearchDialog
class SearchRenderer
class TitleBarRenderer
*/
/*
RenderUtils
*/
var Bindings, ButtonBarRenderer, ColumnChooserRenderer, ColumnHeadersRenderer, Console, DataEngine, GridButton, GridButtons, GridColumn, GridConfiguration, GridFilters, GridFramework, GridHooks, GridLayout, GridPagination, GridQuery, GridSize, PaginationRenderer, RenderUtils, Renderer, SearchDialog, SearchRenderer, TitleBarRenderer;
RenderUtils = (function() {
  function RenderUtils() {}
  RenderUtils.prototype.new_div = function(css_class) {
    var div;
    div = jQuery("<div></div>");
    div.addClass(css_class);
    return div;
  };
  RenderUtils.prototype.blank_div = function() {
    var div;
    div = jQuery("<div></div>");
    return div;
  };
  RenderUtils.prototype.add_style = function(props, values, tag) {
    var buffer, i, prop, _i, _len;
    buffer = "";
    i = 0;
    for (_i = 0, _len = props.length; _i < _len; _i++) {
      prop = props[_i];
      buffer += prop + ": " + values[i] + ";";
      i++;
    }
    return jQuery(tag).attr("style", buffer);
  };
  RenderUtils.prototype.new_tag = function(tag_name, css_class) {
    var tag, tag_string;
    tag_string = "<" + tag_name + "></" + tag_name + ">";
    tag = jQuery(tag_string);
    if (css_class) {
      tag.addClass(css_class);
    }
    return tag;
  };
  return RenderUtils;
})();
/*
Bindings
*/
Bindings = (function() {
  function Bindings() {}
  Bindings.prototype.bind_events = function(configuration, grid) {
    var column, column_headings, grid_container, sort, toggle, toggles, _i, _j, _len, _len2;
    grid_container = configuration.grid();
    /* page size selection */
    jQuery(grid_container).find("#page-size").change(function() {
      var page;
      page = configuration.query.page;
      configuration.query.page = 1;
      configuration.query.page_size = $(this).val();
      return grid.execute_query;
    });
    /* next page button 'next-button' */
    jQuery(grid_container).find("#next-button").click(function() {
      var end_page, page;
      page = configuration.query.page;
      end_page = Math.ceil(grid.current_total / configuration.query.page_size);
      if (page < end_page) {
        configuration.query.page = page + 1;
        return grid.execute_query();
      }
    });
    /* last page button 'last-button' */
    jQuery(grid_container).find("#last-button").click(function() {
      var end_page, page, pages;
      page = configuration.query.page;
      pages = grid.current_total / configuration.query.page_size;
      end_page = Math.ceil(grid.current_total / configuration.query.page_size);
      if (page < end_page) {
        configuration.query.page = end_page;
        return grid.execute_query();
      }
    });
    /* first page button 'first-button' */
    jQuery(grid_container).find("#first-button").click(function() {
      var page;
      page = configuration.query.page;
      if (page > 1) {
        configuration.query.page = 1;
        return grid_execute_query();
      }
    });
    /* previous page button 'previous-button' */
    jQuery(grid_container).find("#previous-button").click(function() {
      var page;
      page = configuration.query.page;
      if (page > 1) {
        configuration.query.page = page - 1;
        return grid_execute_query();
      }
    });
    /* page text field */
    jQuery(grid_container).find("#current-page").keypress(function(event_object) {
      var page;
      if (event_object.which === 13) {
        page = parseInt(jQuery(grid_container).find("#current-page").val());
        if (page > 0 && page <= grid.current_total) {
          return configuration.query.page = page;
        } else {
          jQuery(grid_container).find("#current-page").val(configuration.query.page);
          return grid.execute_query();
        }
      }
    });
    /* refresh button (eventually) */
    /* find box */
    jQuery(grid_container).find("#filter-string").keypress(function() {
      if (event_object.which === 13) {
        configuration.query.filter_string = jQuery(grid_container).find("#filter-string").val();
        configuration.query.filter_column = jQuery(grid_container).find("#filter-column").val();
        configuration.query.page = 1;
        return grid.execute_query();
      }
    });
    /* clear button */
    jQuery(grid_container).find("#t").click(function() {
      configuration.query.filter_string = "";
      configuration.query.page = 1;
      return grid.execute_query();
    });
    /* column sorts */
    column_headings = jQuery(grid_container).find(".header-cell");
    for (_i = 0, _len = column_headings.length; _i < _len; _i++) {
      column = column_headings[_i];
      sort = jQuery(column).find(".sort-area span");
      this._bind_sort(sort, column, configuration, grid, grid_container);
    }
    /* checkboxes on custom columns dialog IFF it's in use */
    toggles = jQuery(grid_container).find("#column-chooser-dialog input[type=checkbox]");
    for (_j = 0, _len2 = toggles.length; _j < _len2; _j++) {
      toggle = toggles[_j];
      this._bind_column_toggle(toggle, configuration, grid, grid_container);
    }
    /* bind resizable to column containers */
    jQuery(grid_container).find(".content-container").sortable({
      axis: "x",
      stop: function(event, ui) {
        var columns, new_column_list;
        columns = configuration.layout.columns;
        new_column_list = [];
        jQuery(".header-cell").each(function(index, element) {
          var id;
          id = jQuery(element).attr("id");
          return jQuery.each(columns, function(index, column) {
            if (column.id === id) {
              return new_column_list.push(column);
            }
          });
        });
        return configuration.layout.columns = new_column_list;
      }
    });
    return jQuery(grid_container).find(".column-container").resizable;
  };
  Bindings.prototype._bind_column_toggle = function(toggle, configuration, grid, grid_container) {
    return jQuery(toggle).click(function() {
      var column, column_container, column_id, columns, _i, _len, _results;
      column_id = toggle.id;
      column_id = column_id.split("-")[0];
      columns = configuration.layout.columns;
      _results = [];
      for (_i = 0, _len = columns.length; _i < _len; _i++) {
        column = columns[_i];
        if (column.id === column_id) {
          column_container = jQuery(grid_container).find("#" + column.id + "-column");
          if (column.hide === true) {
            column.hide = false;
            jQuery(column_container).removeClass("generic-hide");
          } else {
            column.hide = true;
            jQuery(column_container).addClass("generic-hide");
          }
          break;
        }
      }
      return _results;
    });
  };
  Bindings.prototype._bind_sort = function(sort, column, configuration, grid, grid_container) {
    return jQuery(sort).click(function() {
      var current_order, current_sort;
      current_sort = configuration.query.sort_column;
      current_order = configuration.query.sort_order;
      if (current_sort === column.id) {
        if (current_order === "ASC") {
          configuration.query.sort_order = "DESC";
          jQuery(sort).find("div").removeClass("ascending");
          jQuery(sort).removeClass("ui-icon-carat-1-n");
          jQuery(sort).removeClass("ui-icon-carat-2-n-s");
          jQuery(sort).find("div").addClass("descending");
          jQuery(sort).addClass("ui-icon-carat-1-s");
        } else {
          configuration.query.sort_order = "ASC";
          jQuery(sort).removeClass("ui-icon-carat-1-s");
          jQuery(sort).removeClass("ui-icon-carat-2-n-s");
          jQuery(sort).addClass("ui-icon-carat-1-n");
          jQuery(sort).find("div").removeClass("descending");
          jQuery(sort).find("div").addClass("ascending");
        }
      } else {
        jQuery(grid_container).find(".sorted").removeClass("ui-icon-carat-1-n");
        jQuery(grid_container).find(".sorted").removeClass("ui-icon-carat-1-s");
        jQuery(grid_container).find(".sorted").addClass("ui-icon-carat-2-n-s");
        jQuery(grid_container).find(".sorted").removeClass("ascending");
        jQuery(grid_container).find(".sorted").removeClass("descending");
        jQuery(grid_container).find(".sorted").removeClass("sorted");
        jQuery(sort).addClass("sorted");
        jQuery(sort).addClass("ascending");
        jQuery(sort).addClass("ui-icon-carat-1-n");
        jQuery(sort).removeClass("ui-icon-carat-1-s");
        jQuery(sort).removeClass("ui-icon-carat-2-n-s");
        configuration.query.sort_order = "ASC";
      }
      configuration.query.sort_column = column.id;
      return grid.execute_query();
    });
  };
  return Bindings;
})();
/*
GridSize
*/
GridSize = (function() {
  function GridSize() {
    this.height = 200;
    this.width = 'auto';
  }
  GridSize.prototype.pickle = function() {
    return {
      "height": this.height,
      "width": this.width
    };
  };
  GridSize.prototype.unpickle = function(representation) {
    this.height = representation.height;
    return this.width = representation.width;
  };
  return GridSize;
})();
/*
GridColumn
*/
GridColumn = (function() {
  function GridColumn() {
    this.display_name = "";
    this.id = "";
    this.sortable = false;
    this.hide = false;
    this.width = 100;
    this.alignment = "left";
    this.optional = true;
    /*
        built in support for checkboxes and links. if you choose link you need
        cell data [<uri>,<text>,{optional key/value pairs to go on the tag}]
        if checkbox you can provide [<value>, <optional-css-class>]
        otherwise just a single value is expected.
        */
    this.type = "standard";
  }
  GridColumn.prototype.pickle = function() {
    return {
      "display_name": this.display_name,
      "id": this.id,
      "sortable": this.sortable,
      "hide": this.hide,
      "width": this.width,
      "alignment": this.alignment,
      "optional": this.optional,
      "type": this.type
    };
  };
  GridColumn.prototype.unpickle = function(representation) {
    this.display_name = representation.display_name;
    this.id = representation.id;
    this.sortable = representation.sortable;
    this.hide = representation.hide;
    this.width = representation.width;
    this.alignment = representation.alignment;
    this.optional = representation.optional;
    return this.type = representation.type;
  };
  return GridColumn;
})();
/*
GridLayout
*/
GridLayout = (function() {
  function GridLayout() {
    this.use_row_striping = true;
    this.columns = [];
  }
  GridLayout.prototype.create_column = function() {
    return new GridColumn();
  };
  GridLayout.prototype.set_columns = function(columns) {
    var column, input_column, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      input_column = columns[_i];
      column = new GridColumn();
      column.unpickle(input_column);
      _results.push(this.columns.push(input_column));
    }
    return _results;
  };
  GridLayout.prototype.pickle = function() {
    var column, columns, _i, _len, _ref;
    columns = [];
    _ref = this.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      columns.push(this.columns.pickle());
    }
    return {
      "use_row_striping": this.use_row_striping,
      "columns": columns
    };
  };
  GridLayout.prototype.unpickle = function(representation) {
    var column, input_column, _i, _len, _ref, _results;
    this.use_row_striping = representation.use_row_striping;
    _ref = representation.columns;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      input_column = _ref[_i];
      column = new GridColumn();
      column.unpickle(input_column);
      _results.push(this.columns.push(column));
    }
    return _results;
  };
  return GridLayout;
})();
/*
GridQuery
*/
GridQuery = (function() {
  function GridQuery() {
    this.filter_string = "";
    this.filter_column = null;
    this.sort_column = null;
    this.sort_order = "ASC";
    this.page = 1;
    this.page_size = 15;
    this.custom_filters = [];
  }
  GridQuery.prototype.pickle = function() {
    return {
      "filter_string": this.filter_string,
      "filter_column": this.filter_column,
      "sort_column": this.sort_column,
      "sort_order": this.sort_order,
      "page": this.page,
      "page_size": this.page_size,
      "custom_filters": this.custom_filters
    };
  };
  GridQuery.prototype.unpickle = function(representation) {
    this.filter_string = representation.filter_string;
    this.filter_column = representation.filter_column;
    this.sort_column = representation.sort_column;
    this.sort_order = representation.sort_order;
    this.page = representation.page;
    this.page_size = representation.page_size;
    return this.custom_filters = representation.custom_filters;
  };
  return GridQuery;
})();
/*
GridButton
*/
GridButton = (function() {
  function GridButton() {
    this.name = "";
    this.css_class = "";
    this.action = "";
    this.icon = "";
  }
  GridButton.prototype.pickle = function() {
    return {
      "name": this.name,
      "css_class": this.css_class,
      "action": this.action,
      "icon": this.ico
    };
  };
  GridButton.prototype.unpickle = function(representation) {
    this.name = representation.name;
    this.css_class = representation.css_class;
    this.action = representation.action;
    return this.icon = representation.icon;
  };
  return GridButton;
})();
GridButtons = (function() {
  function GridButtons() {
    this.buttons = [];
  }
  GridButtons.prototype.create_button = function() {
    return new GridButton();
  };
  GridButtons.prototype.set_buttons = function(buttons) {
    var button, input_button, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = buttons.length; _i < _len; _i++) {
      input_button = buttons[_i];
      button = new GridButton();
      button.unpickle(input_button);
      _results.push(this.buttons.push(button));
    }
    return _results;
  };
  GridButtons.prototype.pickle = function() {
    var button, buttons, _i, _len, _ref;
    buttons = [];
    _ref = this.buttons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      button = _ref[_i];
      buttons.push(this.button.pickle());
    }
    return {
      "buttons": buttons
    };
  };
  GridButtons.prototype.unpickle = function(representation) {
    var button, input_button, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = representation.length; _i < _len; _i++) {
      input_button = representation[_i];
      button = new GridButton();
      button.unpickle(input_button);
      _results.push(this.buttons.push(button));
    }
    return _results;
  };
  return GridButtons;
})();
/*
GridPagination
*/
GridPagination = (function() {
  function GridPagination() {
    this.page_size_options = [10, 25, 50, 100, 200];
    this.items_name = "items";
    this.processing_string = "Processing request...";
    this.error_string = "Processing error...";
    this.no_results_string = "No items found.";
  }
  GridPagination.prototype.pickle = function() {
    return {
      "page_size_options": this.page_size_options,
      "items_name": this.items_name,
      "processing_string": this.processing_string,
      "error_string": this.error_string,
      "no_results_string": this.no_results_string
    };
  };
  GridPagination.prototype.unpickle = function(representation) {
    this.page_size_options = representation.page_size_options;
    this.items_name = representation.items_name;
    this.processing_string = representation.processing_string;
    this.error_string = representation.error_string;
    return this.no_results_string = representation.no_results_string;
  };
  return GridPagination;
})();
/*
GridHooks
*/
GridHooks = (function() {
  function GridHooks() {
    this.on_submit = null;
    this.on_success = null;
    this.on_failure = null;
  }
  GridHooks.prototype.pickle = function() {
    return {
      "on_submit": this.on_submit,
      "on_success": this.on_success,
      "on_failure": this.on_failure
    };
  };
  GridHooks.prototype.unpickle = function(representation) {
    this.on_submit = representation.on_submit;
    this.on_success = representation.on_success;
    return this.on_failure = representation.on_failure;
  };
  return GridHooks;
})();
/*
GridFilters
*/
GridFilters = (function() {
  function GridFilters() {
    this.use_advanced_search = false;
    this.search_callback = null;
    this.filter_column_names = [];
  }
  GridFilters.prototype.pickle = function() {
    return {
      "use_advanced_search": this.use_advanced_search,
      "filter_column_names": this.filter_column_names
    };
  };
  GridFilters.prototype.unpickle = function(representation) {
    this.use_advanced_search = representation.use_advanced_search;
    return this.filter_column_names = representation.filter_column_names;
  };
  return GridFilters;
})();
/*
GridConfiguration
*/
GridConfiguration = (function() {
  function GridConfiguration(grid_id) {
    this.id = grid_id;
    this.size = new GridSize();
    this.layout = new GridLayout();
    this.query = new GridQuery();
    this.buttons = new GridButtons();
    this.pagination = new GridPagination();
    this.filters = new GridFilters();
    this.hooks = new GridHooks();
    this.metadata = {
      title: "jGrid",
      method: "GET",
      action_uri: "",
      autoload: true,
      accordian: false,
      start_exposed: true
    };
    this.trigger = null;
  }
  GridConfiguration.prototype.grid = function() {
    return jQuery("#" + this.id);
  };
  GridConfiguration.prototype.pickle = function() {
    return {
      "size": this.size.pickle(),
      "layout": this.layout.pickle(),
      "query": this.query.pickle(),
      "buttons": this.buttons.pickle(),
      "pagination": this.pagination.pickle(),
      "filters": this.filters.pickle(),
      "hooks": this.hooks.pickle(),
      "metadata": this.metadata
    };
  };
  GridConfiguration.prototype.unpickle = function(representation) {
    this.size.unpickle(representation.size);
    this.layout.unpickle(representation.layout);
    this.query.unpickle(representation.query);
    this.buttons.unpickle(representation.buttons);
    this.pagination.unpickle(representation.pagination);
    this.filters.unpickle(representation.filters);
    this.hooks.unpickle(representation.hooks);
    return this.metadata = representation.metadata;
  };
  return GridConfiguration;
})();
/*
GridFramework
*/
GridFramework = (function() {
  function GridFramework(client_grid_id) {
    var GRID_HOLDER;
    this.configuration = new GridConfiguration(client_grid_id);
    this.renderer = new Renderer(this.configuration);
    this.bindings = new Bindings();
    GRID_HOLDER = this;
    this.current_total = 0;
  }
  /* set up the table minus data */
  GridFramework.prototype.render_grid = function() {
    this.renderer.render(this);
    return this.bindings.bind_events(this.configuration, this);
  };
  GridFramework.prototype.query_success_handler = function(data, grid) {
    if (this.configuration.hooks.on_success) {
      this.configuration.hooks.on_success(data);
    }
    /* now after any client hooks have been executed render the grid */
    grid.current_total = data.total;
    return grid.renderer.populate_grid(data, grid.configuration);
  };
  GridFramework.prototype.query_failure_handler = function(data, grid) {
    if (this.configuration.hooks.on_failure) {
      this.configuration.hooks.on_failuredata;
    }
    return grid.renderer.render_error(data, grid.configuration);
  };
  GridFramework.prototype.execute_query = function() {
    var _this;
    if (this.configuration.hooks.on_submit) {
      this.configuration.hooks.on_submit();
    }
    /* first we need to clear the existing data out */
    this.renderer.clear_data();
    _this = this;
    return jQuery.ajax({
      type: this.configuration.metadata.method,
      url: this.configuration.metadata.action_uri,
      data: "grid=" + JSON.stringify(this.configuration.query.pickle()),
      dataType: 'json',
      success: function(data) {
        return _this.query_success_handler(data, _this);
      },
      failure: function(data) {
        return _this.query_failure_handler(data, _this);
      }
    });
  };
  return GridFramework;
})();
/*
Console
*/
Console = (function() {
  function Console() {}
  Console.prototype.log = function(message_string, alert_on_fail) {
    try {
      return console.log(message_string);
    } catch (error) {
      if (alert_on_fail) {
        return alert(message_string);
      }
    }
  };
  return Console;
})();
/*
Column Toggle dialog
*/
$(function() {
  $.fx.speeds._default = 400;
  return $(function() {
    jQuery("#column-chooser-dialog").dialog({
      autoOpen: false,
      show: "blind",
      hide: "blind",
      height: 150,
      width: 200,
      modal: true,
      buttons: {
        Ok: function() {
          return jQuery(this).dialog("close");
        }
      }
    });
    jQuery(".ui-dialog-titlebar").attr("style", "display:none");
    return jQuery(".title-bar-column-configure").click(function() {
      var dialog_height, tr_count;
      tr_count = jQuery("#column-chooser-dialog tr").length;
      dialog_height = tr_count * 50;
      jQuery("#column-chooser-dialog").dialog({
        height: dialog_height
      });
      return jQuery("#column-chooser-dialog").dialog("open");
    });
  });
});
({
  ontoggle_column: function(axis_string, grid_id) {
    var selector_string;
    selector_string = "#" + grid_id + " ." + axis_string;
    selector_string = "#" + grid_id + " . " + axis_string;
    if (jQuery(selector_string).hasClass("generic-hide")) {
      return jQuery(selector_string).removeClass("generic-hide");
    } else {
      return jQuery(selector_string).addClass("generic-hide");
    }
  }
});
ButtonBarRenderer = (function() {
  function ButtonBarRenderer(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  }
  ButtonBarRenderer.prototype.bind_button_event = function(element, event_string, func) {
    return jQuery(element).bind(event_string, func);
  };
  ButtonBarRenderer.prototype.render = function(container) {
    var button, button_bar_div, button_bar_inner_div, button_div, button_item, button_span, clear_div, separator, _i, _len, _ref;
    button_bar_div = jQuery("<div></div>");
    jQuery(button_bar_div).addClass("button-bar");
    container.append(button_bar_div);
    button_bar_inner_div = jQuery("<div></div>");
    jQuery(button_bar_inner_div).addClass("button-bar-inner");
    jQuery(button_bar_div).append(button_bar_inner_div);
    _ref = this.configuration.buttons.buttons;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      button_item = _ref[_i];
      if (button_item.name !== "separator") {
        button_div = jQuery("<div></div>");
        jQuery(button_div).addClass("button-bar-button");
        jQuery(button_bar_inner_div).append(button_div);
        button = jQuery("<div></div>");
        jQuery(button).addClass(button_item.css_class);
        jQuery(button_div).append(button);
        button_span = jQuery("<span></span>");
        jQuery(button_span).attr("style", "padding-left: 20px;");
        jQuery(button_span).text(button_item.name);
        jQuery(button).append(button_span);
        this.bind_button_event(button, 'click', button_item.action);
      } else {
        separator = jQuery("<div></div>");
        jQuery(separator).addClass("button-separator");
        jQuery(button_bar_inner_div).append(separator);
      }
    }
    clear_div = jQuery("<div></div>");
    jQuery(clear_div).addClass("clear-both");
    return jQuery(button_bar_div).append(clear_div);
  };
  return ButtonBarRenderer;
})();
/*
  .button-bar
    .button-bar-inner
      .button-bar-button
        %div
          %span.add-button{:style => "padding-left: 20px;"} Add
      .button-bar-button
        %div
          %span.delete-button{:style => "padding-left: 20px;"} Delete
      .button-separator
      .button-bar-button
        %div
          %span.ui-icon.ui-icon-triangle-1-sw
          %span Configure columns

    .clear-both
*/
/*
ColumnChooserRenderer
*/
ColumnChooserRenderer = (function() {
  function ColumnChooserRenderer(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  }
  ColumnChooserRenderer.prototype.render = function() {
    var chooser_dialog, chooser_div, column, columns, grid, i, table, tbody, tr, _i, _len, _results;
    grid = this.configuration.grid();
    chooser_dialog = jQuery("<div id='column-chooser-dialog'></div>");
    grid.append(chooser_dialog);
    chooser_div = this.utils.new_div("column-chooser-div");
    chooser_div.attr("style", "margin-bottom: -" + this.configuration.size.height + "px; height: auto; width: auto; top: 75px; left: 503px;");
    chooser_dialog.append(chooser_div);
    table = this.utils.new_tag("table");
    chooser_div.append(table);
    tbody = this.utils.new_tag("tbody");
    table.append(tbody);
    columns = this.configuration.layout.columns;
    i = 0;
    _results = [];
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      column = columns[_i];
      tr = this._generate_chooser_row(column, i);
      tbody.append(tr);
      _results.push(i++);
    }
    return _results;
  };
  ColumnChooserRenderer.prototype._generate_chooser_row = function(column, index) {
    var axis_string, check_box, label, td_label, td_top, tr;
    tr = this.utils.new_tag("tr");
    axis_string = "col" + index;
    td_top = this.utils.new_tag("td", "show-hide-input");
    tr.append(td_top);
    check_box = this.utils.new_tag("input", "show-hide-checkbox");
    check_box.attr("id", column.id + "-toggle");
    if (column.optional === true) {
      check_box.attr("onclick", "ontoggle_column('" + axis_string + "','" + this.configuration.id + "');");
    }
    check_box.attr("type", "checkbox");
    check_box.val(index);
    if (column.hide === false) {
      check_box.attr("checked", "checked");
    }
    if (column.optional === false) {
      check_box.attr("checked", "checked");
      check_box.attr("disabled", "true");
    }
    td_top.append(check_box);
    td_label = this.utils.new_tag("td", "show-hide-label");
    tr.append(td_label);
    label = jQuery("<label>" + column.display_name + "</label>");
    td_label.append(label);
    return tr;
  };
  return ColumnChooserRenderer;
})();
/*
ColumnHeadersRenderer
*/
ColumnHeadersRenderer = (function() {
  function ColumnHeadersRenderer(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  }
  ColumnHeadersRenderer.prototype.render = function(total_table) {
    var column, column_container, columns, content_container, heading_cell, i, total_width, _i, _len;
    content_container = this.utils.new_div("content-container");
    this.utils.add_style(["width", "height"], [this.configuration.size.width + 10, this.configuration.size.height + 10], content_container);
    columns = this.configuration.layout.columns;
    total_width = 0;
    i = 0;
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      column = columns[_i];
      column_container = this._render_column_container(column, i);
      content_container.append(column_container);
      heading_cell = this._render_column(column, i);
      column_container.append(heading_cell);
      if (column.hide) {
        column_container.addClass("generic-hide");
      }
      i++;
    }
    total_table.append(content_container);
    return content_container;
  };
  ColumnHeadersRenderer.prototype._render_column_container = function(column, index) {
    var column_div;
    column_div = this.utils.new_div("column-container float-left column-border");
    column_div.attr("id", column.id + "-column");
    this.utils.add_style(["width", "height"], [column.width + "px", this.configuration.size.height + "px"], column_div);
    return column_div;
  };
  ColumnHeadersRenderer.prototype._render_column = function(column, index) {
    var heading, sort_image, span;
    heading = this.utils.new_div("cell-border clear-both header-cell");
    heading.attr("id", column.id);
    this.utils.add_style(["text-align"], ["center"], heading);
    sort_image = this._build_sort_image(column);
    span = this.utils.new_tag("span");
    heading.append(span);
    heading.append(sort_image);
    span.text(column.display_name);
    return heading;
  };
  ColumnHeadersRenderer.prototype._build_sort_image = function(column) {
    var div, sort_column_id, sort_order, span;
    div = this.utils.new_div("sort-area");
    span = this.utils.new_tag("span");
    sort_column_id = this.configuration.query.sort_column;
    sort_order = this.configuration.query.sort_order;
    if (sort_column_id === column.id) {
      if (sort_order === "ASC") {
        span.addClass("ui-icon ui-icon-carat-1-n sorted ascending");
      } else {
        span.addClass("ui-icon ui-icon-carat-1-s sorted descending");
      }
    } else {
      span.addClass("ui-icon ui-icon-carat-2-n-s");
    }
    div.append(span);
    return div;
  };
  return ColumnHeadersRenderer;
})();
/*
PaginationRenderer
*/
PaginationRenderer = (function() {
  function PaginationRenderer(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  }
  PaginationRenderer.prototype.render = function(total_table) {
    var clear_both, pagination_div, pagination_inner, separator;
    pagination_div = this.utils.new_div("pagination-div");
    total_table.append(pagination_div);
    pagination_inner = this.utils.new_div("pagination-inner-div");
    pagination_div.append(pagination_inner);
    if (this.configuration.filters.use_advanced_search === true) {
      this._render_advanced_search(pagination_inner);
      separator = this.utils.new_div("button-separator");
      pagination_inner.append(separator);
    }
    this._render_page_size_select(pagination_inner);
    separator = this.utils.new_div("button-separator");
    pagination_inner.append(separator);
    this._render_before(pagination_inner);
    separator = this.utils.new_div("button-separator");
    pagination_inner.append(separator);
    this._render_current(pagination_inner);
    separator = this.utils.new_div("button-separator");
    pagination_inner.append(separator);
    this._render_after(pagination_inner);
    separator = this.utils.new_div("button-separator");
    pagination_inner.append(separator);
    this._render_display_text(pagination_inner);
    clear_both = this.utils.new_div("clear-both");
    return pagination_inner.append(clear_both);
  };
  PaginationRenderer.prototype._render_display_text = function(pagination) {
    var pagination_group, span;
    pagination_group = this.utils.new_div("pagination-group");
    pagination.append(pagination_group);
    span = jQuery("<span></span>");
    span.addClass("displaying-span");
    span.attr("id", "displaying-string");
    span.text(this.configuration.pagination.no_results_string);
    return pagination_group.append(span);
  };
  PaginationRenderer.prototype._render_before = function(pagination) {
    var first_button, first_page_span, pagination_group, previous_button, previous_page_span;
    pagination_group = this.utils.new_div("pagination-group");
    pagination.append(pagination_group);
    first_button = this.utils.new_div("pagination-button");
    first_button.attr("id", "first-button");
    pagination_group.append(first_button);
    first_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-first");
    first_button.append(first_page_span);
    previous_button = this.utils.new_div("pagination-button");
    previous_button.attr("id", "previous-button");
    pagination_group.append(previous_button);
    previous_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-prev");
    return previous_button.append(previous_page_span);
  };
  PaginationRenderer.prototype._render_after = function(pagination) {
    var last_button, last_page_span, next_button, next_page_span, pagination_group;
    pagination_group = this.utils.new_div("pagination-group");
    pagination.append(pagination_group);
    next_button = this.utils.new_div("pagination-button");
    next_button.attr("id", "next-button");
    pagination_group.append(next_button);
    next_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-next");
    next_button.append(next_page_span);
    last_button = this.utils.new_div("pagination-button");
    last_button.attr("id", "last-button");
    pagination_group.append(last_button);
    last_page_span = this.utils.new_tag("span", "ui-icon ui-icon-seek-end");
    return last_button.append(last_page_span);
  };
  PaginationRenderer.prototype._render_current = function(pagination) {
    var input, pagination_group, span;
    pagination_group = this.utils.new_div("pagination-group");
    pagination.append(pagination_group);
    span = jQuery("<span></span>");
    span.addClass("pagination-counter");
    span.html("Page&nbsp;&nbsp;");
    pagination_group.append(span);
    input = jQuery("<input></input>");
    input.addClass("query-input-field");
    input.attr("type", "text");
    input.attr("size", "4");
    input.attr("id", "current-page");
    input.val(this.configuration.query.page);
    pagination_group.append(input);
    span = jQuery("<span></span>");
    span.attr("id", "total-pages");
    span.html("&nbsp;&nbsp; of " + this.configuration.query.page);
    return pagination_group.append(span);
  };
  PaginationRenderer.prototype._render_advanced_search = function(pagination) {
    var advanced_search, advanced_span, pagination_group;
    pagination_group = this.utils.new_div("pagination-group");
    pagination.append(pagination_group);
    advanced_search = this.utils.new_div("pagination-image-advanced-search");
    advanced_search.addClass("pagination-button");
    advanced_search.attr("id", "advanced-search-button");
    pagination_group.append(advanced_search);
    advanced_span = jQuery("<span></span>");
    return advanced_search.append(advanced_span);
  };
  PaginationRenderer.prototype._render_page_size_select = function(pagination) {
    var option, options_range, pagination_group, select, _i, _len, _results;
    pagination_group = this.utils.new_div("pagination-group");
    pagination.append(pagination_group);
    select = jQuery("<select></select>");
    select.attr("id", "page-size");
    pagination_group.append(select);
    options_range = this.configuration.pagination.page_size_options;
    _results = [];
    for (_i = 0, _len = options_range.length; _i < _len; _i++) {
      option = options_range[_i];
      option = jQuery("<option></option>");
      option.text(option);
      option.val(option);
      if (option === this.configuration.query.page_size) {
        option.attr("selected", "selected");
      }
      _results.push(select.append(option));
    }
    return _results;
  };
  return PaginationRenderer;
})();
/*
SearchRenderer
*/
SearchRenderer = (function() {
  function SearchRenderer(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  }
  SearchRenderer.prototype.render = function(total_table) {
    var column, fieldset, input, legend, option, position, search_dialog, search_div, search_div_inner, select, _i, _len, _ref, _results;
    search_dialog = jQuery("<div id='" + this.configuration.grid_id + "-gridulous-search-dialog'></div>");
    total_table.append(search_dialog);
    search_div = this.utils.new_div("search-div");
    position = jQuery(total_table).find(".title-bar-search").position;
    search_div.attr("style", "margin-bottom: -" + this.configuration.size.height + "px; height: auto; width: auto; top: " + position.bottom + "px; left: 503px;");
    search_dialog.append(search_div);
    search_div_inner = jQuery("<div></div>");
    search_div_inner.addClass("search-div-inner");
    search_div.append(search_div_inner);
    fieldset = this.utils.new_tag("fieldset");
    search_div_inner.append(fieldset);
    legend = this.utils.new_tag("legend");
    fieldset.append(legend);
    legend.text("Find");
    input = this.utils.new_tag("input", "filter-string-input");
    input.attr("type", "text");
    input.attr("size", "30");
    input.attr("name", "filter-string");
    input.attr("id", "filter-string");
    fieldset.append(input);
    select = this.utils.new_tag("select");
    select.attr("id", "filter-column");
    fieldset.append(select);
    _ref = this.configuration.layout.columns;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      option = jQuery("<option></option>");
      option.text(column.display_name);
      option.val(column.id);
      if (column.id === this.configuration.query.filter_column) {
        option.attr("selected", "selected");
      }
      _results.push(select.append(option));
    }
    return _results;
  };
  return SearchRenderer;
})();
/*
TitleBarRenderer
*/
TitleBarRenderer = (function() {
  function TitleBarRenderer(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  }
  TitleBarRenderer.prototype.bind_table_hide = function(element, event_string, grid) {
    return jQuery(element).bind(event_string, function() {
      return jQuery(grid).find(".total-table-id").toggle();
    });
  };
  TitleBarRenderer.prototype.render = function() {
    var grid, search, title_bar_column_configure, title_bar_div, title_bar_span, title_bar_toggle, title_span_div, toggle_span;
    grid = this.configuration.grid();
    grid.attr("style", "width: " + this.configuration.size.width + "px;");
    title_bar_div = this.utils.new_div("title-bar");
    grid.append(title_bar_div);
    title_span_div = this.utils.new_div("title-span");
    title_bar_div.append(title_span_div);
    title_bar_span = this.utils.new_tag("span");
    title_bar_span.text(this.configuration.metadata.title);
    title_span_div.append(title_bar_span);
    search = this.utils.new_div("title-bar-button title-bar-search");
    search.attr("title", "Search filters");
    title_bar_div.append(search);
    toggle_span = this.utils.new_tag("span", "ui-icon ui-icon-search");
    search.append(toggle_span);
    title_bar_column_configure = this.utils.new_div("title-bar-button title-bar-column-configure");
    title_bar_column_configure.attr("title", "Configure Columns");
    title_bar_div.append(title_bar_column_configure);
    toggle_span = this.utils.new_tag("span", "ui-icon ui-icon-triangle-1-sw");
    title_bar_column_configure.append(toggle_span);
    title_bar_toggle = this.utils.new_div("title-bar-button title-bar-toggle");
    title_bar_toggle.attr("title", "Minimize/Maximize Table");
    title_bar_div.append(title_bar_toggle);
    toggle_span = this.utils.new_tag("span", "ui-icon ui-icon-triangle-2-n-s");
    title_bar_toggle.append(toggle_span);
    return this.bind_table_hide(title_bar_toggle, "click", grid);
  };
  return TitleBarRenderer;
})();
/*
Renderer
*/
Renderer = (function() {
  function Renderer(grid_configuration) {
    this.configuration = grid_configuration;
    this.total_table = null;
    this.content_container = null;
    this.data_div = null;
    this.utils = new RenderUtils();
  }
  Renderer.prototype.render = function(grid) {
    new ColumnChooserRenderer(this.configuration).render();
    new TitleBarRenderer(this.configuration).render();
    this._render_total_table();
    new ButtonBarRenderer(this.configuration).render(this.total_table);
    this.content_container = new ColumnHeadersRenderer(this.configuration).render(this.total_table);
    this.total_table.append(this.utils.new_div("clear-both"));
    new PaginationRenderer(this.configuration).render(this.total_table);
    new SearchRenderer(this.configuration).render(this.total_table);
    new SearchDialog(this.configuration, grid);
    return this.total_table.append(this.utils.new_div("clear-both"));
  };
  Renderer.prototype._render_total_table = function() {
    var grid;
    grid = this.configuration.grid();
    this.total_table = this.utils.new_div("total-table-id");
    return grid.append(this.total_table);
  };
  Renderer.prototype.clear_data = function() {
    var grid;
    grid = this.configuration.grid();
    return jQuery(grid).find(".content-cell").remove();
  };
  Renderer.prototype.populate_grid = function(data) {
    this._render_grid(data.rows);
    return this._adjust_grid_state(data.page, data.total);
  };
  Renderer.prototype._adjust_grid_state = function(page, total) {
    var display_string, ending_number, starting_number;
    jQuery("#current-page").val(page + 1);
    jQuery("#total-pages").html("&nbsp;&nbsp; of " + parseInt(total / this.configuration.query.page_size + 1));
    if (total === 0) {
      return jQuery(this.total_table).find("#displaying-string").html(this.configuration.pagination.no_results_string);
    } else {
      if (total < this.configuration.query.page_size) {
        display_string = "Showing 1 to " + total + " of " + total + " items.";
        return jQuery(this.total_table).find("#displaying-string").html(display_string);
      } else {
        starting_number = this.configuration.query.page_size * page + 1;
        ending_number = starting_number - 1 + this.configuration.query.page_size;
        display_string = "Showing " + starting_number + " to " + ending_number + " of " + total + " items.";
        return jQuery(this.total_table).find("#displaying-string").html(display_string);
      }
    }
  };
  Renderer.prototype._render_grid = function(data) {
    var i, row, _i, _len, _results;
    i = 0;
    _results = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      row = data[_i];
      this._render_row(data[i], i);
      _results.push(i++);
    }
    return _results;
  };
  Renderer.prototype._render_row = function(row, counter) {
    var cell, column, column_containers, columns, data, i, _i, _len, _results;
    column_containers = jQuery(this.configuration.grid()).find(".column-container");
    columns = this.configuration.layout.columns;
    i = 0;
    _results = [];
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      column = columns[_i];
      data = row[column.id];
      cell = this._render_cell(data, column, i, counter);
      jQuery(column_containers[i]).append(cell);
      _results.push(i++);
    }
    return _results;
  };
  Renderer.prototype._render_cell = function(data, column, index, row_counter) {
    var anchor, cell, inner_cell, input, label, striping_class;
    striping_class = "odd-row";
    if (row_counter % 2 === 0) {
      striping_class = "even-row";
    }
    cell = this.utils.new_div("content-cell");
    cell.attr("axis", column.id);
    inner_cell = this.utils.new_div(striping_class);
    cell.append(inner_cell);
    if (column.type === "link") {
      anchor = this.utils.new_tag("a");
      anchor.attr("href", data[0]);
      label = this.utils.new_tag("label");
      label.html(data[1]);
      anchor.append(label);
      inner_cell.append(anchor);
    } else if (column.type === "checkbox") {
      input = this.utils.new_tag("input");
      input.attr("type", "checkbox");
      input.attr("id", data);
      inner_cell.append(input);
    } else {
      label = this.utils.new_tag("label");
      label.html(data);
      inner_cell.append(label);
    }
    return cell;
  };
  Renderer.prototype.render_error = function(data) {};
  return Renderer;
})();
/*
SearchDialog
*/
SearchDialog = (function() {
  function SearchDialog(configuration, grid) {
    var dialog_id;
    $.fx.speeds._default = 400;
    dialog_id = "#" + configuration.grid_id + "-gridulous-search-dialog";
    jQuery(dialog_id).dialog({
      autoOpen: false,
      show: "blind",
      hide: "blind",
      height: 200,
      width: 500,
      modal: true,
      buttons: {
        Go: function() {
          configuration.query.filter_string = jQuery(dialog_id).find("#filter-string").val();
          configuration.query.filter_column = jQuery(dialog_id).find("#filter-column").val();
          configuration.query.page = 1;
          return grid.execute_query();
        },
        Clear: function() {
          jQuery(dialog_id).find("#filter-string").val("");
          configuration.query.filter_string = "";
          configuration.query.page = 1;
          return grid.execute_query();
        },
        Done: function() {
          return jQuery(this).dialog("close");
        }
      }
    });
    jQuery(".ui-dialog-titlebar").attr("style", "display:none;");
    jQuery(".title-bar-search").click(function() {
      jQuery(dialog_id).dialog("open");
      return false;
    });
  }
  return SearchDialog;
})();
/*
DataEngine
*/
DataEngine = (function() {
  function DataEngine(grid_configuration) {
    this.configuration = grid_configuration;
  }
  return DataEngine;
})();