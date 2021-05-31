---
id: version-1.0.X-installation
title: Installation
hide_title: true
original_id: installation
---

# Installation

To get started with SuperTokens, you first need to install and run the SuperTokens core. Please follow the steps mentioned below:

### 1) Sign up
- Sign up by visiting [this page](https://supertokens.io/signup)
- The sign up form asks you to choose a database - this is where your app's session data will be stored.

### 2) Go to your [dashboard](/dashboard) to download SuperTokens core
- For the listed app, select for which platform / OS and which version of SuperTokens you would like to download.
- You can also change the default app name.
- Click on the download button. This will start a zip download

### 3) Install SuperTokens
Once downloaded, extract the zip file and run the install commands.

<!--DOCUSAURUS_CODE_TABS-->
<!--Linux-->
```bash
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
Rem run as an Administrator
cd supertokens
install.bat [--path=path location] [--with-source]
```
<!--END_DOCUSAURUS_CODE_TABS-->
The install command takes the following options:

- ```--path=path location```: Specify the relative or absolute installation path for SuperTokens. If not provided, the installation path will be as follows:
    - Linux: ```/usr/lib/supertokens/```
    - Mac: ```/usr/local/etc/supertokens/```
    - Windows: ```C:\Program Files\supertokens\```
- ```--with-source```: If this is set, then all third party dependencies will be installed along with their source. This option has no affect on the execution of SuperTokens.

<div class="specialNote" style="margin-bottom: 20px">
After installation, you can safely delete the downloaded zip and the extracted folder.
</div>

### 4) Configure SuperTokens
Before you can start SuperTokens, please set the relevant [configuration options](../configuration/core).

### 5) Setup database
Please visit the relevant database page under the [Database Setup section](./database-setup/mysql)

### 6) Check installation
Verify that SuperTokens has been installed correctly by running the following command:
```bash
supertokens --version
```

### 7) Other CLI commands
To view the list of available commands, for example to start, stop, list SuperTokens processes, run:
```bash
supertokens --help
```
Head over to the [CLI docs](../cli/overview) to learn more about the available commands.

### 8) Integration with APIs and frontend
- Go to the [Driver Integration](../driver-integration) section to see documentation for integrating SuperTokens with your backend APIs
- Go to the [Frontend SDK Integration](../frontend-integration) section to see documentation for integrating SuperTokens with your frontend clients.

### 9) Manage payments and license keys
- Go to the [About License Keys](../about-license-keys) section to learn about how you can manage license keys.
- Go to the [About Payments](../about-payments) section to learn about how payments will work.