---
id: version-2.5.X-setup
title: Setup Manually
hide_title: true
original_id: setup
---

# Setup manually

### 1) Install SuperTokens (only for self hosting)
[Sign up](/signup), and go to the on premises dashboard to download the SuperTokens zip file. Once downloaded, extract the zip and run the install commands.

<!--DOCUSAURUS_CODE_TABS-->
<!--Linux-->
```bash
# sudo is required so that the supertokens 
# command can be added to your PATH variable.

cd supertokens
sudo ./install [--path=path location] [--with-source]
```

<!--Mac-->
```bash
cd supertokens
./install [--path=path location] [--with-source]
```

<!--Windows-->
```batch
Rem run as an Administrator. This is required so that the supertokens 
Rem command can be added to your PATH.

cd supertokens
install.bat [--path=path location] [--with-source]
```
<!--END_DOCUSAURUS_CODE_TABS-->
The install command takes the following options:

- ```--path=path location```: (Optional) Specify the relative or absolute installation path for SuperTokens.
- ```--with-source```: (Optional) If this is set, then all third party dependencies will be installed along with their source. This option has no affect on the execution of SuperTokens.

### 2) Start SuperTokens (only for self hosting)
Running the following command will start the service. **SuperTokens will use an in-memory database if you do not provide the relevant database config values to it.**
```bash
supertokens start
```
Learn more about the CLI [here](../../cli/overview).

### 3) Integrate into your app
- Go to the [Backend SDK Integration](../../backend-integration) section to see documentation for integrating SuperTokens with your backend APIs
- Go to the [Frontend SDK Integration](../../frontend-integration) section to see documentation for integrating SuperTokens with your frontend clients.

-----------

## Connecting to your database (only for self hosting)
Please visit the relevant database page under the [Database Setup section](../database-setup/mysql)

## Manage license keys (only for self hosting)
Go to the [About License Keys](../../about-license-keys) section to learn about how you can manage license keys.