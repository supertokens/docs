---
id: sqlite
title: SQLite
hide_title: true
---

# SQLite Configurations

### Compulsory config values
- **sqlite_database_folder_location**: 
    - Description: Path to the folder where SuperTokens related tables will be stored.
    - Example: ```sqlite_database_folder_location: "/home/sqlite_data"```

### Optional config values
- **sqlite_connection_pool_size**: 
    - Description: Defines the connection pool size for SQLite. Please refer to [this page](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) for more information.
    - Default: ```10```
    - Example: ```sqlite_connection_pool_size: 10```
- **sqlite_database_name**:
    - Description: SuperTokens will use this database to store information.
    - Default: ```auth_session```
    - Example: ```sqlite_database_name: "auth_session"```
- **sqlite_key_value_table_name**:
    - Description: This is the name of the table which will be used as a key value store for SuperTokens
    - Default: ```key_value```
    - Example: ```sqlite_key_value_table_name: "key_value"```
- **sqlite_session_info_table_name**:
    - Description: This is the name of the table that will store the session info for users.
    - Default: ```session_info```
    - Example: ```sqlite_session_info_table_name: "session_info"```
- **sqlite_past_tokens_table_name**:
    - Description: Specify the name of the table that will store old tokens.
    - Default: ```past_tokens```
    - Example: ```sqlite_past_tokens_table_name: "past_tokens"```