---
id: init
title: Supertokens Init
hide_title: true
---

# `Supertokens.init(config)`

In your `index.js`, you need to call the Supertokens.init function with the following config.

```js
let Supertokens = require("supertokens-node");

Supertokens.init({
    supertokens?: {
        connectionURI: string,
        apiKey?: string
    };
    appInfo: {
        appName: string,
        apiDomain: string,
        websiteDomain: string,
        apiBasePath?: string,
        websiteBasePath?: string,
        apiGatewayPath?: string
    },
    recipeList: RecipeListFunction[],
    isInServerlessEnv?: boolean
})

```

### Parameters
- ``config``
  - `supertokens` (Optional)
    - `connectionURI`
      - type: `string`
      - description: The url link to supertokens core. If you are using Supertokens Saas service, you can find the connectionURI on your app's dashboard.
    - `apiKey` (Optional)
      - type: `string`
      - description: Use this to authenticate the backend APIs with the supertokens core
  - ``appInfo``
    - ``appName``
      - type: ``string``
      - description: Your app name
    - ``apiDomain``
      - type: ``string``
      - description: Your api domain. If you are using `http` server, make sure you also pass that correctly in this parammeter else it may end up setting it to `https` by default and things may not work as expected.
    - ``websiteDomain``
      - type: ``string``
      - description: Your website domain. If you are using `http` server, make sure you also pass that correctly in this parammeter else it may end up setting it to `https` by default and things may not work as expected.
    - ``apiBasePath`` (Optional)
      - type: ``string``
      - description: If your api server basePath is not `/`, do set this parameter to the correct value. Default: `/`
    - `apiGatewayPath` (Optional)
      - type: `string`
      - description: If using an API gateway / proxy, it may prepend a path to all your APIs. This path goes here.
    - ``websiteBasePath`` (Optional)
      - type: ``string``
      - description:If your website server basePath is not `/`, do set this parameter to the correct value. Default: `/`
  - ``isInServerlessEnv``(Optional)
    - type: ``boolean``
    - description: Pass boolean `true` if you are using this library in a serverless environment as it will help to optimise the performance. Default: `false`
  - ``recipeList``
    - type: ``array of RecipeListFunction``
    - description: list of Recipes you want to use. You need to pass atleast one Recipe to ths array. For more info on Recipes, checkout this [link](https://supertokens.com/docs/community/recipes)
