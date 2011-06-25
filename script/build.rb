#!/home/jaydel/.rvm/rubies/ruby-1.9.2-p180/bin/ruby
gridulous_path = "/home/jaydel/projects/gridulous"
# you will need to adjust the above ruby path and project path to match your environment

# build up javascript
target_javascript_path = "#{gridulous_path}/deploy/gridulous/js/"
[
  "#{gridulous_path}/public/javascripts/gridulous/bindings.js",
  "#{gridulous_path}/public/javascripts/gridulous/grid.js",
  "#{gridulous_path}/public/javascripts/gridulous/render-pagination.js",
  "#{gridulous_path}/public/javascripts/gridulous/render-title-bar.js",
  "#{gridulous_path}/public/javascripts/gridulous/data_engine.js",
  "#{gridulous_path}/public/javascripts/gridulous/render-search.js",
  "#{gridulous_path}/public/javascripts/gridulous/render-column-chooser.js",
  "#{gridulous_path}/public/javascripts/gridulous/render.js",
  "#{gridulous_path}/public/javascripts/gridulous/search-dialog.js",
  "#{gridulous_path}/public/javascripts/gridulous/render-buttons.js",
  "#{gridulous_path}/public/javascripts/gridulous/column-chooser-dialog.js",
  "#{gridulous_path}/public/javascripts/gridulous/configuration.js",
  "#{gridulous_path}/public/javascripts/gridulous/render-column-headers.js",
  "#{gridulous_path}/public/javascripts/gridulous/render-utils.js"
].each do |filepath|
 `cp #{filepath} #{target_javascript_path}`
end

# build up css
target_stylesheet_path = "#{gridulous_path}/deploy/gridulous/css/"
sass_path = "#{gridulous_path}/public/stylesheets/gridulous/sass/"
[
  "images",
  "fonts",
  "colors",
  "gridulous"
].each do |sass_file|
  `sass #{sass_path}#{sass_file}.sass #{target_stylesheet_path}#{sass_file}.css`
end

# move over images
target_image_path = "#{gridulous_path}/deploy/gridulous/images/"
#TODO: after thematic changes. jdk

# move the documentation over
#TODO:jdk

# zip it all up.
#TODO: jdk
