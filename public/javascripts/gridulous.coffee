###
Gridulous -- coffeescript web application framework agnostic table widget.
  Requires: jQuery & HAML
    For building from source, you'll also need SASS and CoffeeScript
  Author: JD Kaplan
  Github URL: https://github.com/jedeleh/Gridulous
  License: MIT

List of Classes
================
class Bindings
class ButtonBarRenderer
class ColumnChooserRenderer
class ColumnHeadersRenderer
class Console
class DataEngine
class GridButton
class GridButtons
class GridColumn
class GridConfiguration
class GridFilters
class GridFramework
class GridHooks
class GridLayout
class GridPagination
class GridQuery
class GridSize
class PaginationRenderer
class Renderer
class RenderUtils
class SearchDialog
class SearchRenderer
class TitleBarRenderer
###

###
RenderUtils
###
class RenderUtils
  new_div: ( css_class ) ->
    div = jQuery("<div></div>")
    div.addClass(css_class)
    div

  blank_div: ->
    div = jQuery("<div></div>")
    div

  add_style: ( props, values, tag ) ->
    buffer = ""
    i = 0
    for prop in props
      buffer += prop + ": " + values[i] + ";";
      i++
    jQuery(tag).attr("style", buffer)

  new_tag: ( tag_name, css_class) ->
    tag_string = "<"+tag_name+"></"+tag_name+">"
    tag = jQuery(tag_string)
    if css_class
      tag.addClass(css_class)
    tag

