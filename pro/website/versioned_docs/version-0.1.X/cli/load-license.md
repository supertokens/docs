---
id: version-0.1.X-load-license
title: Load License
hide_title: true
original_id: load-license
---

# Load license command

```bash
supertokens load-license [options]
```
Loads a provided licenseKey file if the ```--path``` option is used, otherwise downloads a license key whose license key ID is specified via the ```--id``` option.

### Options
- ```--path```
    - Specify a licenseKey path. This path can be relative or absolute. A licenseKey can be obtained from your SuperTokens dashboard. Any existing licenseKey will get overwritten.
    - Example: ```supertokens load-license --path=./downloads/licenseKey```
- ```--id```
    - Specify a licenseKey ID that you want to load. A licenseKey ID can be obtained from your SuperTokens dashboard. Any existing licenseKey will get overwritten.
    - Example: ```supertokens load-license --id=bdsfih95-2b9f-4454-ccz3-3c8d3412b6bc0_v1```
- ```--help```
    - Help for this command.
    - Example: ```supertokens load-license --help```