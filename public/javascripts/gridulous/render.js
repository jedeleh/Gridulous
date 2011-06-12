var Renderer = Class.$extend({
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
    this.total_table = this._render_total_table();
    ButtonBarRenderer(this.configuration).render(this.total_table);
    this.content_container = ColumnHeadersRenderer(this.configuration).render(this.total_table);
    this._render_data_section();
    this._render_drag_section();
    SearchRenderer(this.configuration).render(this.total_table);
    PaginationRenderer(this.configuration).render(this.total_table);
    var $clear_div = $("<div></div>");
    $clear_div.addClass("clear-both");
    this.total_table.append($clear_div);

  },

  _render_drag_section: function() {
    var $drag_section = $("<div></div>");
    $drag_section.addClass("column-drag");
    $drag_section.addClass("generic-show");
    $drag_section.attr("style", "top:60px;");
    this.total_table.append($drag_section);

    var columns = this.configuration.layout.columns;
    var position = 2;
    var drag_height = this.configuration.size.height + 20;
    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];
      var $separator_div =$("<div></div>");
      var selector = ".column-headers .col"+(i);
      var new_left = $(selector).position().left + $(selector).width();
      if (column.hide == false) {
        // get the width of the current header
        var style_string = "left:"+new_left+"px;height:"+drag_height+"px;width:5px;position:absolute;";
        $separator_div.attr("style", style_string);
        $separator_div.draggable({ axis: "x" });
      } else {
        //var style_string = "left:0px;height:"+drag_height+"px;width:5px;";
        $separator_div.attr("style", style_string);
        $separator_div.addClass("generic-hide");
      }
      $separator_div.addClass(column.id + "-separator");
      $separator_div.addClass("grid-draggable");
      $separator_div.attr("id", column.id+"-sep-"+i);
      $drag_section.append($separator_div);
    }
  },

  _render_data_section: function() {
    // everything attaches to this.content_container
    var $clear_div = $("<div></div>");
    $clear_div.addClass("clear-both");
    this.content_container.append($clear_div);

    var $data_div = $("<div></div>");
    $data_div.addClass("content-div");
    $data_div.attr("style", "height: "+this.configuration.size.height+"px;");
    this.content_container.append($data_div);

    this.data_div = $data_div;
  },

  _render_total_table: function() {
    var $grid = this.configuration.grid();

    var $total_table = $("<div></div>");
    $total_table.addClass("total-table");
    $grid.append($total_table);

    return $total_table;
  },

  // populate the grid with the current data
  //
  clear_data: function() {
    $(this.data_div).empty();
  },

  populate_grid: function(data) {
    this._render_grid(data.rows);
    this._adjust_grid_state(data.page, data.total);
  },

  _adjust_grid_state: function(page, total) {
    $("#current-page").val(page + 1);
    $("#total-pages").text(parseInt(total / this.configuration.query.page_size) + 1);
    Console().log("in _adjust_grid_state", false);
  },

  _render_grid: function(data) {
    var $table = $("<table></table>");
    this.data_div.append($table);
    var $tbody = $("<tbody></tbody>");
    $table.append($tbody);

    var counter = 0;
    for (var i = 0; i < data.length; i++) {
      this._render_row(data[i], $tbody, i);
    }
  },

  // %tr{:id => id_string, :class => row_type}
  //  %td.sorted-column{:align => "center", :abbr => "name", :style => "width: #{widths[inner_counter]}"}
  //    %div{:style => "text-align: left;" }
  //      %span.data-span= cell
  //
  _render_row: function(row, tbody, counter) {
    var columns = this.configuration.layout.columns;
    var row_type = (counter % 2 == 0) ? "even-row" : "odd-row";
    var $tr = $("<tr></tr>");
    $tr.attr("id", "row-"+counter);
    $tr.addClass(row_type);
    tbody.append($tr);

    for (var i = 0; i < columns.length; i++) {
      column = columns[i];
      var $td = $("<td></td>");
      $td.attr("align", column.alignment);
      $td.attr("abbr", column.id);
      $td.attr("style", "width: "+column.width+"px;");
      $td.addClass("col"+i); // this axis string is used to hide/show the entire column of data at once.
      $td.addClass("col"+i+"-cell"); // this axis string is used to resize just the cells in a column
      if (column.hide == true) {
        $td.addClass("generic-hide");
      }
      if (this.configuration.query.sort_column == column.id) {
        $td.addClass("sorted-column");
      }
      $tr.append($td);

      var $div =$("<div></div>");
      $div.attr("style", "text-align: "+column.alignment+";");
      $td.append($div);

      var $span =$("<span></span>");
      $span.addClass("data-span");
      $span.html(row[column.id]);
      $div.append($span);
    }
  },

  render_error: function(data) {
  }
});

