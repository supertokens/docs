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

### 3.4 to 3.5
- Change `user_id` in `emailverification_verified_emails` to `VARCHAR(128)`
- Change `user_id` in `emailverification_tokens` to `VARCHAR(128)`
- Add new table:
   ```
   CREATE TABLE IF NOT EXISTS all_auth_recipe_users(
      user_id CHAR(36) NOT NULL,
      recipe_id VARCHAR(128) NOT NULL,
      time_joined BIGINT NOT NULL,
      PRIMARY KEY (user_id)
   );
   CREATE INDEX all_auth_recipe_users_pagination_index ON all_auth_recipe_users (time_joined DESC, user_id DESC);
   ```
   This means that the content from other `emailpassword_users` and from `thirdparty_users` need to be copied into this table
- Deleted index `emailpassword_user_pagination_index` and `thirdparty_users_pagination_index`

### 3.5 to 3.6
- No manual change required

### 3.6 to 3.7
- No manual change required

### 3.7 to 3.8
- No manual change required
- Adds new tables for passwordless (is added automatically):
  - `passwordless_users` that stores the users of the passwordless recipe
  - `passwordless_devices` that stores devices/information about passwordless login attempts
  - `passwordless_codes` that stores the codes each device can consume to finish the login process
