$(function() {
  $.fx.speeds._default = 400;
  $(function() {
    $( "#column-chooser-dialog" ).dialog({
      autoOpen: false,
      show: "blind",
      hide: "blind",
      height: 150,
      width: 200,
      modal: true,
      buttons: {
				Ok: function() {
					$( this ).dialog( "close" );
				}
			}
    });

    $(".ui-dialog-titlebar").attr("style", "display:none;");

    $(".title-bar-column-configure").click(function() {
      var tr_count = $( "#column-chooser-dialog tr" ).length;
      var dialog_height = tr_count * 50;
      $( "#column-chooser-dialog" ).dialog({height: dialog_height});
			$( "#column-chooser-dialog" ).dialog( "open" );
			return false;
		});

  });
});

function ontoggle_column(axis_string, grid_id) {
  var selector_string = "#"+grid_id+" ."+ axis_string;
  if ($(selector_string).hasClass("generic-hide")) {
    $(selector_string).removeClass("generic-hide");
  } else {
    $(selector_string).addClass("generic-hide");
  }

}
