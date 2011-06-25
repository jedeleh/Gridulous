var SearchRenderer = Class.$extend({
  __init__: function(configuration){
    this.configuration = configuration;
    this.utils = new RenderUtils();
  },


  render: function(total_table) {
    // jQuery dialog id
    var $search_dialog = $("<div id='"+this.configuration.grid_id+"-gridulous-search-dialog'></div>");
    total_table.append($search_dialog);

    var $search_div = this.utils.new_div("search-div");
    var position = $(total_table).find(".title-bar-search").position;
    $search_div.attr("style","margin-bottom: -"+this.configuration.size.height+"px; height: auto; width: auto; top: "+position.bottom+"px; left: 503px;");
    $search_dialog.append($search_div);

    var $search_div_inner = $("<div></div>");
    $search_div_inner.addClass("search-div-inner");
    $search_div.append($search_div_inner);

    var $fieldset = this.utils.new_tag("fieldset");
    $search_div_inner.append($fieldset);
    var $legend = this.utils.new_tag("legend");
    $fieldset.append($legend);
    $legend.text("Find");

    var $input = this.utils.new_tag("input","filter-string-input");
    $input.attr("type", "text");
    $input.attr("size", "30");
    $input.attr("name", "filter-string");
    $input.attr("id", "filter-string");
    $fieldset.append($input);

    var $select = this.utils.new_tag("select");
    $select.attr("id", "filter-column");
    $fieldset.append($select);
    for (var i = 0; i < this.configuration.layout.columns.length; i++) {
      column = this.configuration.layout.columns[i];
      var $option = $("<option></option>");
      $option.text(column.display_name);
      $option.val(column.id);
      if (column.id == this.configuration.query.filter_column) {
        $option.attr("selected", "selected");
      }
      $select.append($option);
    }
  }

});
