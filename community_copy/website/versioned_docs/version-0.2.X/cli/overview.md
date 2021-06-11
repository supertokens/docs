---
id: version-0.2.X-overview
title: Overview
hide_title: true
original_id: overview
---

# CLI Overview

The SuperTokens CLI has the following general syntax:

```bash
supertokens [command] [--help] [--version]
```

- ```supertokens --help```: The help command
- ```supertokens --version```: Displays the version of the various installed components.

<div class="specialNote" style="margin-bottom: 20px">
If you are using Windows, you can only use the supertokens CLI using a terminal with Administrator privilege. 
</div>

### Commands
- [Start](./start)
    - ```supertokens start [options]```
    - Start an instance of SuperTokens.
- [List](./list)
    - ```supertokens list```
    - List information about all currently running SuperTokens instances.
- [Stop](./stop)
    - ```supertokens stop [options]```
    - Stops all (if no options are provided) or one specific instance of SuperTokens.
- [Load license](./load-license)
    - ```supertokens load-license [options]```
    - Loads a provided licenseKey file or ID.
- [Update](./update)
    - ```supertokens update [options]```
    - Update SuperTokens to the latest compatible or a specific version.
- [Uninstall](./uninstall)
    - ```supertokens uninstall```
    - Uninstalls SuperTokens.