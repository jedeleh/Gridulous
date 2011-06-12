var ColumnChooserRenderer = Class.$extend({
  __init__: function(configuration) {
    this.configuration = configuration;
  },

  render: function() {
    if (this.configuration.layout.use_column_visibility_widget == false) {
      return;
    }

    /*  here's what we render:
      .column-chooser-div{:style => "margin-bottom: -200px; height: auto; width: auto; top: 75px; left: 503px; display: none;" }
        %table
          %tbody
    */
    var $grid = this.configuration.grid();

    // jQuery dialog id
    var $chooser_dialog = $("<div id='column-chooser-dialog'></div>");
    $grid.append($chooser_dialog);

    var $chooser_div = $("<div></div>");
    $chooser_div.addClass("column-chooser-div");
    $chooser_div.attr("style","margin-bottom: -"+this.configuration.size.height+"px; height: auto; width: auto; top: 75px; left: 503px;");
    $chooser_dialog.append($chooser_div);

    var $table = $("<table></table>");
    $chooser_div.append($table);

    var $tbody = $("<tbody></tbody>");
    $table.append($tbody);

    var columns = this.configuration.layout.columns;
    for (var i = 0; i < columns.length; i++) {
      var $tr = this._generate_chooser_row(columns[i], i);
      $tbody.append($tr);
    }
  },

  _generate_chooser_row: function(column, index) {
    /* here's what we render:
        %tr
          %td.show-hide-input
            %input.show-hide-checkbox{:type => "checkbox", :checked => "checked", :value => "0"}
          %td.show-hide-label
            %label Owner

      note: if the column is optional it's checked and disabled
    */
    var $tr = $("<tr></tr>");
    var axis_string = "col" + index;

    var $td_top = $("<td></td>");
    $td_top.addClass("show-hide-input");
    $tr.append($td_top);

    var $check_box = $("<input></input>");
    $check_box.attr("id", column.id + "-toggle");
    if (column.optional == true) {
      $check_box.attr("onclick", "ontoggle_column('" + axis_string + "','"+this.configuration.id+"');");
    }
    $check_box.addClass("show-hide-checkbox");
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

    var $td_label = $("<td></td>");
    $td_label.addClass("show-hide-label");
    $tr.append($td_label);

    var $label = $("<label>"+column.display_name+"</label>");
    $td_label.append($label);

    return $tr;
  }
});
