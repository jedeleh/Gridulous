var Bindings = Class.$extend({
  __init__: function() {
  },

  bind_events: function(configuration, grid) {
    // page size selection
    var grid_container = configuration.grid();
    $(grid_container).find("#page-size").change(function() {
      configuration.query.page = 1;
      configuration.query.page_size = $(this).val();
      grid.execute_query();
    });

    // next page button 'next-button'
    $(grid_container).find("#next-button").click(function() {
      var page = configuration.query.page;
      var end_page = Math.ceil(grid.current_total / configuration.query.page_size);
      if (page < end_page) {
        configuration.query.page = page + 1;
        grid.execute_query();
      }
    });

    // last page button 'last-button'
    $(grid_container).find("#last-button").click(function() {
      var page = configuration.query.page;
      var pages = grid.current_total / configuration.query.page_size;
      var end_page = Math.ceil(grid.current_total / configuration.query.page_size);
      if (page < end_page) {
        configuration.query.page = end_page;
        grid.execute_query();
      }
    });

    // first page button 'first-button'
    $(grid_container).find("#first-button").click(function() {
      var page = configuration.query.page;
      if (page > 1) {
        configuration.query.page = 1;
        grid.execute_query();
      }
    });

    // previous page button 'previous-button'
    $(grid_container).find("#previous-button").click(function() {
      var page = configuration.query.page;
      if (page > 1) {
        configuration.query.page = page - 1;
        grid.execute_query();
      }
    });

    // page text field
    $(grid_container).find("#current-page").keypress(function(event_object) {
      if (event_object.which == 13) {
        var page = parseInt($(grid_container).find("#current-page").val());
        if (page > 0 && page <= grid.current_total) {
          configuration.query.page = page;
          grid.execute_query();
        }
        else {
          $(grid_container).find("#current-page").val(configuration.query.page);
        }
      }
    });

    // refresh button (eventually)

    // find box
    $(grid_container).find("#filter-string").keypress(function() {
      if (event_object.which == 13) {
        configuration.query.filter_string = $(grid_container).find("#filter-string").val();
        configuration.query.filter_column = $(grid_container).find("#filter-column").val();
        configuration.query.page = 1;
        grid.execute_query();
      }
    });

    // clear button
    $(grid_container).find("#t").click(function() {
      configuration.query.filter_string = "";
      configuration.query.page = 1;
      grid.execute_query();
    });

    // column sorts
    var column_headings = $(grid_container).find(".header-cell");
    for (var i = 0; i < column_headings.length; i++) {
      var column = column_headings[i];
      var sort = $(column).find(".sort-area span");
      this._bind_sort(sort, column, configuration, grid, grid_container);
    }

    // checkboxes on custom columns dialog IFF it's in use
    var toggles = $(grid_container).find("#column-chooser-dialog input[type=checkbox]");
    for (var j = 0; j < toggles.length; j++) {
      var toggle = toggles[j];
      this._bind_column_toggle(toggle, configuration, grid, grid_container);
    }

    // bind resizable to column containers
    $(grid_container).find(".content-container").sortable({
      axis: "x",
      stop: function(event, ui) {
        columns = configuration.layout.columns;
        var new_column_list = [];
        $(".header-cell").each(function(index, element) {
            var id = $(element).attr("id");
            $.each(columns, function(index, column) {
              if (column.id == id) {
                new_column_list.push(column);
              }
            });
          });
        configuration.layout.columns = new_column_list;
      }
    });
    $(grid_container).find(".column-container").resizable();
  },

  _bind_column_toggle: function(toggle, configuration, grid, grid_container) {
    $(toggle).click(function() {
      var column_id = toggle.id;
      // have to fix the id to remove "-toggle"
      column_id = column_id.split("-")[0];
      var columns = configuration.layout.columns;
      for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        if (column.id == column_id) {
          var column_container = $(grid_container).find("#"+column.id+"-column");
          //Console().log(column_container);
          if (column.hide == true) {
            column.hide = false;
            $(column_container).removeClass("generic-hide");
          } else {
            column.hide = true;
            $(column_container).addClass("generic-hide");
          }
          break;
        }
      }
    });
  },

  _bind_sort: function(sort, column, configuration, grid, grid_container) {
    $(sort).click(function() {
      // what is the current sort & order
      var current_sort = configuration.query.sort_column;
      var current_order = configuration.query.sort_order;

      // if the current sort is the same as what the user clicked...
      if (current_sort == column.id) {
        if (current_order == "ASC") {
          configuration.query.sort_order = "DESC";
          $(sort).find("div").removeClass("ascending");
          $(sort).removeClass("ui-icon-carat-1-n");
          $(sort).removeClass("ui-icon-carat-2-n-s");
          $(sort).find("div").addClass("descending");
          $(sort).addClass("ui-icon-carat-1-s");
        }
        else {
          configuration.query.sort_order = "ASC";
          $(sort).removeClass("ui-icon-carat-1-s");
          $(sort).removeClass("ui-icon-carat-2-n-s");
          $(sort).addClass("ui-icon-carat-1-n");
          $(sort).find("div").removeClass("descending");
          $(sort).find("div").addClass("ascending");
        }
      }
      else {
        // they aren't the same, turn off the old sort column styles
        $(grid_container).find(".sorted").removeClass("ui-icon-carat-1-n");
        $(grid_container).find(".sorted").removeClass("ui-icon-carat-1-s");
        $(grid_container).find(".sorted").addClass("ui-icon-carat-2-n-s");
        $(grid_container).find(".sorted").removeClass("ascending");
        $(grid_container).find(".sorted").removeClass("descending");
        $(grid_container).find(".sorted").removeClass("sorted");

        // then turn on the new ones
        $(sort).addClass("sorted");
        $(sort).addClass("ascending");
        $(sort).addClass("ui-icon-carat-1-n");
        $(sort).removeClass("ui-icon-carat-1-s");
        $(sort).removeClass("ui-icon-carat-2-n-s");
        configuration.query.sort_order = "ASC";

      }
      configuration.query.sort_column = column.id
      grid.execute_query();
    });
  }
});

