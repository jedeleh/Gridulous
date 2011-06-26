#!/home/jaydel/.rvm/rubies/ruby-1.9.2-p180/bin/ruby
gridulous_path = "/home/jaydel/projects/gridulous"
# you will need to adjust the above ruby path and project path to match your environment

# clean out previous deployment directory
puts "cleaing up old build..."
`rm -rf #{gridulous_path}/deploy/*`

# create the directories
puts "creating directories..."
`mkdir #{gridulous_path}/deploy/gridulous`
`mkdir #{gridulous_path}/deploy/gridulous/js`
`mkdir #{gridulous_path}/deploy/gridulous/css`
`mkdir #{gridulous_path}/deploy/gridulous/sass`
`mkdir #{gridulous_path}/deploy/gridulous/images`
`mkdir #{gridulous_path}/deploy/gridulous/doc`

# build up javascript
puts "deploying javascript..."
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
puts "compiling stylesheets..."
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

# move over sass files
puts "deploying sass files..."
target_sass_path = "#{gridulous_path}/deploy/gridulous/sass/"
sass_path = "#{gridulous_path}/public/stylesheets/gridulous/sass/"
[
  "images",
  "fonts",
  "colors",
  "gridulous"
].each do |sass_file|
  `cp #{sass_path}#{sass_file}.sass #{target_sass_path}#{sass_file}.sass`
end

# move over images
puts "deploying images..."
target_image_path = "#{gridulous_path}/deploy/gridulous/images/"
image_path = "#{gridulous_path}/public/stylesheets/images/"
[
  "background.png",
  "wbackground.png",
  "header.png",
  "ui-bg_flat_0_796363_40x100.png",
  "ui-bg_highlight-soft_75_ae8484_1x100.png",
  "ui-bg_flat_0_aaaaaa_40x100.png",
  "ui-bg_inset-soft_95_fef1ec_1x100.png",
  "ui-bg_flat_75_e1dbdb_40x100.png",
  "ui-icons_09096d_256x240.png",
  "ui-bg_glass_55_e0cdcd_1x400.png",
  "ui-icons_2e83ff_256x240.png",
  "ui-bg_glass_65_e1dbdb_1x400.png",
  "ui-icons_542c2c_256x240.png",
  "ui-bg_glass_75_a58383_1x400.png",
  "ui-icons_666699_256x240.png",
  "ui-bg_glass_75_e1dbdb_1x400.png",
  "ui-icons_cd0a0a_256x240.png"
].each do |image_file|
 `cp #{image_path}#{image_file} #{target_image_path}`
end

# move the documentation over
#puts "deploying documentation..."
#TODO:jdk

# zip it all up.
puts "zipping everything up"
`zip -r #{gridulous_path}/deploy/gridulous.zip #{gridulous_path}/*`
