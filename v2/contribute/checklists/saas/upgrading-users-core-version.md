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

# Core DB Migration
### 3.6 to 3.7
- No manual change required

### 3.7 to 3.8
- No manual change required
- Adds new tables for passwordless (is added automatically):
  - `passwordless_users` that stores the users of the passwordless recipe
  - `passwordless_devices` that stores devices/information about passwordless login attempts
  - `passwordless_codes` that stores the codes each device can consume to finish the login process