var ColumnHeadersRenderer = BaseRender.$extend({
  __init__: function(configuration){
    this.configuration = configuration;
  },

  render: function(total_table) {
    var content_container = this.new_div("content-container");
    var style = this.build_style(["width","height"],[this.configuration.size.width + 10, this.configuration.size.height + 10]);
    content_container.attr("style", style);

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
    var column_div = this.new_div("column-container float-left column-border");
    column_div.attr("id", column.id + "-column");
    var style = this.build_style(["width", "height"],[column.width + "px", this.configuration.size.height + "px"]);
    column_div.attr("style", style);
    return column_div;
  },

  _render_column: function(column, index) {
    var heading = this.new_div("cell-border clear-both header-cell");
    heading.attr("id", column.id);
    var style = this.build_style(["text-align"],["center"]);
    heading.attr("style", style);
    var span = this.new_tag("span");
    heading.append(span);
    span.text(column.display_name);
    return heading;
  }
});
