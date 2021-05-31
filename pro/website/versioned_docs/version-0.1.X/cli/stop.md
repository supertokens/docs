---
id: version-0.1.X-stop
title: Stop
hide_title: true
original_id: stop
---

# Stop command

```bash
supertokens stop [options]
```
Stops all (if no options are provided) or one specific instance of SuperTokens.

### Options
- ```--id```
    - Stop an instance of SuperTokens that has a specific PID. An instance's PID can be obtained via the ```supertokens list``` command.
    - Example: ```supertokens stop --id=7634```
- ```--help```
    - Help for this command.
    - Example: ```supertokens stop --help```