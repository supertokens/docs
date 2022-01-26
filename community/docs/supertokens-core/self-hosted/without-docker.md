---
id: without-docker
title: Self Hosted setup without Docker
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./community/docs/supertokens-core/self-hosted/without-docker.md -->

# Self-hosted without Docker

### 1) Install SuperTokens 🛠️
Go to the [open source download page](/use-oss), scroll to the "Download the binary" section, choose your backend framework and database, and download the SuperTokens zip file for your OS. Once downloaded, extract the zip and run the install commands.

<!--DOCUSAURUS_CODE_TABS-->
<!--Linux-->
```bash
# sudo is required so that the supertokens 
# command can be added to your PATH variable.

cd supertokens
sudo ./install
```

<!--Mac-->
```bash
cd supertokens
./install
```

> You may get an error like "java cannot be opened because the developer cannot be verified". To solve this, visit System Preferences > Security & Privacy > General Tab, and then click on the Allow button at the bottom. Then retry the command above.

<!--Windows-->
```batch
Rem run as an Administrator. This is required so that the supertokens 
Rem command can be added to your PATH.

cd supertokens
install.bat
```
<!--END_DOCUSAURUS_CODE_TABS-->


### 2) Start SuperTokens 🚀
Running the following command will start the service.
```bash
supertokens start [--host=...] [--port=...]
```
- The above command will start the container with an in-memory database.
- When you are ready to connect it to your database, please visit the [Database setup section](../database-setup/mysql)
- To see all available options please run `supertokens start --help`


### 3) Testing that the service is running 🤞
Open a browser and visit `http://localhost:3567/hello`. If you see a page that says `Hello` back, then SuperTokens was started successfully!

If you are having issues with starting the docker image, please feel free to reach out to us [over email](mailto:founders@supertokens.io) or [via Discord](https://supertokens.com/discord).


### 4) Stopping SuperTokens 🛑
```bash
supertokens stop
```

# Connecting the backend SDK with SuperTokens 🔌
- The default `host` and `port` for SuperTokens is `localhost:3567`. You can change this by passing `--host` and `--port` options to the `start` command. 
- There is no API key by default. You can add one visiting the [API keys section](../../common-customizations/core/api-keys)
- Assuming the default, the connection info will go in the `supertokens` object in the `init` function on your backend:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->

```js
let supertokens = require("supertokens-node");

supertokens.init({
__HIGHLIGHT__    supertokens: {
        connectionURI: "http://localhost:3567"
    }, __END_HIGHLIGHT__
    appInfo: {...},
    recipeList: [...]
});
```
<!--END_DOCUSAURUS_CODE_TABS-->
