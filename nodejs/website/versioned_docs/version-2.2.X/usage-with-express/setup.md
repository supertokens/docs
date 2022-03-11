---
id: version-2.2.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK). 
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node");

let app = express();
app.post("/refresh", supertokens.middleware(), (req, res) => {
    res.send("");
});
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

let app = express();

app.post("/refresh", supertokens.middleware(), (req, res) => {
    res.send("");
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 2) Add an error handler
- **Add this at the end of all your routes, but before your error middleware.**
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node");

let app = express();

// add all your routes here...

// add SuperTokens error middleware
app.use(supertokens.errorHandler());

// add your error middleware
app.use((err, req, res, next) => {
    res.send(500).send(err);
})
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

let app = express();

// add all your routes here...

// add SuperTokens error middleware
app.use(supertokens.errorHandler());

// add your error middleware
app.use((err, req, res, next) => {
    res.status(500).send(err);
})
```
<!--END_DOCUSAURUS_CODE_TABS-->

## 3) Change SuperTokens configurations
- If using our managed service, then you can change configuration values on your dashboard using the <div class="edit-conf-action-button">Edit configuration</div> button. Instead, if using the self hosted version, please make changes to the [config.yaml file](/docs/pro/configuration/core#optional-config-values).
- Set appropriate values for `cookie_domain` and `refresh_api_path`.
- You can also specify these values via the `supertokens.init` function mentioned below.

## 4) Specify the location of SuperTokens Service and other configs
- Call this somewhere close to where you initialise the app.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- If using our managed service, you can get the connection information using the <div class="connect-action-button">Connect</div> button on your dashboard. For self hosted, the default location of SuperTokens is `localhost:3567`. If using the trial instance, use `https://try.supertokens.com`.
- You can also specify an API key if you have set one in the `config.yaml` file
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node");

let app = express();

supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.com",
    apiKey: "key"
});
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

let app = express();

supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.com",
    apiKey: "key"
});
```
<!--END_DOCUSAURUS_CODE_TABS-->

- All config values (these will override the ones specified in the `config.yaml` file):
    - ```hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```accessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```refreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSecure: boolean``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```apiKey``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/pro/configuration/core#optional-config-values) 