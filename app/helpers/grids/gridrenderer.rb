class GridRenderer
  def render(data, count, configuration, model_name)

    # Construct a hash from the ActiveRecord result
    return_data = Hash.new()
    return_data[:page] = configuration.offset.to_i / configuration.limit.to_i
    return_data[:total] = count

    model_class = Object::const_get(model_name)
    json_output = model_class.render_grid(data, return_data)
    json_output
  end
end
