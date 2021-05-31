---
id: version-0.2.X-start
title: Start
hide_title: true
original_id: start
---

# Start command

```bash
supertokens start [dev | production] [options]
```
Start an instance of SuperTokens for development or production use. By default the process will be started as a daemon.

### Starting in a development environment
```bash
supertokens start dev [options]
```
- You can start an unlimited number of parallel instances in this mode.

### Starting in a production environment
```bash
supertokens start production [options]
```
- <b><font class="proFeatureText">You can start only one instance (in parallel) in this mode.</font></b>
- If you want to run more than one instance, please upgrade to the pro version.

### Options
- ```--with-space```
    - Sets the amount of space, in MB, to allocate to the JVM.
    - Example: ```supertokens start dev --with-space=200``` allocates 200MB for the JVM.
- ```--with-config```
    - Specify the location of the config file to load. Can be either relative or absolute.
    - Example: ```supertokens start dev --with-config=/usr/config.yaml```
- ```--port```
    - Sets the port on which this instance of SuperTokens should run.
    - Example: ```supertokens start dev --port=8080```
- ```--host```
    - Sets the host on which this instance of SuperTokens should run.
    - Example: ```supertokens start dev --host=192.168.0.1```
- ```--foreground```
    - Runs this instance of SuperTokens in the foreground (not as a daemon).
    - Example: ```supertokens start dev --foreground```
- ```--help```
    - Help for this command.
    - Example: ```supertokens start --help```