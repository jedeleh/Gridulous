// these classes enapsulate the configuration for a grid. They are structure in
// such a manner as to allow easy access to them by genereal areas of interest.
// Each configuration object comes with its own defaults, so the client only
// need change the exact things that are needed.

var Configuration = Class.$extend({
  __init__: function(enabled) {
    this.enabled = enabled;
  },

  pickle: function() {
    // must override this
  },

  unpickle: function(representation) {
    // must override this
  }
});

var GridSize = Configuration.$extend({
  __init__: function() {
    this.$super(true);
    this.height = 200;
    this.width = 'auto';
    this.minimum_height = 30;
    this.minimum_width = 30;
    this.resizeable = true;
  },

  pickle: function() {
    return {
      "height": this.height,
      "width": this.width,
      "minimum_height": this.minimum_height,
      "minimum_width": this.minimum_width,
      "resizeable": this.resizeable
    };
  },

  unpickle: function(representation) {
    this.height= representation.height;
    this.width= representation.width;
    this.minimum_height= representation.minimum_height;
    this.minimum_width = representation.minimum_width;
    this.resizeable = representation.sizeable;
  }
});

var GridColumn = Configuration.$extend({
  __init__: function() {
    this.display_name = "";
    this.id = "";
    this.sortable = false;
    this.hide = false;
    this.width = 100;
    this.alignment = "left"; // left right center
    this.optional = true;

    // built in support for checkboxes and links. if you choose link you need
    // cell data [<uri>,<text>,{optional key/value pairs to go on the tag}]
    // if checkbox you can provide [<value>, <optional-css-class>]
    // otherwise just a single value is expected.
    this.type = "standard"; // standard, checkbox, link
  },

  pickle: function() {
    return {
      "display_name": this.display_name,
      "id": this.id,
      "sortable": this.sortable,
      "hide": this.hide,
      "width": this.width,
      "alignment": this.alignment,
      "optional": this.optional,
      "type": this.type
    }
  },

  unpickle: function(representation) {
    this.display_name = representation.display_name;
    this.id = representation.id;
    this.sortable = representation.sortable;
    this.hide = representation.hide;
    this.width = representation.width;
    this.alignment = representation.alignment;
    this.optional = representation.optional;
    this.type = representation.type;
  }
});

var GridLayout = Configuration.$extend({
  __init__: function() {
    this.$super(true);
    this.use_row_striping = true;
    this.even_stripe_class = null;
    this.odd_stripe_class = null;
    this.use_column_visibility_widget = false;
    this.header_cell_css_class = null;
    this.data_cell_css_class = null
    this.columns = [];// { display_name = string; id = string; sortable = boolean; hide = boolean; width = integer; alignment = <left;center;right>; optional = <can it be hidden?> }
  },

  create_column: function() {
    return new GridColumn();
  },

  pickle: function() {
    columns = [];
    for (var i = 0; i < columns.length; i++) {
      columns.append(this.columns[i].pickle());
    }
    return {
      "use_row_striping": this.use_row_striping,
      "even_stripe_class": this.even_string_class,
      "odd_stripe_class": this.odd_string_class,
      "use_column_visibility_widget": this.use_column_visibility_widget,
      "columns": columns,
      "header_cell_css_class": this.header_cell_css_class,
      "data_cell_css_class": this.data_cell_css_class
    }
  },

  unpickle: function(representation) {
    this.use_row_striping = representation.use_row_striping;
    this.even_stripe_class = representation.even_stripe_class;
    this.odd_stripe_class = representation.odd_stripe_class;
    this.use_column_visibility_widget = representation.use_column_visibility_widget;
    for (var i = 0; i < representation.columns.length; i++) {
      column = new GridColumn();
      column.unpickle(representation.columns[i]);
      this.columns.append(column);
    }
    this.header_cell_css_class = representation.header_cell_css_class;
    this.data_cell_css_class = representation.data_cell_css_class;
  }
});

var GridQuery = Configuration.$extend({
  __init__: function() {
    this.$super(true);
    this.filter_string = "";
    this.filter_column = null;
    this.sort_column = null;
    this.sort_order = "ASC";
    this.page = 1;
    this.page_size = 15,
    this.custom_filters = []
  },

  pickle: function() {
    return {
      "filter_string": this.filter_string,
      "filter_column": this.filter_column,
      "sort_column": this.sort_column,
      "sort_order": this.sort_order,
      "page": this.page,
      "page_size": this.page_size,
      "custom_filters": this.custom_filters
    };
  },

  unpickle: function(representation) {
    this.filter_string = representation.filter_string;
    this.filter_column = representation.filter_column;
    this.sort_column = representation.sort_column;
    this.sort_order = representation.sort_order;
    this.page = representation.page;
    this.page_size = representation.page_size;
    this.custom_filters = representation.custom_filters;
  }
});

