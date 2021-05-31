---
id: uninstall
title: Uninstall
hide_title: true
---

# Uninstall command

```bash
supertokens uninstall [options]
```
Uninstalls SuperTokens

### Options
- ```--help```
    - Help for this command.
    - Example: ```supertokens uninstall --help```

## Manual uninstallation
### 1) Stop or kill all SuperTokens processes
```bash
supertokens stop
```
### 2) Delete the installation directory
You can find out the installation directory by running ```supertokens --help``` or the default location [here](../getting-started/installation#3-install-supertokens)

### 3) Delete the SuperTokens script
- Linux: ```/usr/bin/supertokens```
- Mac: ```/usr/local/bin/supertokens```
- Windows: ```C:\Windows\System32\supertokens.bat```
