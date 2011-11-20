$(document).ready ->
  people_grid = new GridFramework("people-grid")

  configuration =
    hooks:
      on_submit: ->
        new Console().log("on submit")
      on_success:->
        new Console().log("on success")
    metadata:
      title: "People"
      method: "Post"
      action_uri: "/people/grid"
    layout:
      columns: [
        { display_name: "Last name", id: "last_name", alignment: "center", sortable: true, hide: false, width: 200, optional: false, type: "link" }
        { display_name: "First name", id: "first_name", sortable: true, hide: false, width: 200, alignment: "center" }
        { display_name: "MI", id: "middle_initial", sortable: true, hide: false, width: 20, alignment: "left" }
        { display_name: "Email", id: "email", sortable: true, hide: false, width: 150, alignment: "center" }
        { display_name: "DOB", id: "date_of_birth", sortable: true, hide: false, width: 100, alignment: "center" }
        { display_name: "Role", id: "role", sortable: true, hide: true, width: 100, alignment: "center" }
      ]
      use_row_striping: true
    size:
        height: 200,
        width: 1000
    query:
      filter_string: ""
      filter_column: "last_name"
      sort_column: "last_name"
      sort_order: "ASC"
      page: 1
      page_size: 10
      custom_filters: []
    buttons: [
      {
        name: "New"
        css_class: "new-button-class"
        action: ->
          document.location = "/people/new"
        icon: null
      }
    ]
    filters: [
      { display_name: "Last name", id: "last_name" }
      { display_name: "First name", id: "first_name" }
      { display_name: "Email", id: "email" }
      { display_name: "Role", id: "role" }
      {
        name: "Edit"
        css_class: "edit-button-class"
        action: ->
          new Console().log("edit action")
        icon: null
      }
      { name: "separator", css_class: null, action: null, icon: null }
      {
        name: "Delete"
        css_class: "delete-button-class"
        action: ->
          new Console().log("delete action")
        icon: null
      }
    ]
    pagination:
      page_size_options: [10,25,50,100,200]
      items_name: "items"
      processing_string: "Processing request..."
      error_string: "Processing error..."
      no_results_string: "No items found."

  people_grid.configuration.unpickle(configuration)


  people_grid.render_grid()
  people_grid.execute_query()
