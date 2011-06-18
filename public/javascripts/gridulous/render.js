var Renderer = BaseRender.$extend({
  __init__: function(grid_configuration) {
    this.configuration = grid_configuration;
    this.total_table = null;
    this.content_container = null;
    this.data_div = null;
  },

  // initial rendering of the grid
  //
  render: function() {
    ColumnChooserRenderer(this.configuration).render();
    TitleBarRenderer(this.configuration).render();

    this._render_total_table();
    ButtonBarRenderer(this.configuration).render(this.total_table);
    this.content_container = ColumnHeadersRenderer(this.configuration).render(this.total_table);
    this.total_table.append(this.new_div("clear-both"));
    this._render_drag_section();
    PaginationRenderer(this.configuration).render(this.total_table);
    SearchRenderer(this.configuration).render(this.total_table);
    this.total_table.append(this.new_div("clear-both"));
  },

  _render_drag_section: function() {
  },

  _render_total_table: function() {
    var grid = this.configuration.grid();
    this.total_table = this.new_div("total-table-id");
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
    var cell = this.new_div("content-cell");
    cell.attr("axis", column.id);
    var inner_cell = this.new_div(striping_class);
    cell.append(inner_cell);

    var label = this.new_tag("label");
    label.html(data);
    inner_cell.append(label);
    return cell;
  },

  render_error: function(data) {
  }
});

