var SearchDialog = Class.$extend({
  __init__: function(configuration, grid) {
    $.fx.speeds._default = 400;
    //Console().log("preparing dialog");
    var dialog_id = "#"+configuration.grid_id+"-gridulous-search-dialog";
    $( dialog_id  ).dialog({
      autoOpen: false,
      show: "blind",
      hide: "blind",
      height: 200,
      width: 500,
      modal: true,
      buttons: {
        Go: function() {
          configuration.query.filter_string = $( dialog_id ).find("#filter-string").val();
          configuration.query.filter_column = $( dialog_id ).find("#filter-column").val();
          configuration.query.page = 1;
          grid.execute_query();
        },
        Clear: function() {
          $( dialog_id ).find("#filter-string").val("");
          configuration.query.filter_string = "";
          configuration.query.page = 1;
          grid.execute_query();
        },
        Done: function() {
          $( this ).dialog( "close" );
        }
      }
    });

    $(".ui-dialog-titlebar").attr("style", "display:none;");

    $(".title-bar-search").click(function() {
      $( dialog_id ).dialog( "open" );
      return false;
    });
    //Console().log("done preparing dialog");
  }
});

