---
id: upgrading-users-core-version
title: Upgrading user's core version
hide_title: true
---

# Upgrading user's core version

- Tables to update:
    - apps (update core_version, plugin_interface_versio and plugin_version)
    - aws_containers (update image_version)
- System Manager:
    - Find instance id
    - Find StartUpdateSuperTokens command for relevant app
    - Copy to new
    - Change imageVersion parameter
    - Make sure the Document version is relevant to the new core version
    - Run command and check the container is updated and running

# Core Migration
### 3.6 to 3.7
- No additional changes

### 3.7 to 3.8
- No additional changes