###
Bindings
###
class Bindings
  constructor: ->

  bind_events: (configuration, grid) ->
    grid_container = configuration.grid()
    ### page size selection ###
    jQuery(grid_container).find("#page-size").change ->
      page = configuration.query.page
      configuration.query.page = 1
      configuration.query.page_size = $(@).val()
      grid.execute_query

    ### next page button 'next-button' ###
    jQuery(grid_container).find("#next-button").click ->
      page = configuration.query.page
      end_page = Math.ceil(grid.current_total / configuration.query.page_size)
      if page < end_page
        configuration.query.page = page + 1
        grid.execute_query()

    ### last page button 'last-button' ###
    jQuery(grid_container).find("#last-button").click ->
      page = configuration.query.page
      pages = grid.current_total / configuration.query.page_size
      end_page = Math.ceil grid.current_total / configuration.query.page_size
      if page < end_page
        configuration.query.page = end_page
        grid.execute_query()

    ### first page button 'first-button' ###
    jQuery(grid_container).find("#first-button").click ->
      page = configuration.query.page
      if page > 1
        configuration.query.page = 1
        grid_execute_query()

    ### previous page button 'previous-button' ###
    jQuery(grid_container).find("#previous-button").click ->
      page = configuration.query.page
      if page > 1
        configuration.query.page = page - 1
        grid_execute_query()

    ### page text field ###
    jQuery(grid_container).find("#current-page").keypress (event_object) ->
      if event_object.which == 13
        page = parseInt(jQuery(grid_container).find("#current-page").val())
        if page > 0 and page <= grid.current_total
          configuration.query.page = page
        else
          jQuery(grid_container).find("#current-page").val(configuration.query.page)
          grid.execute_query();

    ### refresh button (eventually) ###


    ### find box ###
    jQuery(grid_container).find("#filter-string").keypress ->
      if event_object.which == 13
        configuration.query.filter_string = jQuery(grid_container).find("#filter-string").val()
        configuration.query.filter_column = jQuery(grid_container).find("#filter-column").val()
        configuration.query.page = 1
        grid.execute_query()

    ### clear button ###
    jQuery(grid_container).find("#t").click ->
      configuration.query.filter_string = ""
      configuration.query.page = 1
      grid.execute_query()

    ### column sorts ###
    column_headings = jQuery(grid_container).find(".header-cell")
    for column in column_headings
      sort = jQuery(column).find(".sort-area span")
      this._bind_sort(sort, column, configuration, grid, grid_container)

    ### checkboxes on custom columns dialog IFF it's in use ###
    toggles = jQuery(grid_container).find("#column-chooser-dialog input[type=checkbox]")
    for toggle in toggles
      this._bind_column_toggle(toggle, configuration, grid, grid_container)

    ### bind resizable to column containers ###
    jQuery(grid_container).find(".content-container").sortable
      axis: "x"
      stop: (event, ui) ->
        columns = configuration.layout.columns
        new_column_list = []
        jQuery(".header-cell").each (index, element) ->
          id = jQuery(element).attr("id")
          jQuery.each columns, (index, column) ->
            if column.id == id
              new_column_list.push(column)
        configuration.layout.columns = new_column_list
    jQuery(grid_container).find(".column-container").resizable

  _bind_column_toggle: (toggle, configuration, grid, grid_container) ->
    jQuery(toggle).click () ->
      column_id = toggle.id;
      column_id = column_id.split("-")[0]
      columns = configuration.layout.columns
      for column in columns
        if column.id == column_id
          column_container = jQuery(grid_container).find "#"+column.id+"-column"
          if column.hide == true
            column.hide = false
            jQuery(column_container).removeClass "generic-hide"
          else
            column.hide = true
            jQuery(column_container).addClass "generic-hide"
          break

  _bind_sort: (sort, column, configuration, grid, grid_container) ->
    jQuery(sort).click () ->
      current_sort = configuration.query.sort_column
      current_order = configuration.query.sort_order

      if current_sort == column.id
        if current_order == "ASC"
          configuration.query.sort_order = "DESC"
          jQuery(sort).find("div").removeClass "ascending"
          jQuery(sort).removeClass "ui-icon-carat-1-n"
          jQuery(sort).removeClass "ui-icon-carat-2-n-s"
          jQuery(sort).find("div").addClass "descending"
          jQuery(sort).addClass("ui-icon-carat-1-s")
        else
          configuration.query.sort_order = "ASC"
          jQuery(sort).removeClass "ui-icon-carat-1-s"
          jQuery(sort).removeClass "ui-icon-carat-2-n-s"
          jQuery(sort).addClass "ui-icon-carat-1-n"
          jQuery(sort).find("div").removeClass "descending"
          jQuery(sort).find("div").addClass "ascending"
      else
        jQuery(grid_container).find(".sorted").removeClass "ui-icon-carat-1-n"
        jQuery(grid_container).find(".sorted").removeClass "ui-icon-carat-1-s"
        jQuery(grid_container).find(".sorted").addClass "ui-icon-carat-2-n-s"
        jQuery(grid_container).find(".sorted").removeClass "ascending"
        jQuery(grid_container).find(".sorted").removeClass "descending"
        jQuery(grid_container).find(".sorted").removeClass "sorted"

        jQuery(sort).addClass "sorted"
        jQuery(sort).addClass "ascending"
        jQuery(sort).addClass "ui-icon-carat-1-n"
        jQuery(sort).removeClass "ui-icon-carat-1-s"
        jQuery(sort).removeClass "ui-icon-carat-2-n-s"
        configuration.query.sort_order = "ASC"

      configuration.query.sort_column = column.id
      grid.execute_query()

###
GridSize
###
class GridSize
  constructor: ->
    @height = 200
    @width = 'auto'

  pickle: ->
      "height": @height
      "width": @width

  unpickle: (representation) ->
    @height= representation.height
    @width= representation.width

###
GridColumn
###
class GridColumn
  constructor: ->
    @display_name = ""
    @id = ""
    @sortable = false
    @hide = false
    @width = 100
    @alignment = "left"
    @optional = true

    ###
    built in support for checkboxes and links. if you choose link you need
    cell data [<uri>,<text>,{optional key/value pairs to go on the tag}]
    if checkbox you can provide [<value>, <optional-css-class>]
    otherwise just a single value is expected.
    ###
    @type = "standard"

  pickle: ->
    "display_name": @display_name
    "id": @id
    "sortable": @sortable
    "hide": @hide
    "width": @width
    "alignment": @alignment
    "optional": @optional
    "type": @type

  unpickle: (representation) ->
    @display_name = representation.display_name
    @id = representation.id
    @sortable = representation.sortable
    @hide = representation.hide
    @width = representation.width
    @alignment = representation.alignment
    @optional = representation.optional
    @type = representation.type