var GridButtons = Configuration.$extend({
  __init__: function(enabled) {
    this.$super(enabled);
    this.buttons = []; // { name: string, css_class: string, action: javascript method}
  },

  pickle: function() {
    return {
      "buttons": this.buttons
    }
  },

  unpickle: function(representation) {
   this.buttons = representation.buttons;
  }
});

var GridPagination = Configuration.$extend({
  __init__: function(enabled) {
    this.$super(enabled);
    this.custom_pagination_partial = null;  // see custom partials documentation
    this.page_size_options = [10,25,50,100,200];
    this.items_name = "items";
    this.count_string = "displaying %1 to %2 of %3 %4"; // %1 = page start counter, %2 = page end counter, %3 = total counter, %4 = item name
    this.processing_string = "Processing request...";
    this.error_string = "Processing error...";
    this.no_results_string = "No items found.";  // %1 = item name
  },

  pickle: function() {
    return {
      "custom_pagination_partial": this.custom_pagination_partial,  // see custom partials documentation
      "page_size_options": this.page_size_options,
      "items_name": this.items_name,
      "count_string": this.count_string,
      "processing_string": this.processing_string,
      "error_string": this.error_string,
      "no_results_string": this.no_results_string
    };
  },

  unpickle: function(representation) {
    this.custom_pagination_partial = representation.custom_pagination_partial;
    this.page_size_options = representation.page_size_options;
    this.items_name = representation.items_name;
    this.count_string = representation.count_string;
    this.processing_string = representation.processing_string;
    this.error_string = representation.error_string;
    this.no_results_string = representation.no_results_string;
  }
});

var GridFilters = Configuration.$extend({
  __init__: function(enabled) {
    this.$super(enabled);
    this.use_advanced_search = false;
    this.search_callback = null;
    this.use_go_button = true;
    this.use_clear_button = true;
    this.filter_column_names = []; // {display_name: <string>, id: <string>}
  },

  pickle: function() {
    return {
      "use_advanced_search": this.use_advanced_search,
      "search_callback": this.search_callback,
      "use_go_button": this.use_go_button,
      "use_clear_button": this.use_clear_button,
      "filter_column_names": this.filter_column_names
    }
  },

  unpickle: function(representation) {
    this.use_advanced_search = representation.use_advanced_search;
    this.search_callback = representation.search_callback;
    this.use_go_button = representation.use_go_button;
    this.use_clear_button = representation.use_clear_button;
    this.filter_column_names = representation.filter_column_names;
  }
});


// This is the class that the client needs to instantiate and then override
// default settings on. The rest of the jGrid system will consume it as needed.
var GridConfiguration = Class.$extend({
  __init__ : function(grid_id) {
    this.id = grid_id;

    this.size = new GridSize();
    this.layout = new GridLayout();
    this.query = new GridQuery();
    this.buttons = new GridButtons(true);
    this.pagination = new GridPagination(true);
    this.filters = new GridFilters(true);
    // configuration defaults
    this.metadata = {
      title: "jGrid",
      method: "GET",
      action_uri: "", //this must be set.
      autoload: true,
      accordian: false, // close and open the table itself
      start_exposed: true // ignored if accordian is false
    };
    this.trigger = null;
  },

  grid: function() {
    return $("#" + this.id);
  },

  // this allows the client to serialize the complete configuration of the grid
  // to json and stuff it in a safe place (cookie, session, HTML5 store, etc).
  // The client must turn the output into json prior to storage.
  pickle: function() {
    return {
      "size": this.size.pickle(),
      "layout": this.layout.pickle(),
      "query": this.query.pickle(),
      "buttons": this.buttons.pickle(),
      "pagination": this.pagination.pickle(),
      "filters": this.filters.pickle()
    }
  },

  // can but stuffed back in place. It is up to the user to parse it in from
  // json format before calling this method.
  unpickle: function(representation) {
    this.size.unpickle(representation.size);
    this.layout.unpickle(representation.layout);
    this.query.unpickle(representation.query);
    this.buttons.unpickle(representation.buttons);
    this.pagination.unpickle(representation.pagination);
    this.filters.unpickle(representation.filters);
  }
});

