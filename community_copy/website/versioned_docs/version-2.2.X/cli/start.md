---
id: version-2.2.X-start
title: Start
hide_title: true
original_id: start
---

# Start command

```bash
supertokens start [options]
```
Start an instance of SuperTokens. By default the process will be started as a daemon.

### Options
- ```--with-space```
    - Sets the amount of space, in MB, to allocate to the JVM.
    - Example: ```supertokens start --with-space=200``` allocates 200MB for the JVM.
- ```--with-config```
    - Specify the location of the config file to load. Can be either relative or absolute.
    - Example: ```supertokens start --with-config=/usr/config.yaml```
- ```--port```
    - Sets the port on which this instance of SuperTokens should run.
    - Example: ```supertokens start --port=8080```
- ```--host```
    - Sets the host on which this instance of SuperTokens should run.
    - Example: ```supertokens start --host=192.168.0.1```
- ```--foreground```
    - Runs this instance of SuperTokens in the foreground (not as a daemon).
    - Example: ```supertokens start --foreground```
- ```--help```
    - Help for this command.
    - Example: ```supertokens start --help```