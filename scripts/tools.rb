# frozen_string_literal: true

require './scripts/os'

def copy_dist(from, to, remove = false, overwrite = true)
  if overwrite == true && File.directory?(to)
    puts 'Remove previous version'
    Rake.rm_r(to, force: true)
  end
  unless File.directory?(to)
    puts "Creating destination folder: #{to}"
    Rake.mkdir_p(to, verbose: true)
  end
  src = "#{from}/src"
  if File.directory?(src) && remove == true
    puts 'Remove sources'
    Rake.rm_r(src, force: true)
  end
  puts "Copy dist from #{from} to #{to}"
  Rake.cp_r("#{from}/.", to, verbose: false)
end

def putsAccent(text, err = false)
  border = Array.new(text.length, '=').join('')
  if err == true
    raise "\n#{border}\n#{text}\n#{border}\n\n"
  else
    puts "\n#{border}\n#{text}\n#{border}\n\n"
  end
end

def compress(output_file, pwd, dest)
  if OS.windows?
    Rake.sh "tar -czf #{output_file} -C #{pwd} #{dest} --force-local"
  else
    Rake.sh "tar -czf #{output_file} -C #{pwd} #{dest} "
  end
end