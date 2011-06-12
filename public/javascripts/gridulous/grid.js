// Constants for event strings
BEFORE_QUERY = "before_query";
AFTER_QUERY = "after_query";
AFTER_QUERY_ERROR = "after_query_error";
BEFORE_RENDER = "before_render";
AFTER_RENDER = "after_render";
BEFORE_FILTER = "before_filter";
AFTER_FILTER = "after_filter";

var Hooks = Class.$extend({
  __init__: function() {
    this.hooks = {
      before_query: new Array(),
      after_query: new Array(),
      after_query_error: new Array(),
      before_render: new Array(),
      after_render: new Array(),
      before_filter: new Array(),
      after_filter: new Array()
    }
  },

  add_hook: function(event_string, hook_method) {
    switch(event_string)
    {
      case BEFORE_QUERY:
        this.before_query.push(hook_method);
      case AFTER_QUERY:
        this.after_query.push(hook_method);
      case AFTER_QUERY_ERROR:
        this.after_query_error.push(hook_method);
      case BEFORE_RENDER:
        this.before_render.push(hook_method);
      case AFTER_RENDER:
        this.after_render.push(hook_method);
      case BEFORE_FILTER:
        this.before_filter.push(hook_method);
      case AFTER_FILTER:
        this.after_filter.push(hook_method);
      default:
        throw "unknown hook type";
    }
  }

});

var GridFramework = Class.$extend({
  __init__: function(client_grid_id) {
    this.configuration = new GridConfiguration(client_grid_id);
    this.renderer = new Renderer(this.configuration);
    this.hooks = new Hooks();
    this.bindings = new Bindings();
    GRID_HOLDER = this;
    this.current_total = 0;
  },

  // set up the table minus data
  render_grid: function() {
    this.renderer.render();
    this.bindings.bind_events(this.configuration, this);
  },

  query_success_handler: function(data, grid) {
    hooks = grid.hooks.hooks.after_query;
    for (hook in hooks) {
      hook(data);
    }

    // now after any client hooks have been executed render the grid
    grid.current_total = data.total;
    grid.renderer.populate_grid(data, grid.configuration);
  },

  query_failure_handler: function(data, grid) {
    hooks = grid.hooks.hooks.after_query_error;
    for (hook in hooks) {
      hook(data);
    }

    grid.renderer.render_error(data, grid.configuration);
  },

  execute_query: function() {
    // first we need to clear the existing data out
    this.renderer.clear_data();
    // use jQuery to fire off the request. passed in handler is from the
    // framework and is responsible for any client hooks
    var _this = this;
    $.ajax({
      type: this.configuration.metadata.method,
      url: this.configuration.metadata.action_uri,
      data: "grid="+JSON.stringify(this.configuration.query.pickle()),
      dataType: 'json',
      success: function(data) { _this.query_success_handler(data, _this) },
      failure: function(data) { _this.query_failure_handler(data, _this) }
    });
  }

});

var Console = Class.$extend({
  log: function(message_string, alert_on_fail) {
    try {
      console.log(message_string);
    } catch (error) {
      if (alert_on_fail) {
        alert(message_string);
      }
    }
  }
});
