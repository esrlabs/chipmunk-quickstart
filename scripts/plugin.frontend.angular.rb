# frozen_string_literal: true

require 'json'

class PluginFrontendAngular
  def initialize(path, versions, package_json)
    @path = path
    @versions = versions
    @package_json = package_json
  end

  def is
    unless File.file?("#{@path}/#{PLUGIN_FRONTEND_ANGULAR_PACKAGE}")
      return false
    end

    true
  end

  def valid
    unless @package_json.key?('name')
      puts 'Field "name" not found in package.json'
      return false
    end
    true
  end

  def install
    unless File.directory?(ANGULAR_DEST_FOLDER)
      Rake.mkdir_p(ANGULAR_DEST_FOLDER, verbose: true)
      puts "Creating temporary folder: #{ANGULAR_DEST_FOLDER}"
    end
    unless File.directory?("#{ANGULAR_DEST_FOLDER}/#{PLUGIN_FRONTEND_ANGULAR_BASE_NAME}")
      puts 'Cloning angular base'
      Rake.cd ANGULAR_DEST_FOLDER do
        Rake.sh "git clone #{PLUGIN_FRONTEND_ANGULAR_BASE_REPO}"
      end
      puts 'Install angular base'
      Rake.cd "#{ANGULAR_DEST_FOLDER}/#{PLUGIN_FRONTEND_ANGULAR_BASE_NAME}" do
        Rake.sh 'npm install --prefere-offline'
      end
    end

    if !File.directory?("#{ANGULAR_DEST_FOLDER}/#{PLUGIN_FRONTEND_ANGULAR_BASE_NAME}/projects/#{@package_json['name']}")
      Rake.cd "#{ANGULAR_DEST_FOLDER}/#{PLUGIN_FRONTEND_ANGULAR_BASE_NAME}" do
        begin
            puts "Generate library \"#{@package_json['name']}\""
            Rake.sh "./node_modules/.bin/ng generate library #{@package_json['name']}"
            puts 'Remove default sources'
            Rake.rm_r("./projects/#{@package_json['name']}", force: true)
            puts 'Create empty folder'
            Rake.mkdir("./projects/#{@package_json['name']}")
        rescue StandardError => e
          puts e.message
          return false
          end
      end
      begin
        puts 'Copy plugin sources'
        Rake.cp_r("#{@path}/.", "#{ANGULAR_DEST_FOLDER}/#{PLUGIN_FRONTEND_ANGULAR_BASE_NAME}/projects/#{@package_json['name']}", verbose: false)
      rescue StandardError => e
        puts e.message
        return false
      end
    else
      puts "Angular part of plugin \"#{@package_json['name']}\" is already exist"
    end

    Rake.cd "#{ANGULAR_DEST_FOLDER}/#{PLUGIN_FRONTEND_ANGULAR_BASE_NAME}" do
      begin
        puts "Build \"#{@package_json['name']}\""
        Rake.sh "./node_modules/.bin/ng build #{@package_json['name']}"
        return true
      rescue StandardError => e
        puts e.message
        return false
      end
    end
  end

  def get_dist_path
    "#{ANGULAR_DEST_FOLDER}/#{PLUGIN_FRONTEND_ANGULAR_BASE_NAME}/dist/#{@package_json['name']}"
  end
end