###
GridLayout
###
class GridLayout
  constructor: ->
    @use_row_striping = true
    @columns = []

  create_column: ->
    return new GridColumn()

  set_columns: (columns) ->
    for input_column in columns
      column = new GridColumn()
      column.unpickle input_column
      @columns.push input_column

  pickle: ->
    columns = []
    for column in @columns
      columns.push @columns.pickle()

    "use_row_striping": @use_row_striping
    "columns": columns

  unpickle: (representation) ->
    @use_row_striping = representation.use_row_striping
    for input_column in representation.columns
      column = new GridColumn()
      column.unpickle input_column
      @columns.push column

###
GridQuery
###
class GridQuery
  constructor: ->
    @filter_string = ""
    @filter_column = null
    @sort_column = null
    @sort_order = "ASC"
    @page = 1
    @page_size = 15
    @custom_filters = []

  pickle: ->
    "filter_string": @filter_string
    "filter_column": @filter_column
    "sort_column": @sort_column
    "sort_order": @sort_order
    "page": @page
    "page_size": @page_size
    "custom_filters": @custom_filters

  unpickle: (representation) ->
    @filter_string = representation.filter_string
    @filter_column = representation.filter_column
    @sort_column = representation.sort_column
    @sort_order = representation.sort_order
    @page = representation.page
    @page_size = representation.page_size
    @custom_filters = representation.custom_filters

###
GridButton
###
class GridButton
  constructor: ->
    @name = ""
    @css_class = ""
    @action = ""
    @icon = ""

  pickle: ->
    "name": @name
    "css_class": @css_class
    "action": @action
    "icon": @ico

  unpickle: (representation) ->
    @name = representation.name
    @css_class = representation.css_class
    @action = representation.action
    @icon = representation.icon

class GridButtons
  constructor: ->
    @buttons = []

  create_button: ->
    new GridButton()

  set_buttons: (buttons) ->
    for input_button in buttons
      button = new GridButton()
      button.unpickle input_button
      @buttons.push button

  pickle: ->
    buttons = []
    for button in @buttons
      buttons.push @button.pickle()
    "buttons": buttons

  unpickle: (representation) ->
    for input_button in representation
      button = new GridButton()
      button.unpickle input_button
      @buttons.push button
    #@buttons = representation.buttons

###
GridPagination
###
class GridPagination
  constructor: ->
    @page_size_options = [10,25,50,100,200]
    @items_name = "items"
    @processing_string = "Processing request..."
    @error_string = "Processing error..."
    @no_results_string = "No items found."

  pickle: ->
    "page_size_options": @page_size_options
    "items_name": @items_name
    "processing_string": @processing_string
    "error_string": @error_string
    "no_results_string": @no_results_string

  unpickle: (representation) ->
    @page_size_options = representation.page_size_options
    @items_name = representation.items_name
    @processing_string = representation.processing_string
    @error_string = representation.error_string
    @no_results_string = representation.no_results_string

###
GridHooks
###
class GridHooks
  constructor: ->
    @on_submit = null
    @on_success = null
    @on_failure = null

  pickle: ->
    "on_submit": @on_submit
    "on_success": @on_success
    "on_failure": @on_failure

  unpickle: (representation) ->
    @on_submit = representation.on_submit
    @on_success = representation.on_success
    @on_failure = representation.on_failure

###
GridFilters
###
class GridFilters
  constructor: ->
    @use_advanced_search = false
    @search_callback = null
    @filter_column_names = []

  pickle: ->
    "use_advanced_search": @use_advanced_search,
    "filter_column_names": @filter_column_names

  unpickle: (representation) ->
    @use_advanced_search = representation.use_advanced_search
    @filter_column_names = representation.filter_column_names

