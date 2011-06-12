class Grids
  def self.process_grid(parameters, model_name)
    grid_configuration = GridConfiguration.new
    configuration = grid_configuration.configure(parameters, model_name)
    builder = GridBuilder.new
    data = builder.get_data(configuration, model_name)
    count = builder.get_count(configuration, model_name)
    renderer = GridRenderer.new
    grid_json = renderer.render(data, count, configuration, model_name)
    grid_json
  end
end
