#!/usr/bin/env ruby
require 'xcodeproj'

# open the project and get the group to add the files to
project = Xcodeproj::Project.open(Dir.pwd + "/src/plugins/codeTypeChecking/iosenv/iosenv.xcodeproj")

project.native_targets.each do |target|
    target.build_phases.each do |phase|
        if phase.display_name() == "Sources"
            phase.files_references.each do |file|
                filename = file.display_name()

                if filename == "AppDelegate.swift"
                    # Do nothing
                elsif filename == "SceneDelegate.swift"
                    # Do nothing
                elsif filename == "ViewController.swift"
                    # Do nothing
                else
                    file.build_files.each do |buildfile|
                        phase.remove_build_file(buildfile)
                    end
                end
            end
        end
    end
end

group = project.main_group["iosenv"]["Snippets"]
group.clear()

project.save