###
GridConfiguration
###
class GridConfiguration
  constructor: (grid_id) ->
    @id = grid_id
    @size = new GridSize()
    @layout = new GridLayout()
    @query = new GridQuery()
    @buttons = new GridButtons()
    @pagination = new GridPagination()
    @filters = new GridFilters()
    @hooks = new GridHooks()
    @metadata =
      title: "jGrid"
      method: "GET"
      action_uri: ""
      autoload: true
      accordian: false
      start_exposed: true
    @trigger = null

  grid: ->
    jQuery("#" + @id);

  pickle: ->
    "size": @size.pickle(),
    "layout": @layout.pickle(),
    "query": @query.pickle(),
    "buttons": @buttons.pickle(),
    "pagination": @pagination.pickle(),
    "filters": @filters.pickle(),
    "hooks": @hooks.pickle(),
    "metadata": @metadata

  unpickle: (representation) ->
    @size.unpickle representation.size
    @layout.unpickle representation.layout
    @query.unpickle representation.query
    @buttons.unpickle representation.buttons
    @pagination.unpickle representation.pagination
    @filters.unpickle representation.filters
    @hooks.unpickle representation.hooks
    @metadata = representation.metadata

###
GridFramework
###
class GridFramework
  constructor: (client_grid_id) ->
    @configuration = new GridConfiguration(client_grid_id)
    @renderer = new Renderer(@configuration)
    @bindings = new Bindings()
    GRID_HOLDER = @
    @current_total = 0

  ### set up the table minus data ###
  render_grid: () ->
    @renderer.render @
    @bindings.bind_events @configuration, @

  query_success_handler: (data, grid) ->
    if @configuration.hooks.on_success
      @configuration.hooks.on_success data

    ### now after any client hooks have been executed render the grid ###
    grid.current_total = data.total
    grid.renderer.populate_grid data, grid.configuration

  query_failure_handler: (data, grid) ->
    if @configuration.hooks.on_failure
      @configuration.hooks.on_failuredata
    grid.renderer.render_error data, grid.configuration

  execute_query: () ->
    if @configuration.hooks.on_submit
      @configuration.hooks.on_submit()

    ### first we need to clear the existing data out ###
    @renderer.clear_data()
    _this = this
    jQuery.ajax
      type: this.configuration.metadata.method,
      url: this.configuration.metadata.action_uri,
      data: "grid="+JSON.stringify(this.configuration.query.pickle()),
      dataType: 'json',
      success: (data) ->
        _this.query_success_handler data, _this
      failure: (data) ->
        _this.query_failure_handler data, _this

###
Console
###
class Console
  log: (message_string, alert_on_fail) ->
    try
      console.log message_string
    catch error
      if alert_on_fail
        alert message_string

###
Column Toggle dialog
###
$ () ->
  $.fx.speeds._default = 400
  $ () ->
    jQuery("#column-chooser-dialog").dialog
      autoOpen: false
      show: "blind"
      hide: "blind"
      height: 150
      width: 200
      modal: true
      buttons:
        Ok: () ->
          jQuery( this ).dialog( "close" )

    jQuery(".ui-dialog-titlebar").attr("style", "display:none")

    jQuery(".title-bar-column-configure").click ->
      tr_count = jQuery( "#column-chooser-dialog tr" ).length
      dialog_height = tr_count * 50
      jQuery( "#column-chooser-dialog" ).dialog height: dialog_height
      jQuery( "#column-chooser-dialog" ).dialog("open")

ontoggle_column: (axis_string, grid_id) ->
  selector_string = "#"+grid_id+" ." + axis_string
  selector_string = "##{grid_id} . #{axis_string}"
  if jQuery(selector_string).hasClass "generic-hide"
    jQuery(selector_string).removeClass "generic-hide"
  else
    jQuery(selector_string).addClass "generic-hide"


class ButtonBarRenderer
  constructor: (configuration) ->
    @configuration = configuration
    @utils = new RenderUtils()

  bind_button_event: (element, event_string, func) ->
    jQuery(element).bind event_string, func

  render: (container) ->
    button_bar_div = jQuery("<div></div>")
    jQuery(button_bar_div).addClass("button-bar")
    container.append(button_bar_div)

    button_bar_inner_div = jQuery("<div></div>")
    jQuery(button_bar_inner_div).addClass("button-bar-inner")
    jQuery(button_bar_div).append(button_bar_inner_div)

    for button_item in @configuration.buttons.buttons
      if button_item.name != "separator"
        button_div = jQuery("<div></div>")
        jQuery(button_div).addClass("button-bar-button")
        jQuery(button_bar_inner_div).append(button_div)

        button = jQuery("<div></div>")
        jQuery(button).addClass(button_item.css_class)
        jQuery(button_div).append(button)

        button_span = jQuery("<span></span>")
        jQuery(button_span).attr("style", "padding-left: 20px;")
        jQuery(button_span).text(button_item.name)
        jQuery(button).append(button_span)

        @bind_button_event(button, 'click', button_item.action)
      else
        separator = jQuery("<div></div>")
        jQuery(separator).addClass("button-separator")
        jQuery(button_bar_inner_div).append(separator)

    clear_div = jQuery("<div></div>")
    jQuery(clear_div).addClass("clear-both")
    jQuery(button_bar_div).append(clear_div)

