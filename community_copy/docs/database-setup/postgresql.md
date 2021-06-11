---
id: postgresql
title: If using PostgreSQL
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./community/docs/database-setup/postgresql.md -->

# PostgreSQL setup

> This is needed only if you are running the SuperTokens core yourself.

## 1️⃣ Create a database 🛠️
```sql
CREATE DATABASE supertokens;
```
You can skip this step if you want SuperTokens to write to your own database. In this case, you will need to provide your database name as shown in the step below. 

## 2️⃣ Connect SuperTokens to your database 🔌

<!--DOCUSAURUS_CODE_TABS-->
<!--With Docker-->
```bash
# NOTE: host being localhost / 127.0.0.1 will not work in a docker image. 
# Please provide the database's local / public hostname or IP address

 docker run \
    -p 3567:3567 \
__HIGHLIGHT__    -e POSTGRESQL_CONNECTION_URI="postgresql://username:pass@host/dbName" \ __END_HIGHLIGHT__
    -d supertokens/supertokens-postgresql

# OR

 docker run \
    -p 3567:3567 \
__HIGHLIGHT__    -e POSTGRESQL_USER="username" \
    -e POSTGRESQL_PASSWORD="password" \
	-e POSTGRESQL_HOST="host" \
	-e POSTGRESQL_PORT="5432" \
    -e POSTGRESQL_DATABASE_NAME="supertokens" \ __END_HIGHLIGHT__
    -d supertokens/supertokens-postgresql
```

- You can also provide the table schema by providing the `POSTGRESQL_TABLE_SCHEMA` option.

<!--Without Docker-->
```yaml
# You need to add the following to the config.yaml file.
# The file path can be found by running the "supertokens --help" command

postgresql_connection_uri: "postgresql://username:pass@host/dbName"

# OR

postgresql_user: "username"

postgresql_password: "password"

postgresql_host: "host"

postgresql_port: "5432"

postgresql_database_name: "supertokens"
```

- You can also provide the table schema by providing the `postgresql_table_schema` option.

<!--END_DOCUSAURUS_CODE_TABS-->


## 3️⃣ Create tables 👩‍💻👨‍💻
> This happens automatically, unless you provide a PostgreSQL user that doesn't have table creation permission.

<div class="additionalInformation" text="See table structure">

```sql
CREATE TABLE IF NOT EXISTS key_value (
    name VARCHAR(128),
    value TEXT,
    created_at_time BIGINT,
    PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS session_info (
    session_handle VARCHAR(255) NOT NULL,
    user_id VARCHAR(128) NOT NULL,
    refresh_token_hash_2 VARCHAR(128) NOT NULL,
    session_data TEXT,
    expires_at BIGINT NOT NULL,
    created_at_time BIGINT NOT NULL,
    jwt_user_payload TEXT,
    PRIMARY KEY(session_handle)
);

CREATE TABLE IF NOT EXISTS emailpassword_users (
    user_id CHAR(36) NOT NULL,
    email VARCHAR(256) NOT NULL UNIQUE,
    password_hash VARCHAR(128) NOT NULL,
    time_joined BIGINT NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE INDEX emailpassword_user_pagination_index ON emailpassword_users(time_joined DESC, user_id DESC);

CREATE TABLE IF NOT EXISTS emailpassword_pswd_reset_tokens (
    user_id CHAR(36) NOT NULL,
    token VARCHAR(128) NOT NULL UNIQUE,
    token_expiry BIGINT NOT NULL,
    PRIMARY KEY (user_id, token),
    FOREIGN KEY (user_id) REFERENCES emailpassword_users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX emailpassword_password_reset_token_expiry_index ON emailpassword_pswd_reset_tokens(token_expiry);

CREATE TABLE IF NOT EXISTS emailverification_verified_emails (
    user_id CHAR(36) NOT NULL,
    email VARCHAR(256),
    PRIMARY KEY (user_id, email)
);

CREATE TABLE IF NOT EXISTS emailverification_tokens (
    user_id CHAR(36) NOT NULL,
    email VARCHAR(256),
    token VARCHAR(128) NOT NULL UNIQUE,
    token_expiry BIGINT NOT NULL,
    PRIMARY KEY (user_id, email, token)
);

CREATE INDEX emailverification_tokens_index ON emailverification_tokens(token_expiry);

CREATE TABLE IF NOT EXISTS thirdparty_users (
    third_party_id VARCHAR(28) NOT NULL,
    third_party_user_id VARCHAR(128) NOT NULL,
    user_id CHAR(36) NOT NULL,
    email VARCHAR(256) NOT NULL,
    time_joined BIGINT NOT NULL,
    PRIMARY KEY (third_party_id, third_party_user_id)
);

CREATE INDEX thirdparty_users_pagination_index ON thirdparty_users(time_joined DESC, user_id DESC);
```
You also have the option to rename these tables if you want. You can do so by passing relevant configs to the core via the docker env variables or the `config.yaml` file.

</div>

## 4️⃣ Test the connection 🤞
To test, **start SuperTokens** and run the following query in your database
```sql
SELECT * FROM key_value;
```
If you see at least one row, it means that the connection has been successfully completed! 🥳🎉
