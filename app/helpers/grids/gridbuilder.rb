class GridBuilder
  def get_data(grid_configuration, model_name)
    model_query = Object::const_get(model_name)

    # set columns
    model_query = model_query.select(grid_configuration.columns.join(", ")) if grid_configuration.columns.length > 0

    # joins
    grid_configuration.joins.each do |join_symbol|
      model_query = model_query.joins(join_symbol)
    end

    # filters
    grid_configuration.filters.each do |column, value|
      value_string = "%#{value}%"
      model_query = model_query.where(column.to_sym.matches => value_string)
    end

    # sorts
    grid_configuration.sorts.each do |sort|
      model_query = model_query.order(sort)
    end

    # limit
    if grid_configuration.limit
      model_query = model_query.limit(grid_configuration.limit)
    end

    # offset
    if grid_configuration.offset
      model_query = model_query.offset(grid_configuration.offset)
    end

    # group bys
    grid_configuration.groups.each do |group|
      model_query = model_query.group(group)
    end

    y "----------------"
    y model_query.to_sql
    y "----------------"
    model_query
  end

  def get_count(grid_configuration, model_name)
    set = false
    model_class = Object::const_get(model_name)
    # set columns

    model_query = model_class.select("id")

    # joins
    grid_configuration.joins.each do |join_symbol|
      model_query = model_query.joins(join_symbol)
      set = true
    end

    # filters
    grid_configuration.filters.each do |column, value|
      value_string = "%#{value}%"
      model_query = model_query.where(column.to_sym.matches => value_string)
      set = true
    end

    # group bys
    grid_configuration.groups.each do |group|
      model_query = model_query.group(group)
      set = true
    end

    if not set
      model_class.count
    else
      model_query
    end
  end
end
