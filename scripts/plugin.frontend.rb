# frozen_string_literal: true

require 'json'
require './scripts/plugin.frontend.angular'
require './scripts/plugin.frontend.notangular'

PLUGIN_FRONTEND_FOLDER = 'render'
PLUGIN_FRONTEND_ANGULAR_PACKAGE = 'ng-package.json'
PLUGIN_FRONTEND_ANGULAR_BASE_REPO = 'https://github.com/DmitryAstafyev/chipmunk.frontend.angular.git'
PLUGIN_FRONTEND_ANGULAR_BASE_NAME = 'chipmunk.frontend.angular'
ANGULAR_DEST_FOLDER = './'

class PluginFrontend
  def initialize(path, versions)
    @path = "#{path}/#{PLUGIN_FRONTEND_FOLDER}"
    @versions = versions
    @state = false
    @angular = PluginFrontendAngular.new(@path, @versions, self.class.get_package_json("#{@path}/package.json"))
    @frontend = PluginFrontendNotAngular.new(@path, @versions, self.class.get_package_json("#{@path}/package.json"))
  end

  def exist
    return false unless File.directory?(@path)

    true
  end

  def valid
    package_json_path = "#{@path}/package.json"
    unless File.exist?(package_json_path)
      puts "Fail to find #{package_json_path}"
      return false
    end
    true
  end

  def install
    if @angular.is
      if @angular.install
        @state = true
        @path = @angular.get_dist_path
      else
        @state = nil
      end
      return true
    end
    if @frontend.is
      if @frontend.install
        @state = true
        @path = @frontend.get_dist_path
      else
        @state = nil
      end
      return true
    end
    false
  end

  def get_path
    @path
  end

  def get_state
    @state
  end

  def has_angular
    @angular.is
  end

  def self.get_package_json(path)
    package_json_str = File.read(path)
    package_json = JSON.parse(package_json_str)
    package_json
  end
end
