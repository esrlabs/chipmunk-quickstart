# frozen_string_literal: true

require './scripts/register'
require './scripts/plugin'
require './scripts/versions'
require './scripts/tools'

PLUGINS_DEST_FOLDER = './plugins'
PLUGIN_RELEASE_FOLDER = './releases'

def build(target, hard, ver, pack, vers)
  if target.nil?
    putsAccent('Please define target to be built like: "rake build[./plugins/plugin.complex]"', true)
  end
  versions = Versions.new(vers)
  plugin = Plugin.new(target, versions, hard, ver, pack)
  if plugin.build
    puts "Plugin #{plugin.get_plugin_name} is built SUCCESSFULLY"
  else
    puts "Fail to build plugin #{plugin.get_plugin_name}"
  end
  # ...
  puts "Traget is: #{target}"
end

# Does:
# - build defined plugin
# - pack plugin into chipmunk plugin package
task :pack, [:target, :ver, :vers] do |_t, args|
  build(args.target, false, args.ver, true, args.vers)
end

# Does:
# - build defined plugin
task :build, [:target, :ver, :vers] do |_t, args|
  build(args.target, false, args.ver, false, args.vers)
end

# Does:
# - rebuild defined plugin (will drop node_modules stuff)
task :rebuild, [:target, :ver, :vers] do |_t, args|
  build(args.target, true, args.ver, false, args.vers)
end

# Does (used only for Angular plugins):
# - copy sources from angular/projects folder back to ./plugins/[plugin_name]/render folder
task :synch, [:target, :vers] do |_t, args|
  if args.target.nil?
    putsAccent('Please define target to be synch like: "rake synch[./plugins/plugin.complex]"', true)
  end
  versions = Versions.new(args.vers)
  plugin = Plugin.new(args.target, versions, false)
  plugin.synch
end
