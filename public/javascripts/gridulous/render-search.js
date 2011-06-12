var SearchRenderer = Class.$extend({
  __init__: function(configuration){
    this.configuration = configuration;
  },

  render: function(total_table, go_button_function, clear_button_function) {
    var $search_div = $("<div></div>");
    $search_div.addClass("search-div");
    total_table.append($search_div);

    var $search_div_inner = $("<div></div>");
    $search_div_inner.addClass("search-div-inner");
    $search_div.append($search_div_inner);

    var $label = $("<label></label>");
    $label.text("Find");
    $search_div_inner.append($label);

    var $input = $("<input></input>");
    $input.addClass("query-input-field");
    $input.attr("type", "text");
    $input.attr("size", "30");
    $input.attr("name", "filter-string");
    $input.attr("id", "filter-string");
    $search_div_inner.append($input);

    var $select = $("<select></select>");
    $select.attr("id", "filter-column");
    $search_div_inner.append($select);
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

    var $go_button = $("<button></button>");
    $go_button.text("Go");
    $go_button.attr("id","go-button");
    $search_div_inner.append($go_button);

    var $clear_button = $("<button></button>");
    $clear_button.text("Clear");
    $clear_button.attr("id","clear-button");
    $search_div_inner.append($clear_button);


  }
});
