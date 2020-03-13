# frozen_string_literal: true

require 'json'
require 'fileutils'
require './scripts/plugin.backend'
require './scripts/plugin.frontend'
require './scripts/tools'

class Plugin
  def initialize(path, versions, hard)
    @name = File.basename(path)
    @path = path
    @versions = versions
    @hard = hard
  end

  def build
    backend = PluginBackend.new(@path, @versions.get, @hard)
    if !backend.exist
      puts "Plugin \"#{@name}\" doesn't have backend"
    else
      unless backend.valid
        puts "Fail to build plugin \"#{@name}\" because backend isn't valid"
        return nil
      end
      if backend.install
        puts "Install backend of \"#{@name}\": SUCCESS"
      else
        puts "Install backend of \"#{@name}\": FAIL"
      end
    end
    frontend = PluginFrontend.new(@path, @versions.get)
    if !frontend.exist
      puts "Plugin \"#{@name}\" doesn't have frontend"
    else
      unless frontend.valid
        puts "Fail to build plugin \"#{@name}\" because frontend isn't valid"
        return nil
      end
      if frontend.install
        puts "Install frontend of \"#{@name}\": SUCCESS"
      else
        puts "Install frontend of \"#{@name}\": FAIL"
      end
    end
    if backend.get_state.nil? || frontend.get_state.nil?
      puts "Fail to build plugin \"#{@name}\" because backend or frontend weren't installed correctly"
      return false
    end
    if backend.get_state && !frontend.get_state
      puts "Fail to build plugin \"#{@name}\" because plugin has only backend"
      return false
    end
    dependencies = self.class.get_dependencies(backend, frontend)
    unless File.directory?(PLUGIN_RELEASE_FOLDER)
      Rake.mkdir_p(PLUGIN_RELEASE_FOLDER, verbose: true)
      puts "Creating release folder: #{PLUGIN_RELEASE_FOLDER}"
    end
    dest = "#{PLUGIN_RELEASE_FOLDER}/#{@name}"
    unless File.directory?(dest)
      Rake.mkdir_p(dest, verbose: true)
      puts "Creating plugin release folder: #{dest}"
    end
    copy_dist(backend.get_path, "#{dest}/process") if backend.get_state
    copy_dist(frontend.get_path, "#{dest}/render") if frontend.get_state
    file_name = self.class.get_name(@name, @versions.get_hash, '999.999.999')
    self.class.add_info(dest, {
      'name' => @name,
      'file' => file_name,
      'version' => '999.999.999',
      'hash' => @versions.get_hash,
      'phash' => @versions.get_dep_hash(dependencies),
      'url' => '',
      'display_name' => @name,
      'description' => @name,
      'readme' => '',
      'icon' => '',
      'dependencies' => dependencies
    })
    true
  end

  def get_plugin_name
    @name
  end

  def self.get_name(name, hash, version)
    "#{name}@#{hash}-#{version}-#{get_nodejs_platform}.tgz"
  end

  def self.get_dependencies(backend, frontend)
    dependencies = {
      'electron' => false,
      'electron-rebuild' => false,
      'chipmunk.client.toolkit' => false,
      'chipmunk.plugin.ipc' => false,
      'chipmunk-client-material' => false,
      'angular-core' => false,
      'angular-material' => false,
      'force' => true
    }
    if backend.exist
      dependencies['electron'] = true
      dependencies['electron-rebuild'] = true
      dependencies['chipmunk.plugin.ipc'] = true
    end
    if frontend.exist
      if frontend.has_angular
        dependencies['chipmunk.client.toolkit'] = true
        dependencies['chipmunk-client-material'] = true
        dependencies['angular-core'] = true
        dependencies['angular-material'] = true
      else
        dependencies['chipmunk.client.toolkit'] = true
      end
    end
    dependencies
  end

  def self.add_info(dest, entry)
    File.open("./#{dest}/info.json", 'w') do |f|
      f.write(entry.to_json)
    end
  end

end
