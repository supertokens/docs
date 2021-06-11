---
id: version-0.2.X-update
title: Update
hide_title: true
original_id: update
---
# Update command

```bash
supertokens update [options]
```
Update SuperTokens to the latest compatible (if no options are provided) or a specific version. Updating involves fetching new versions of the core, plugin-interface and plugin modules. Depending on the version specified, you may also need to check for changes in the driver and frontend SDK versions. To see a compatibility matrix, please visit [this page](../compatibility).

### Options
- ```--core```
    - Specify a version for the core module of SuperTokens to change to. Either in ```X.Y``` or ```X.Y.Z``` format.
    - Example: ```supertokens update --core=2.1.2``` or ```supertokens update --core=2.1```
- ```--storage```
    - Specify a version for the storage module of SuperTokens to change to. Either in ```X.Y``` or ```X.Y.Z``` format.
    - Example: ```supertokens update --storage=2.1.2``` or ```supertokens update --storage=2.1```
- ```--help```
    - Help for this command.
    - Example: ```supertokens update --help```