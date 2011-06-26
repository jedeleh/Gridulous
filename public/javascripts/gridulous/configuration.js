// these classes enapsulate the configuration for a grid. They are structure in
// such a manner as to allow easy access to them by genereal areas of interest.
// Each configuration object comes with its own defaults, so the client only
// need change the exact things that are needed.

var GridSize = Class.$extend({
  __init__: function() {
    this.height = 200;
    this.width = 'auto';
  },

  pickle: function() {
    return {
      "height": this.height,
      "width": this.width
    };
  },

  unpickle: function(representation) {
    this.height= representation.height;
    this.width= representation.width;
  }
});

var GridColumn = Class.$extend({
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

var GridLayout = Class.$extend({
  __init__: function() {
    this.use_row_striping = true;
    this.columns = [];// { display_name = string; id = string; sortable = boolean; hide = boolean; width = integer; alignment = <left;center;right>; optional = <can it be hidden?> }
  },

  create_column: function() {
    return new GridColumn();
  },

  set_columns: function(columns) {
    for (var i = 0; i < columns.length; i++) {
      column = new GridColumn();
      column.unpickle(columns[i]);
      this.columns.push(column);
    }
  },

  pickle: function() {
    columns = [];
    for (var i = 0; i < columns.length; i++) {
      columns.append(this.columns[i].pickle());
    }
    return {
      "use_row_striping": this.use_row_striping,
      "columns": columns
    }
  },

  unpickle: function(representation) {
    this.use_row_striping = representation.use_row_striping;
    for (var i = 0; i < representation.columns.length; i++) {
      column = new GridColumn();
      column.unpickle(representation.columns[i]);
      this.columns.append(column);
    }
  }
});

var GridQuery = Class.$extend({
  __init__: function() {
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

var GridButton = Class.$extend({
  __init__: function() {
    this.name = "";
    this.css_class = "";
    this.action = "";
    this.icon = "";
  },

  pickle: function() {
    return {
      "name": this.name,
      "css_class": this.css_class,
      "action": this.action,
      "icon": this.icon
    }
  },

  unpickle: function(representation) {
    this.name = representation.name;
    this.css_class = representation.css_class;
    this.action = representation.action;
    this.icon = representation.icon;
  }
});

var GridButtons = Class.$extend({
  __init__: function() {
    this.buttons = []; // { name: string, css_class: string, action: javascript method, :icon: image for left side of button}
  },

  create_button: function() {
    return new GridButton();
  },

  set_buttons: function(buttons) {
    for (var i = 0; i < buttons.length; i++) {
      button = new GridButton();
      button.unpickle(buttons[i]);
      this.buttons.push(button);
    }
  },

  pickle: function() {
    buttons = [];
    for (var i = 0; i < this.buttons.length; i++) {
      buttons.append(this.buttons[i].pickle());
    }
    return {
      "buttons": buttons
    }
  },

  unpickle: function(representation) {
    for (var i = 0; i < representation.buttons.length; i++) {
      button = new GridButton();
      button.unpickle(representation.buttons[i]);
      this.buttons.push(button);
    }
    this.buttons = representation.buttons;
  }
});

var GridPagination = Class.$extend({
  __init__: function() {
    this.page_size_options = [10,25,50,100,200];
    this.items_name = "items";
    this.processing_string = "Processing request...";
    this.error_string = "Processing error...";
    this.no_results_string = "No items found.";  // %1 = item name
  },

  pickle: function() {
    return {
      "page_size_options": this.page_size_options,
      "items_name": this.items_name,
      "processing_string": this.processing_string,
      "error_string": this.error_string,
      "no_results_string": this.no_results_string
    };
  },

  unpickle: function(representation) {
    this.page_size_options = representation.page_size_options;
    this.items_name = representation.items_name;
    this.processing_string = representation.processing_string;
    this.error_string = representation.error_string;
    this.no_results_string = representation.no_results_string;
  }
});

var GridHooks = Class.$extend({
  __init__: function() {
    this.on_submit = null;
    this.on_success = null;
    this.on_failure = null;
  },

  pickle: function() {
    return {
      "on_submit": this.on_submit,
      "on_success": this.on_success,
      "on_failure": this.on_failure
    };
  },

  unpickle: function(representation) {
    this.on_submit = representation.on_submit;
    this.on_success = representation.on_success;
    this.on_failure = representation.on_failure;
  }
});

var GridFilters = Class.$extend({
  __init__: function() {
    this.use_advanced_search = false;
    this.search_callback = null;
    this.filter_column_names = []; // {display_name: <string>, id: <string>}
  },

  pickle: function() {
    return {
      "use_advanced_search": this.use_advanced_search,
      "filter_column_names": this.filter_column_names
    }
  },

  unpickle: function(representation) {
    this.use_advanced_search = representation.use_advanced_search;
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
    this.buttons = new GridButtons();
    this.pagination = new GridPagination();
    this.filters = new GridFilters();
    this.hooks = new GridHooks();
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
      "filters": this.filters.pickle(),
      "hooks": this.hooks.pickle(),
      "metadata": this.metadata
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
    this.hooks.unpickle(representation.hooks);
    this.metadata = representation.metadata;
  }
});

