---
id: version-3.3.X-rename-database-tables
title: Rename database tables
hide_title: true
original_id: rename-database-tables
---

<!-- COPY DOCS -->
<!-- ./community/docs/database-setup/rename-database-tables.md -->

# Rename database tables 

> If you already have tables created by SuperTokens, and then you rename them, SuperTokens will create new tables. So please be sure to migrate the data from the existing one to the new one.

You can add a prefix to all table names that are managed by SuperTokens. This way, all of them will be renamed in a way that have no clashes with your tables. 

For example, two tables created by SuperTokens are called `emailpassword_users` and `thirdparty_users`. If you add a prefix to them (something like `"my_prefix"`), then the tables will be renamed to `my_prefix_emailpassword_users` and `my_prefix_thirdparty_users`.

## For MySQL

<!--DOCUSAURUS_CODE_TABS-->
<!--With Docker-->
```bash
 docker run \
    -p 3567:3567 \
__HIGHLIGHT__    -e MYSQL_TABLE_NAMES_PREFIX="my_prexif" \ __END_HIGHLIGHT__
    -d supertokens/supertokens-mysql
```

<!--Without Docker-->
```yaml
# You need to add the following to the config.yaml file.
# The file path can be found by running the "supertokens --help" command

mysql_table_names_prefix: "my_prefix"
```

<!--END_DOCUSAURUS_CODE_TABS-->

## For PostgreSQL

<!--DOCUSAURUS_CODE_TABS-->
<!--With Docker-->
```bash
 docker run \
    -p 3567:3567 \
__HIGHLIGHT__    -e POSTGRESQL_TABLE_NAMES_PREFIX="my_prexif" \ __END_HIGHLIGHT__
    -d supertokens/supertokens-postgresql
```

<!--Without Docker-->
```yaml
# You need to add the following to the config.yaml file.
# The file path can be found by running the "supertokens --help" command

postgresql_table_names_prefix: "my_prefix"
```

<!--END_DOCUSAURUS_CODE_TABS-->

## For MongoDB

<!--DOCUSAURUS_CODE_TABS-->
<!--With Docker-->
```bash
 docker run \
    -p 3567:3567 \
__HIGHLIGHT__    -e MONGODB_COLLECTION_NAMES_PREFIX="my_prexif" \ __END_HIGHLIGHT__
    -d supertokens/supertokens-mongodb
```

<!--Without Docker-->
```yaml
# You need to add the following to the config.yaml file.
# The file path can be found by running the "supertokens --help" command

mongodb_collection_names_prefix: "my_prefix"
```

<!--END_DOCUSAURUS_CODE_TABS-->
