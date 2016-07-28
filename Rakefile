require 'bundler/gem_tasks'
require 'rspec/core/rake_task'
require 'fileutils'

RSpec::Core::RakeTask.new(:spec)

task default: :spec

task :install do
  install_path = '/usr/local/bin/git-user'
  FileUtils.cp 'exe/git-user', install_path

  puts "Installation is succeed => #{install_path}"
end
