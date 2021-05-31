---
id: mysql
title: MySQL
hide_title: true
---

# MySQL setup

> Please visit the MySQL [configuration section](../../configuration/database/mysql) to see how to input your instance's connection details.

### 1) Create a database for SuperTokens
You can give your existing database, or create a new one as shown in the example below:
```sql
CREATE DATABASE auth_session; # auth_session is the default database name
```

### 2) Create tables in the database
- If you do not want to create these beforehand, SuperTokens will create them for you on first start. In this case, please make sure that the MySQL user provided to SuperTokens has the permission to create tables.
- Alternatively, create the following tables:
    ```sql
    CREATE TABLE IF NOT EXISTS key_value (
        name VARCHAR(128),
        value TEXT,
        created_at_time BIGINT UNSIGNED,
        PRIMARY KEY(name)
    );

    CREATE TABLE IF NOT EXISTS session_info (
        session_handle VARCHAR(255) NOT NULL,
        user_id VARCHAR(128) NOT NULL,
        refresh_token_hash_2 VARCHAR(128) NOT NULL,
        session_data TEXT,
        expires_at BIGINT UNSIGNED NOT NULL,
        created_at_time BIGINT UNSIGNED NOT NULL,
        jwt_user_payload TEXT,
        PRIMARY KEY(session_handle)
    );

    CREATE TABLE IF NOT EXISTS past_tokens (
        refresh_token_hash_2 VARCHAR(128) NOT NULL,
        parent_refresh_token_hash_2 VARCHAR(128) NOT NULL,
        session_handle VARCHAR(255) NOT NULL,
        created_at_time BIGINT UNSIGNED NOT NULL,
        PRIMARY KEY(refresh_token_hash_2)
    );
    ```
    You can change the names of these tables if you want. In this case, please provide the changed names in the ```config.yaml``` file as shown [here](../../configuration/database/mysql)
