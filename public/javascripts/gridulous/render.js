var Renderer = Class.$extend({
  __init__: function(grid_configuration) {
    this.configuration = grid_configuration;
    this.total_table = null;
    this.content_container = null;
    this.data_div = null;
    this.utils = new RenderUtils(); // avoid too much unnecessary inheritance
  },

  // initial rendering of the grid
  //
  render: function(grid) {
    ColumnChooserRenderer(this.configuration).render();
    TitleBarRenderer(this.configuration).render();

    this._render_total_table();
    ButtonBarRenderer(this.configuration).render(this.total_table);
    this.content_container = ColumnHeadersRenderer(this.configuration).render(this.total_table);
    this.total_table.append(this.utils.new_div("clear-both"));
    PaginationRenderer(this.configuration).render(this.total_table);
    SearchRenderer(this.configuration).render(this.total_table);
    SearchDialog(this.configuration, grid);
    this.total_table.append(this.utils.new_div("clear-both"));
  },

  _render_total_table: function() {
    var grid = this.configuration.grid();
    this.total_table = this.utils.new_div("total-table-id");
    grid.append(this.total_table);
  },

  // populate the grid with the current data
  //
  clear_data: function() {
    var grid = this.configuration.grid();
    $(grid).find(".content-cell").remove();
  },

  populate_grid: function(data) {
    this._render_grid(data.rows);
    this._adjust_grid_state(data.page, data.total);
  },

  _adjust_grid_state: function(page, total) {
    $("#current-page").val(page + 1);
    $("#total-pages").html("&nbsp;&nbsp; of " + parseInt(total / this.configuration.query.page_size + 1));
    if (total == 0) {
      $(this.total_table).find("#displaying-string").html(this.configuration.pagination.no_results_string);
    } else {
      if (total < this.configuration.query.page_size) {
        var display_string = "Showing 1 to " + total + " of " + total + " items.";
        $(this.total_table).find("#displaying-string").html(display_string);
      } else {
        var starting_number = this.configuration.query.page_size * page + 1;
        var ending_number = starting_number - 1 + this.configuration.query.page_size;
        var display_string = "Showing " + starting_number + " to " + ending_number + " of " + total + " items.";
        $(this.total_table).find("#displaying-string").html(display_string);
      }
    }
  },

  _render_grid: function(data) {
    for (var i = 0; i < data.length; i++) {
      this._render_row(data[i], i);
    }
  },

  _render_row: function(row, counter) {
    var column_containers = $(this.configuration.grid()).find(".column-container");
    var columns = this.configuration.layout.columns;
    for (var i = 0; i < columns.length; i++) {
      var data = row[columns[i].id];
      var cell = this._render_cell(data, columns[i], i, counter);
      $(column_containers[i]).append(cell);
    }
  },

  _render_cell: function(data, column, index, row_counter) {
    var striping_class = "odd-row";
    if (row_counter % 2 == 0) {
      striping_class = "even-row";
    }
    var cell = this.utils.new_div("content-cell");
    cell.attr("axis", column.id);
    var inner_cell = this.utils.new_div(striping_class);
    cell.append(inner_cell);

    if (column.type == "link") {
      var anchor = this.utils.new_tag("a");
      anchor.attr("href", data[0]);
      var label = this.utils.new_tag("label");
      label.html(data[1]);
      anchor.append(label);
      inner_cell.append(anchor);
    } else if (column.type == "checkbox") {
      var input = this.utils.new_tag("input");
      input.attr("type", "checkbox");
      input.attr("id", data);
      inner_cell.append(input);
    } else {
      var label = this.utils.new_tag("label");
      label.html(data);
      inner_cell.append(label);
    }

    return cell;
  },

  render_error: function(data) {
  }
});

