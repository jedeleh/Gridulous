var ButtonBarRenderer = Class.$extend({
  __init__: function(configuration) {
    this.configuration = configuration;
    this.utils = new RenderUtils();
  },

  bind_button_event: function(element, event_string, func) {
    $(element).bind(event_string, func);
  },

  /*
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
   */
  render: function(container) {
    var $button_bar_div = $("<div></div>");
    $button_bar_div.addClass("button-bar");
    container.append($button_bar_div);

    var $button_bar_inner_div = $("<div></div>");
    $button_bar_inner_div.addClass("button-bar-inner");
    $button_bar_div.append($button_bar_inner_div);

    buttons = this.configuration.buttons.buttons;
    for (var i = 0; i < buttons.length; i++) {
      var button = buttons[i];

      if (button.name != "separator") {
        // make the button html
        var $button_div = $("<div></div>");
        $button_div.addClass("button-bar-button");
        $button_bar_inner_div.append($button_div);

        // the name of the button css class that the client specifies is button.css_class
        var $button = $("<div></div>");
        $button.addClass(button.css_class);
        $button_div.append($button);

        // the name of the button is found in button.name
        var $button_span = $("<span></span>");
        $button_span.attr("style", "padding-left: 20px;");
        $button_span.text(button.name);
        $button.append($button_span);

        // bind button events to the function name, which is stored in button.action
        this.bind_button_event($button, 'click', button.action);
      } else {
        var $separator = $("<div></div>");
        $separator.addClass("button-separator");
        $button_bar_inner_div.append($separator);
      }
    }

    var $clear_div = $("<div></div>");
    $clear_div.addClass("clear-both");
    $button_bar_div.append($clear_div);
  }
});

