class Person < ActiveRecord::Base
  def self.configure_grid(parameters, grid_configuration)
    # given the form parameters, build the configuration that will be used to configure the sql
    grid_configuration.columns = []
    if parameters["filter_column"] and parameters["filter_string"].length > 0
      grid_configuration.filters = [[parameters["filter_column"],parameters["filter_string"]]]
    end
    grid_configuration.sorts = [%{#{parameters["sort_column"]} #{parameters["sort_order"]}}]
    grid_configuration.limit = parameters["page_size"]
    offset = (parameters["page"].to_i - 1) * parameters["page_size"].to_i
    grid_configuration.offset = offset
    grid_configuration
  end

  def self.render_grid(data, results)
    results[:rows] = []
      data.each do |person|
      results[:rows] << {
        :last_name => ["/people/#{person.id}/edit","#{person.last_name}"],
        :first_name => person.first_name,
        :middle_initial => person.middle_initial,
        :email => person.email,
        :date_of_birth => I18n.l(person.date_of_birth, :format => :short),
        :role => person.role
        }
      end
    results
  end


end
