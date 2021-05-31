---
id: version-2.3.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Initialise SuperTokens
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node");

let app = express();

app.use(supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.io",
    apiKey: "key"
}));
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

let app = express();

app.use(supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.io",
    apiKey: "key"
}));
```
<!--END_DOCUSAURUS_CODE_TABS-->

- All config values:
    - ```hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```accessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```refreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSecure: boolean``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```apiKey``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/pro/configuration/core#optional-config-values) 
- There are more config values in the `config.yaml` file (for on premise) or on the SaaS dashboard. The values you set via the `init` function above will override those.
- The `init` function returns a middleware that automatically manages refreshing of a session.


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