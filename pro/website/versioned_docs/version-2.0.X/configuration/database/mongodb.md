---
id: version-2.0.X-mongodb
title: MongoDB
hide_title: true
original_id: mongodb
---

# MongoDB Configurations

### Compulsory config values
- **mongodb_connection_uri**: 
    - Description: This is the connection uri to connect to a mongodb instance or cluster as per [MongoDB documents](https://docs.mongodb.com/manual/reference/connection-string/). **If using a Windows machine, please do not use the `mongodb+srv://` format.**
    - Example: ```mongodb_connection_uri: "mongodb://root:root@localhost:27017"```

### Optional config values
- **mongodb_database_name**:
    - Description: SuperTokens will use this database to store information.
    - Default: ```auth_session```
    - Example: ```mongodb_database_name: "auth_session"```
- **mongodb_key_value_collection_name**:
    - Description: This is the name of the collection which will be used as a key value store for SuperTokens
    - Default: ```key_value```
    - Example: ```mongodb_key_value_collection_name: "key_value"```
- **mongodb_session_info_collection_name**:
    - Description: This is the name of the collection that will store the session info for users.
    - Default: ```session_info```
    - Example: ```mongodb_session_info_collection_name: "session_info"```
- **mongodb_past_tokens_collection_name**:
    - Description: Specify the name of the collection that will store old tokens.
    - Default: ```past_tokens```
    - Example: ```mongodb_past_tokens_collection_name: "past_tokens"```