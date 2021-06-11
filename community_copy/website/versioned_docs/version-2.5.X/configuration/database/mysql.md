---
id: version-2.5.X-mysql
title: MySQL
hide_title: true
original_id: mysql
---

# MySQL Configurations

### Compulsory config values
- **mysql_user**: 
    - Description: The MySQL user to use to query the database. If the relevant tables are not already created by you, this user should have the ability to create new tables. To see the tables needed, visit [this page](../../getting-started/database-setup/mysql)
    - Example: ```mysql_user: "supertokensUser"```
- **mysql_password**: 
    - Description: Password for the MySQL user. If you have not set a password make this an empty string.
    - Example: ```mysql_password: "somePassword"```

### Optional config values
- **mysql_connection_pool_size**: 
    - Description: Defines the connection pool size for MySQL. Please refer to [this page](https://github.com/brettwooldridge/HikariCP/wiki/About-Pool-Sizing) for more information.
    - Default: ```10```
    - Example: ```mysql_connection_pool_size: 10```
- **mysql_host**: 
    - Description: Specifies the mysql host url here. Some example values are ```localhost```, ```192.168.0.1``` and ```example.com```
    - Default: ```localhost```
    - Example: ```mysql_host: "192.168.0.1"```
- **mysql_port**:
    - Description: Specifies the port to use when connecting to the MySQL instance.
    - Default: ```3306```
    - Example: ```mysql_port: 3306```
- **mysql_database_name**:
    - Description: SuperTokens will use this database to store information.
    - Default: ```auth_session```
    - Example: ```mysql_database_name: "auth_session"```
- **mysql_key_value_table_name**:
    - Description: This is the name of the table which will be used as a key value store for SuperTokens
    - Default: ```key_value```
    - Example: ```mysql_key_value_table_name: "key_value"```
- **mysql_session_info_table_name**:
    - Description: This is the name of the table that will store the session info for users.
    - Default: ```session_info```
    - Example: ```mysql_session_info_table_name: "session_info"```