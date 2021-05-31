---
id: postgresql
title: PostgreSQL
hide_title: true
---

# PostgreSQL Configurations

### Compulsory config values
- **postgresql_user**: 
    - Description: The PostgreSQL user to use to query the database. If the relevant tables are not already created by you, this user should have the ability to create new tables. To see the tables needed, visit [this page](../../getting-started/database-setup/postgresql)
    - Example: ```postgresql_user: "supertokensUser"```
- **postgresql_password**: 
    - Description: Password for the PostgreSQL user. If you have not set a password make this an empty string.
    - Example: ```postgresql_password: "somePassword"```

### Optional config values
- **postgresql_connection_pool_size**: 
    - Description: Defines the connection pool size for PostgreSQL. Please refer to [this page](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) for more information.
    - Default: ```10```
    - Example: ```postgresql_connection_pool_size: 10```
- **postgresql_host**: 
    - Description: Specifies the postgresql host url here. Some example values are ```localhost```, ```192.168.0.1``` and ```example.com```
    - Default: ```localhost```
    - Example: ```postgresql_host: "192.168.0.1"```
- **postgresql_port**:
    - Description: Specifies the port to use when connecting to the PostgreSQL instance.
    - Default: ```5432```
    - Example: ```postgresql_port: 5432```
- **postgresql_database_name**:
    - Description: SuperTokens will use this database to store information.
    - Default: ```auth_session```
    - Example: ```postgresql_database_name: "auth_session"```
- **postgresql_key_value_table_name**:
    - Description: This is the name of the table which will be used as a key value store for SuperTokens
    - Default: ```key_value```
    - Example: ```postgresql_key_value_table_name: "key_value"```
- **postgresql_session_info_table_name**:
    - Description: This is the name of the table that will store the session info for users.
    - Default: ```session_info```
    - Example: ```postgresql_session_info_table_name: "session_info"```
- **postgresql_past_tokens_table_name**:
    - Description: Specify the name of the table that will store old tokens.
    - Default: ```past_tokens```
    - Example: ```postgresql_past_tokens_table_name: "past_tokens"```