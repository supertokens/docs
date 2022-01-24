---
id: version-2.4.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

> You are viewing an older version of the docs. This is only relevant if the core version you are using is <= v2.5. Please visit the [more recent docs](/docs) for newer versions of the core.

# Minimum setup (2 mins)

## 1) Initialise SuperTokens
<!--DOCUSAURUS_CODE_TABS-->
<!--Javascript-->
```js
let supertokens = require("supertokens-node");

let app = express();

app.use(supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.com",
    apiKey: "key"
}));
```
<!--Typescript-->
```ts
import * as supertokens from "supertokens-node";

let app = express();

app.use(supertokens.init({
    hosts: "http://localhost:3567;https://try.supertokens.com",
    apiKey: "key"
}));
```
<!--END_DOCUSAURUS_CODE_TABS-->

- All config values:
    - ```hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```accessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```refreshTokenPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```cookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```cookieSecure: boolean``` - See `cookie_secure` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```cookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```apiKey``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/community/2.5.X/configuration/core#optional-config-values) 
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
    res.status(500).send(err);
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