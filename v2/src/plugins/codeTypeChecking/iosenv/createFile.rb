#!/usr/bin/env ruby
require 'xcodeproj'

# open the project and get the group to add the files to
project = Xcodeproj::Project.open(Dir.pwd + "/src/plugins/codeTypeChecking/iosenv/iosenv.xcodeproj")
group = project.main_group["iosenv"]["Snippets"]

# Process the file path to get all groups to add + file to add
new_file_path = ARGV[0]

puts ""
puts new_file_path

if new_file_path[".swift"]
    # Has a file name with extension in it
else
    puts "Invalid file path: " + new_file_path + "...Only .swift files are supported"
    exit(1)
end

split = new_file_path.strip.split("/").reject { |s| s.empty? }
split.each do |path|
    if path[".swift"]
        # Path is a swift file, create a new file
        file = group.new_file(Dir.pwd + "/" + new_file_path)
        main_target = project.targets.first
        main_target.add_file_references([file])
    else
        # Path is a folder, create a new group
        group = group.new_group(path)
    end
end

project.save