###
  .button-bar
    .button-bar-inner
      .button-bar-button
        %div
          %span.add-button{:style => "padding-left: 20px;"} Add
      .button-bar-button
        %div
          %span.delete-button{:style => "padding-left: 20px;"} Delete
      .button-separator
      .button-bar-button
        %div
          %span.ui-icon.ui-icon-triangle-1-sw
          %span Configure columns

    .clear-both
###

###
ColumnChooserRenderer
###
class ColumnChooserRenderer
  constructor: (configuration) ->
    @configuration = configuration
    @utils = new RenderUtils()

  render: ->
    grid = @configuration.grid()

    chooser_dialog = jQuery("<div id='column-chooser-dialog'></div>")
    grid.append(chooser_dialog)

    chooser_div = @utils.new_div("column-chooser-div")
    chooser_div.attr("style","margin-bottom: -"+@configuration.size.height+"px; height: auto; width: auto; top: 75px; left: 503px;")
    chooser_dialog.append(chooser_div)

    table = @utils.new_tag("table")
    chooser_div.append(table)

    tbody = @utils.new_tag("tbody")
    table.append(tbody)

    columns = @configuration.layout.columns
    i = 0
    for column in columns
      tr = @_generate_chooser_row(column, i)
      tbody.append(tr)
      i++

  _generate_chooser_row: (column, index) ->
    tr = @utils.new_tag("tr")
    axis_string = "col" + index

    td_top = @utils.new_tag("td","show-hide-input")
    tr.append(td_top)

    check_box = @utils.new_tag("input", "show-hide-checkbox")
    check_box.attr("id", column.id + "-toggle")
    if column.optional == true
      check_box.attr("onclick", "ontoggle_column('" + axis_string + "','"+@configuration.id+"');")
    check_box.attr("type", "checkbox")
    check_box.val(index)
    if column.hide == false
      check_box.attr("checked", "checked")
    if column.optional == false
      check_box.attr("checked", "checked")
      check_box.attr("disabled", "true")
    td_top.append(check_box)

    td_label = @utils.new_tag("td", "show-hide-label")
    tr.append(td_label)

    label = jQuery("<label>"+column.display_name+"</label>")
    td_label.append(label)

    tr

###
ColumnHeadersRenderer
###
class ColumnHeadersRenderer
  constructor: (configuration) ->
    @configuration = configuration
    @utils = new RenderUtils()

  render: (total_table) ->
    content_container = @utils.new_div("content-container")
    @utils.add_style(["width","height"],[@configuration.size.width + 10, @configuration.size.height + 10],content_container)

    columns = @configuration.layout.columns
    total_width = 0
    i = 0
    for column in columns
      column_container = @_render_column_container(column, i)
      content_container.append(column_container)
      heading_cell = @_render_column(column, i)
      column_container.append(heading_cell)
      if column.hide
        column_container.addClass("generic-hide")
      i++

    total_table.append(content_container)
    return content_container

  _render_column_container: (column, index) ->
    column_div = @utils.new_div("column-container float-left column-border")
    column_div.attr("id", column.id + "-column")
    @utils.add_style(["width", "height"],[column.width + "px", @configuration.size.height + "px"], column_div)
    column_div

  _render_column: (column, index) ->
    heading = @utils.new_div("cell-border clear-both header-cell")
    heading.attr("id", column.id)
    @utils.add_style(["text-align"],["center"], heading)
    sort_image = @_build_sort_image(column)
    span = @utils.new_tag("span")
    heading.append(span)
    heading.append(sort_image)
    span.text(column.display_name)
    return heading

  _build_sort_image: (column) ->
    div = @utils.new_div("sort-area")
    span = @utils.new_tag("span")

    sort_column_id = @configuration.query.sort_column
    sort_order = @configuration.query.sort_order
    if sort_column_id == column.id
      if sort_order == "ASC"
        span.addClass("ui-icon ui-icon-carat-1-n sorted ascending")
      else
        span.addClass("ui-icon ui-icon-carat-1-s sorted descending")
    else
      span.addClass("ui-icon ui-icon-carat-2-n-s")

    div.append(span)

    div

