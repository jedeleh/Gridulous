var ColumnHeadersRenderer = Class.$extend({
  __init__: function(configuration){
    this.configuration = configuration;
  },

/*
  .content-container-id
    / column headings are in their own table
    .column-headers
      .column-headers-inner
        %table
          %thead
            %tr
              %th.sorted{:abbr => "iso", :axis => "col0", :align => "center"}
                .sort-ascending{:style => "text-align: center; width: 200px;"}
                  %label name
              %th{:abbr => "iso", :axis => "col1", :align => "center"}
                .sort-ascending{:style => "text-align: center; width: 300px;"}
                  %label description
              %th{:abbr => "iso", :axis => "col2", :align => "center"}
                .sort-ascending{:style => "text-align: center; width: 200px;"}
                  %label owner
              %th{:abbr => "iso", :axis => "col3", :align => "center"}
                .sort-ascending{:style => "text-align: center; width: 100px;"}
                  %label albums

*/
  render: function(total_table) {
    var $content_container_id = $("<div></div>");
    $content_container_id.addClass("content-container-id");
    total_table.append($content_container_id);

    var $column_headers = $("<div></div>");
    $column_headers.addClass("column-headers");
    $content_container_id.append($column_headers);

    var $column_headers_inner = $("<div></div>");
    $column_headers_inner.addClass("column-headers-inner");
    $column_headers.append($column_headers_inner);

    var $table = $("<table></table>");
    $column_headers_inner.append($table);
    var $thead = $("<thead></thead>");
    $table.append($thead);
    var $tr = $("<tr></tr>");
    $thead.append($tr);

    for (var i = 0; i < this.configuration.layout.columns.length; i++) {
      var $column = this._render_column(this.configuration.layout.columns[i], i);
      $tr.append($column);
    }

    return $content_container_id;

  },

/*
  %th{:abbr => "iso", :axis => "col3", :align => "center"}
    .sort-ascending{:style => "text-align: center; width: 100px;"}
      %label albums
*/
  _render_column: function(heading, index) {
    var $column = $("<th></th>");
    $column.addClass(heading.id);
    $column.addClass("col"+index);
    $column.attr("align", "center");
    $column.attr("id", heading.id);
    if (heading.hide == true) {
      $column.addClass("generic-hide");
    }

    var $label_div = $("<div></div>");
    if (this.configuration.query.sort_column == heading.id) {
      if (this.configuration.query.sort_order == "ASC") {
        $label_div.addClass("sort-ascending");
        $label_div.addClass("sorted");
      } else {
        $label_div.addClass("sort-descending");
        $label_div.addClass("sorted");
      }
    }
    //$label_div.attr("style", "text-align: "+heading.alignment+"; width: "+heading.width+"px;");
    $label_div.attr("style", "text-align: center; width: "+heading.width+"px;");
    $column.append($label_div);

    var $label = $("<label></label>");
    $label.text(heading.display_name);
    $label_div.append($label);

    return $column;
  }


});
