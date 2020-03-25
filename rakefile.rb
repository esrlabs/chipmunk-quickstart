# frozen_string_literal: true

require './scripts/register'
require './scripts/plugin'
require './scripts/versions'
require './scripts/tools'

PLUGINS_DEST_FOLDER = './plugins'
PLUGIN_RELEASE_FOLDER = './releases'

def build(target, hard, ver, pack)
  if target.nil?
    putsAccent('Please define target to be built like: "rake build[./plugins/plugin.complex]"', true)
  end
  versions = Versions.new
  plugin = Plugin.new(target, versions, hard, ver, pack)
  if plugin.build
    puts "Plugin #{plugin.get_plugin_name} is built SUCCESSFULLY"
  else
    puts "Fail to build plugin #{plugin.get_plugin_name}"
  end
  # ...
  puts "Traget is: #{target}"
end

task :pack, [:target, :ver] do |_t, args|
  build(args.target, false, args.ver, true)
end

task :build, [:target, :ver] do |_t, args|
  build(args.target, false, args.ver, false)
end

task :rebuild, [:target, :ver] do |_t, args|
  build(args.target, true, args.ver, false)
end

task :synch, [:target] do |_t, args|
  if args.target.nil?
    putsAccent('Please define target to be synch like: "rake synch[./plugins/plugin.complex]"', true)
  end
  versions = Versions.new
  plugin = Plugin.new(args.target, versions, false)
  plugin.synch
end