###
PaginationRenderer
###
class PaginationRenderer
  constructor: (configuration) ->
    @configuration = configuration
    @utils = new RenderUtils()

  render: (total_table) ->
    pagination_div = @utils.new_div("pagination-div")
    total_table.append(pagination_div)

    pagination_inner = @utils.new_div("pagination-inner-div")
    pagination_div.append(pagination_inner)

    if @configuration.filters.use_advanced_search == true
      @._render_advanced_search(pagination_inner)

      separator = @utils.new_div("button-separator")
      pagination_inner.append(separator)

    @._render_page_size_select(pagination_inner)

    separator = @utils.new_div("button-separator")
    pagination_inner.append(separator)

    @._render_before(pagination_inner)

    separator = @utils.new_div("button-separator")
    pagination_inner.append(separator)

    @._render_current(pagination_inner)

    separator = @utils.new_div("button-separator")
    pagination_inner.append(separator)

    @._render_after(pagination_inner)

    separator = @utils.new_div("button-separator")
    pagination_inner.append(separator)

    @._render_display_text(pagination_inner)

    clear_both = @utils.new_div("clear-both")
    pagination_inner.append(clear_both)

  _render_display_text: (pagination) ->
    pagination_group = @utils.new_div("pagination-group")
    pagination.append(pagination_group)
    span = jQuery("<span></span>")
    span.addClass("displaying-span")
    span.attr("id", "displaying-string")
    span.text(@configuration.pagination.no_results_string)
    pagination_group.append(span)


  _render_before: (pagination) ->
    pagination_group = @utils.new_div("pagination-group")
    pagination.append(pagination_group)

    first_button = @utils.new_div("pagination-button")
    first_button.attr("id", "first-button")
    pagination_group.append(first_button)
    first_page_span = @utils.new_tag("span", "ui-icon ui-icon-seek-first")
    first_button.append(first_page_span)

    previous_button = @utils.new_div("pagination-button")
    previous_button.attr("id", "previous-button")
    pagination_group.append(previous_button)
    previous_page_span = @utils.new_tag("span", "ui-icon ui-icon-seek-prev")
    previous_button.append(previous_page_span)

  _render_after: (pagination) ->
    pagination_group = @utils.new_div("pagination-group")
    pagination.append(pagination_group)

    next_button = @utils.new_div("pagination-button")
    next_button.attr("id", "next-button")
    pagination_group.append(next_button)
    next_page_span = @utils.new_tag("span", "ui-icon ui-icon-seek-next")
    next_button.append(next_page_span)

    last_button = @utils.new_div("pagination-button")
    last_button.attr("id", "last-button")
    pagination_group.append(last_button)
    last_page_span = @utils.new_tag("span", "ui-icon ui-icon-seek-end")
    last_button.append(last_page_span)

  _render_current: (pagination) ->
    pagination_group = @utils.new_div("pagination-group")
    pagination.append(pagination_group)
    span = jQuery("<span></span>")
    span.addClass("pagination-counter")
    span.html("Page&nbsp;&nbsp;")
    pagination_group.append(span)
    input = jQuery("<input></input>")
    input.addClass("query-input-field")
    input.attr("type", "text")
    input.attr("size", "4")
    input.attr("id", "current-page")
    input.val(@configuration.query.page)
    pagination_group.append(input)
    span = jQuery("<span></span>")
    span.attr("id", "total-pages")
    span.html("&nbsp;&nbsp; of " + @configuration.query.page)
    pagination_group.append(span)

  _render_advanced_search: (pagination) ->
    pagination_group = @utils.new_div("pagination-group")
    pagination.append(pagination_group)
    advanced_search = @utils.new_div("pagination-image-advanced-search")
    advanced_search.addClass("pagination-button")
    advanced_search.attr("id", "advanced-search-button")
    pagination_group.append(advanced_search)
    advanced_span = jQuery("<span></span>")
    advanced_search.append(advanced_span)

  _render_page_size_select: (pagination) ->
    pagination_group = @utils.new_div("pagination-group")
    pagination.append(pagination_group)
    select = jQuery("<select></select>")
    select.attr("id", "page-size")
    pagination_group.append(select)
    options_range = @configuration.pagination.page_size_options
    for option in options_range
      option = jQuery("<option></option>")
      option.text(option)
      option.val(option)
      if option == @configuration.query.page_size
        option.attr("selected", "selected")
      select.append(option)

