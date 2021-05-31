---
id: version-2.1.X-installation
title: Installation
hide_title: true
original_id: installation
---

# Installation

### 1) Install SuperTokens
<p>To get started with SuperTokens, you first need to <a onclick="aTagWithAnalytics('/signup', 'button_documentation_installation_install', {option_clicked: 'installnormal'})" href="#">install</a> and run the SuperTokens core. If you want to use our Docker image, please go to the <a onclick="aTagWithAnalytics('./installation-with-docker', 'button_documentation_installation_install', {option_clicked: 'installwithdocker'})" href="#">Installation With Docker</a> section.</p>

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

### 2) Configure SuperTokens
Before you can start SuperTokens, please set the relevant [configuration options](../configuration/core).

### 3) Setup database
Please visit the relevant database page under the [Database Setup section](./database-setup/mysql)

### 4) Check installation
Verify that SuperTokens has been installed correctly by running the following command:
```bash
supertokens --version
```

### 5) Other CLI commands
To view the list of available commands, for example to start, stop, list SuperTokens processes, run:
```bash
supertokens --help
```
Head over to the [CLI docs](../cli/overview) to learn more about the available commands.

### 6) Integration with APIs and frontend
- Go to the [Backend SDK Integration](../backend-integration) section to see documentation for integrating SuperTokens with your backend APIs
- Go to the [Frontend SDK Integration](../frontend-integration) section to see documentation for integrating SuperTokens with your frontend clients.