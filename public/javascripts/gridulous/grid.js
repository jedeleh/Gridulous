var GridFramework = Class.$extend({
  __init__: function(client_grid_id) {
    this.configuration = new GridConfiguration(client_grid_id);
    this.renderer = new Renderer(this.configuration);
    this.bindings = new Bindings();
    GRID_HOLDER = this;
    this.current_total = 0;
  },

  // set up the table minus data
  render_grid: function() {
    this.renderer.render(this);
    this.bindings.bind_events(this.configuration, this);
  },

  query_success_handler: function(data, grid) {
    if (this.configuration.hooks.on_success) {
      this.configuration.hooks.on_success(data);
    }

    // now after any client hooks have been executed render the grid
    grid.current_total = data.total;
    grid.renderer.populate_grid(data, grid.configuration);
  },

  query_failure_handler: function(data, grid) {
    if (this.configuration.hooks.on_failure) {
      this.configuration.hooks.on_failure(data);
    }

    grid.renderer.render_error(data, grid.configuration);
  },

  execute_query: function() {
    if (this.configuration.hooks.on_submit) {
      this.configuration.hooks.on_submit();
    }

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
