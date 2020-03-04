# frozen_string_literal: true

require './scripts/register'
require './scripts/plugin'
require './scripts/versions'
require './scripts/tools'

PLUGINS_DEST_FOLDER = './plugins'
PLUGIN_RELEASE_FOLDER = './releases'

task :build, [:target, :hard] do |_t, args|
  if args.target.nil?
    putsAccent('Please define target to be built like: "rake build[./plugins/plugin.complex]"', true)
  end
  hard = args.hard.nil? ? false : true
  versions = Versions.new
  plugin = Plugin.new(args.target, versions, hard)
  if plugin.build
    puts "Plugin #{plugin.get_plugin_name} is built SUCCESSFULLY"
  else
    puts "Fail to build plugin #{plugin.get_plugin_name}"
  end
  # ...
  puts "Traget is: #{args.target}"
end