###
SearchRenderer
###
class SearchRenderer
  constructor: (configuration) ->
    @configuration = configuration
    @utils = new RenderUtils()

  render: (total_table) ->
    search_dialog = jQuery("<div id='"+@configuration.grid_id+"-gridulous-search-dialog'></div>")
    total_table.append(search_dialog)

    search_div = @utils.new_div("search-div")
    position = jQuery(total_table).find(".title-bar-search").position
    search_div.attr("style","margin-bottom: -"+@configuration.size.height+"px; height: auto; width: auto; top: "+position.bottom+"px; left: 503px;")
    search_dialog.append(search_div)

    search_div_inner = jQuery("<div></div>")
    search_div_inner.addClass("search-div-inner")
    search_div.append(search_div_inner)

    fieldset = @utils.new_tag("fieldset")
    search_div_inner.append(fieldset)
    legend = @utils.new_tag("legend")
    fieldset.append(legend)
    legend.text("Find")

    input = @utils.new_tag("input","filter-string-input")
    input.attr("type", "text")
    input.attr("size", "30")
    input.attr("name", "filter-string")
    input.attr("id", "filter-string")
    fieldset.append(input)

    select = @utils.new_tag("select")
    select.attr("id", "filter-column")
    fieldset.append(select)
    for column in @configuration.layout.columns
      option = jQuery("<option></option>")
      option.text(column.display_name)
      option.val(column.id)
      if column.id == @configuration.query.filter_column
        option.attr("selected", "selected")
      select.append(option)

###
TitleBarRenderer
###
class TitleBarRenderer
  constructor: (configuration) ->
    @configuration = configuration
    @utils = new RenderUtils()

  bind_table_hide: (element, event_string, grid) ->
    jQuery(element).bind event_string, () ->
      jQuery(grid).find(".total-table-id").toggle()

  render: ->
    grid = @configuration.grid()
    grid.attr("style","width: "+@configuration.size.width+"px;")

    title_bar_div = @utils.new_div("title-bar")
    grid.append(title_bar_div)
    title_span_div = @utils.new_div("title-span")
    title_bar_div.append(title_span_div)
    title_bar_span = @utils.new_tag("span")
    title_bar_span.text(@configuration.metadata.title)
    title_span_div.append(title_bar_span)

    search = @utils.new_div("title-bar-button title-bar-search")
    search.attr("title", "Search filters")
    title_bar_div.append(search)
    toggle_span = @utils.new_tag("span", "ui-icon ui-icon-search")
    search.append(toggle_span)

    title_bar_column_configure = @utils.new_div("title-bar-button title-bar-column-configure")
    title_bar_column_configure.attr("title", "Configure Columns")
    title_bar_div.append(title_bar_column_configure)
    toggle_span = @utils.new_tag("span", "ui-icon ui-icon-triangle-1-sw")
    title_bar_column_configure.append(toggle_span)

    title_bar_toggle = @utils.new_div("title-bar-button title-bar-toggle")
    title_bar_toggle.attr("title", "Minimize/Maximize Table")
    title_bar_div.append(title_bar_toggle)
    toggle_span = @utils.new_tag("span", "ui-icon ui-icon-triangle-2-n-s")
    title_bar_toggle.append(toggle_span)
    @bind_table_hide(title_bar_toggle, "click", grid)

