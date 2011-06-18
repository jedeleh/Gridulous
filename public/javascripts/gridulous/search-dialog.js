$(function() {
  $.fx.speeds._default = 400;
  $(function() {
    $( "#search-dialog" ).dialog({
      autoOpen: false,
      show: "blind",
      hide: "blind",
      height: 200,
      width: 500,
      modal: true,
      buttons: {
				Go: function() {
          on_go();
				},
				Clear: function() {
          on_clear();
				},
        Done: function() {
					$( this ).dialog( "close" );
        }
			}
    });

    $(".ui-dialog-titlebar").attr("style", "display:none;");

    $(".title-bar-search").click(function() {
      Console().log("opening");
			$( "#search-dialog" ).dialog( "open" );
			return false;
		});

  });
});

function on_go() {
  Console().log("execute search...");
  extract_filter_information();
  execute_filter_search();
}

function on_clear() {
}

function extract_filter_information() {
  return null;
}

function execute_filter_search() {
  return null;
}
