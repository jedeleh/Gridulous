var RenderUtils = Class.$extend({
  // this is a candidate for refactoring into a base class.
  new_div: function( css_class ) {
    var div = $("<div></div>");
    div.addClass(css_class);
    return div;
  },

  blank_div: function() {
    var div = $("<div></div>");
    return div;
  },

  add_style: function( props, values, tag ) {
    buffer = "";
    for (var i = 0; i < props.length && i < values.length; i++) {
      buffer += props[i] + ": " + values[i] + ";";
    }
    $(tag).attr("style", buffer);
  },

  new_tag: function( tag_name, css_class) {
    var tag_string = "<"+tag_name+"></"+tag_name+">";
    var tag = $(tag_string);
    if (css_class) {
      tag.addClass(css_class);
    }
    return tag;
  }
});