###
Renderer
###
class Renderer
  constructor: (grid_configuration) ->
    @configuration = grid_configuration
    @total_table = null
    @content_container = null
    @data_div = null
    @utils = new RenderUtils()

  render: (grid) ->
    new ColumnChooserRenderer(@configuration).render()
    new TitleBarRenderer(@configuration).render()

    @._render_total_table()
    new ButtonBarRenderer(@configuration).render(@total_table)
    @content_container = new ColumnHeadersRenderer(@configuration).render(@total_table)
    @total_table.append(@utils.new_div("clear-both"))
    new PaginationRenderer(@configuration).render(@total_table)
    new SearchRenderer(@configuration).render(@total_table)
    new SearchDialog(@configuration, grid)
    @total_table.append(@utils.new_div("clear-both"))

  _render_total_table: ->
    grid = @configuration.grid()
    @total_table = @utils.new_div("total-table-id")
    grid.append(@total_table)

  clear_data: ->
    grid = @configuration.grid()
    jQuery(grid).find(".content-cell").remove()

  populate_grid: (data) ->
    @._render_grid(data.rows)
    @._adjust_grid_state(data.page, data.total)

  _adjust_grid_state: (page, total) ->
    jQuery("#current-page").val(page + 1)
    jQuery("#total-pages").html("&nbsp;&nbsp; of " + parseInt(total / @configuration.query.page_size + 1))
    if total == 0
      jQuery(@total_table).find("#displaying-string").html(@configuration.pagination.no_results_string)
    else
      if total < @configuration.query.page_size
        display_string = "Showing 1 to " + total + " of " + total + " items."
        jQuery(@total_table).find("#displaying-string").html(display_string)
      else
        starting_number = @configuration.query.page_size * page + 1
        ending_number = starting_number - 1 + @configuration.query.page_size
        display_string = "Showing " + starting_number + " to " + ending_number + " of " + total + " items."
        jQuery(@total_table).find("#displaying-string").html(display_string)

  _render_grid: (data) ->
    i = 0
    for row in data
      @._render_row(data[i], i)
      i++

  _render_row: (row, counter) ->
    column_containers = jQuery(@configuration.grid()).find(".column-container")
    columns = @configuration.layout.columns
    i = 0
    for column in columns
      data = row[column.id]
      cell = @._render_cell(data, column, i, counter)
      jQuery(column_containers[i]).append(cell)
      i++

  _render_cell: (data, column, index, row_counter) ->
    striping_class = "odd-row"
    if row_counter % 2 == 0
      striping_class = "even-row"
    cell = @utils.new_div("content-cell")
    cell.attr("axis", column.id)
    inner_cell = @utils.new_div(striping_class)
    cell.append(inner_cell)

    if column.type == "link"
      anchor = @utils.new_tag("a")
      anchor.attr("href", data[0])
      label = @utils.new_tag("label")
      label.html(data[1])
      anchor.append(label)
      inner_cell.append(anchor)
    else if column.type == "checkbox"
      input = @utils.new_tag("input")
      input.attr("type", "checkbox")
      input.attr("id", data)
      inner_cell.append(input)
    else
      label = @utils.new_tag("label")
      label.html(data)
      inner_cell.append(label)

    cell

  render_error: (data) ->

###
SearchDialog
###
class SearchDialog
  constructor: (configuration, grid) ->
    $.fx.speeds._default = 400
    dialog_id = "#"+configuration.grid_id+"-gridulous-search-dialog"
    jQuery( dialog_id  ).dialog
      autoOpen: false
      show: "blind"
      hide: "blind"
      height: 200
      width: 500
      modal: true
      buttons:
        Go: ->
          configuration.query.filter_string = jQuery( dialog_id ).find("#filter-string").val()
          configuration.query.filter_column = jQuery( dialog_id ).find("#filter-column").val()
          configuration.query.page = 1
          grid.execute_query()
        Clear: ->
          jQuery( dialog_id ).find("#filter-string").val("")
          configuration.query.filter_string = ""
          configuration.query.page = 1
          grid.execute_query()
        Done: ->
          jQuery( @).dialog( "close" )

    jQuery(".ui-dialog-titlebar").attr("style", "display:none;")

    jQuery(".title-bar-search").click ->
      jQuery( dialog_id ).dialog( "open" )
      false;

###
DataEngine
###
class DataEngine
  constructor: (grid_configuration) ->
    @configuration = grid_configuration
