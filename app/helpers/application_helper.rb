module ApplicationHelper

  def load_javascript_for_directory(directory_name)
    glob_string = "#{directory_name}/**/*.js"
    javascript_include_tag Dir.chdir(File.join(Rails.root, "public", "javascripts")) { Dir.glob(glob_string).sort }
  end

  def load_css_for_directory(directory_name)
    glob_string = "#{directory_name}/**/*.css"
    stylesheet_link_tag Dir.chdir(File.join(Rails.root, "public", "stylesheets")) { Dir.glob(glob_string).sort }
  end

end
