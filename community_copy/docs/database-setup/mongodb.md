---
id: mongodb
title: If using MongoDB
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./community/docs/database-setup/mongodb.md -->

# MongoDB setup

> This is needed only if you are running the SuperTokens core yourself.
> We support only session management with MongoDB. Login support will be added in the future.

## 1️⃣ Connect SuperTokens to your database 🔌

<!--DOCUSAURUS_CODE_TABS-->
<!--With Docker-->
```bash
docker run \
	-p 3567:3567 \
__HIGHLIGHT__    -e MONGODB_CONNECTION_URI="mongodb://root:root@192.168.1.2:27017/dbName" \ __END_HIGHLIGHT__
    -d supertokens/supertokens-mongodb
```

<!--Without Docker-->
```yaml
# You need to add the following to the config.yaml file.
# The file path can be found by running the "supertokens --help" command

mongodb_connection_uri: "mongodb://root:root@192.168.1.2:27017/dbName"
```
<!--END_DOCUSAURUS_CODE_TABS-->


## 2️⃣ Test the connection 🤞
To test, **start SuperTokens** and run the following query in your database
```cql
db.key_value.find()
```
If you see at least one row, it means that the connection has been successfully completed! 🥳🎉
