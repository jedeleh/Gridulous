class GridConfiguration
  require 'ostruct'
  def new_configuration
    struct = OpenStruct.new
    struct.columns = []
    struct.joins = []
    struct.filters = []
    struct.sorts = []
    struct.limit = nil
    struct.offset = nil
    struct.groups = []
    return struct
  end

  def configure(parameters, model_name)
    model_class = Object::const_get(model_name)
    configuration = new_configuration
    model_class.configure_grid(parameters, configuration)
    configuration
  end
end
