var ColumnHeadersRenderer = Class.$extend({
  __init__: function(configuration){
    this.configuration = configuration;
    this.utils = new RenderUtils();
  },

  render: function(total_table) {
    var content_container = this.utils.new_div("content-container");
    this.utils.add_style(["width","height"],[this.configuration.size.width + 10, this.configuration.size.height + 10],content_container);

    var columns = this.configuration.layout.columns;
    var total_width = 0;
    for (var i = 0; i < columns.length; i++) {
      var column = columns[i];
      // entire column div
      var column_container = this._render_column_container(column, i);
      content_container.append(column_container);
      var heading_cell = this._render_column(column, i);
      column_container.append(heading_cell);
      if (column.hide) {
        column_container.addClass("generic-hide");
      }
    }

    total_table.append(content_container);
    return content_container;
  },

  _render_column_container: function(column, index) {
    var column_div = this.utils.new_div("column-container float-left column-border");
    column_div.attr("id", column.id + "-column");
    this.utils.add_style(["width", "height"],[column.width + "px", this.configuration.size.height + "px"], column_div);
    return column_div;
  },

  _render_column: function(column, index) {
    var heading = this.utils.new_div("cell-border clear-both header-cell");
    heading.attr("id", column.id);
    this.utils.add_style(["text-align"],["center"], heading);
    var span = this.utils.new_tag("span");
    heading.append(span);
    span.text(column.display_name);
    return heading;
  }
});
