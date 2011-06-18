$(document).ready(function() {
  grid_test = new GridFramework("people-grid");
  grid_test.configuration.metadata.title = "People";
  grid_test.configuration.metadata.method = "POST";
  grid_test.configuration.metadata.action_uri = "/people/grid";
  grid_test.configuration.size.width = 1000;
  var layout = grid_test.configuration.layout;
  // setup the columns.
  // last name column
  column = layout.create_column();
  column.display_name = "Last name";
  column.id = "last_name";
  column.sortable = true;
  column.hide = false;
  column.width = 200;
  column.alignment = "center"
  column.optional = false;
  column.type = "link"
  layout.columns.push(column);
  // first name column
  column = layout.create_column();
  column.display_name = "First name";
  column.id = "first_name";
  column.sortable = true;
  column.hide = false;
  column.width = 200;
  column.alignment = "center"
  layout.columns.push(column);
  // middle_initial column
  column = layout.create_column();
  column.display_name = "MI";
  column.id = "middle_initial";
  column.sortable = true;
  column.hide = false;
  column.width = 20;
  column.alignment = "left"
  layout.columns.push(column);
  // email column
  column = layout.create_column();
  column.display_name = "Email";
  column.id = "email";
  column.sortable = true;
  column.hide = false;
  column.width = 150;
  column.alignment = "center"
  layout.columns.push(column);
  // date of birth column
  column = layout.create_column();
  column.display_name = "DOB";
  column.id = "date_of_birth";
  column.sortable = true;
  column.hide = false;
  column.width = 100;
  column.alignment = "center"
  layout.columns.push(column);
  // role column
  column = layout.create_column();
  column.display_name = "Role";
  column.id = "role";
  column.sortable = true;
  column.hide = true;
  column.width = 100;
  column.alignment = "center"
  layout.columns.push(column);
  // default query
  var query = grid_test.configuration.query;
  // sort
  query.sort_column = "last_name";
  query.sort_order = "ASC";
  query.filter_column = "last_name";
  query.filter_string = "";
  query.page = 1;
  query.page_size = 10;
  var filters = grid_test.configuration.filters;
  filters.filter_column_names.push({display_name: "Last name", id: "last_name"});
  filters.filter_column_names.push({display_name: "First name", id: "first_name"});
  filters.filter_column_names.push({display_name: "Email", id: "email"});
  filters.filter_column_names.push({display_name: "Role", id: "role"});
  var buttons = grid_test.configuration.buttons;
  buttons.buttons.push({ name: "New", css_class: "new-button-class", action: new_action});
  buttons.buttons.push({ name: "Edit", css_class: "edit-button-class", action: edit_action});
  buttons.buttons.push({ name: "separator", css_class: null, action: null});
  buttons.buttons.push({ name: "Delete", css_class: "delete-button-class", action: delete_action});

  function new_action() { document.location = "/people/new";}
  function edit_action() { Console().log("edit button was pressed");}
  function delete_action() {Console().log("delete button was pressed"); }

  grid_test.render_grid();
  grid_test.execute_query();
});
