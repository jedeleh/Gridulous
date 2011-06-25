var ColumnChooserRenderer = Class.$extend({
  __init__: function(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  },

  render: function() {
    var $grid = this.configuration.grid();

    // jQuery dialog id
    var $chooser_dialog = $("<div id='column-chooser-dialog'></div>");
    $grid.append($chooser_dialog);

    var $chooser_div = this.utils.new_div("column-chooser-div");
    $chooser_div.attr("style","margin-bottom: -"+this.configuration.size.height+"px; height: auto; width: auto; top: 75px; left: 503px;");
    $chooser_dialog.append($chooser_div);

    var $table = this.utils.new_tag("table");
    $chooser_div.append($table);

    var $tbody = this.utils.new_tag("tbody");
    $table.append($tbody);

    var columns = this.configuration.layout.columns;
    for (var i = 0; i < columns.length; i++) {
      var $tr = this._generate_chooser_row(columns[i], i);
      $tbody.append($tr);
    }
  },

  _generate_chooser_row: function(column, index) {
    var $tr = this.utils.new_tag("tr");
    var axis_string = "col" + index;

    var $td_top = this.utils.new_tag("td","show-hide-input");
    $tr.append($td_top);

    var $check_box = this.utils.new_tag("input", "show-hide-checkbox");
    $check_box.attr("id", column.id + "-toggle");
    if (column.optional == true) {
      $check_box.attr("onclick", "ontoggle_column('" + axis_string + "','"+this.configuration.id+"');");
    }
    $check_box.attr("type", "checkbox");
    $check_box.val(index);
    if (column.hide == false) {
      $check_box.attr("checked", "checked");
    }
    if (column.optional == false) {
      $check_box.attr("checked", "checked");
      $check_box.attr("disabled", "true");
    }
    $td_top.append($check_box);

    var $td_label = this.utils.new_tag("td", "show-hide-label");
    $tr.append($td_label);

    var $label = $("<label>"+column.display_name+"</label>");
    $td_label.append($label);

    return $tr;
  }
});
