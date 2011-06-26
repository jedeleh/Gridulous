$(document).ready(function() {
  // basic preparation
  people_grid = new GridFramework("people-grid");

  people_grid.configuration.metadata.title = "People";
  people_grid.configuration.metadata.method = "POST";
  people_grid.configuration.metadata.action_uri = "/people/grid";
  people_grid.configuration.size.width = 1000;

  // test hooks
  hooks = people_grid.configuration.hooks;
  hooks.on_submit = function() {
    Console().log("on submit");
  }
  hooks.on_success = function(data) {
    Console().log("on success");
  }

  // setup the columns.
  var layout = people_grid.configuration.layout;
  var layout_columns = [];
  layout_columns.push({
    display_name: "Last name", id: "last_name", alignment: "center", sortable: true, hide: false, width: 200, optional: false, type: "link"
  });
  layout_columns.push({
    display_name: "First name", id: "first_name", sortable: true, hide: false, width: 200, alignment: "center"
  });
  layout_columns.push({
    display_name: "MI", id: "middle_initial", sortable: true, hide: false, width: 20, alignment: "left"
  });
  layout_columns.push({
    display_name: "Email", id: "email", sortable: true, hide: false, width: 150, alignment: "center"
  });
  layout_columns.push({
    display_name: "DOB", id: "date_of_birth", sortable: true, hide: false, width: 100, alignment: "center"
  });
  layout_columns.push({
    display_name: "Role", id: "role", sortable: true, hide: true, width: 100, alignment: "center"
  });
  layout.set_columns(layout_columns);

  // setup the default query
  var query = people_grid.configuration.query;
  query.sort_column = "last_name";
  query.sort_order = "ASC";
  query.filter_column = "last_name";
  query.filter_string = "";
  query.page = 1;
  query.page_size = 10;

  // filters dropdown
  var filters = people_grid.configuration.filters;
  filters.filter_column_names.push({
    display_name: "Last name", id: "last_name"
  });
  filters.filter_column_names.push({
    display_name: "First name", id: "first_name"
  });
  filters.filter_column_names.push({
    display_name: "Email", id: "email"
  });
  filters.filter_column_names.push({
    display_name: "Role", id: "role"
  });

  // buttons
  var buttons = people_grid.configuration.buttons;
  buttons_list = [];
  buttons_list.push({
    name: "New", css_class: "new-button-class", action: new_action, icon: null
  });
  buttons_list.push({
    name: "Edit", css_class: "edit-button-class", action: edit_action, icon: null
  });
  buttons_list.push({
    name: "separator", css_class: null, action: null, icon: null
  });
  buttons_list.push({
    name: "Delete", css_class: "delete-button-class", action: delete_action, icon: null
  });
  buttons.set_buttons(buttons_list);

  // button actions
  function new_action() { document.location = "/people/new";}
  function edit_action() { Console().log("edit button was pressed");}
  function delete_action() {Console().log("delete button was pressed"); }

  // start things up
  people_grid.render_grid();
  people_grid.execute_query();
});
