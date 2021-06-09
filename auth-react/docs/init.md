---
slug: /
---

# Call the `init` function

In your `App.js` file, import SuperTokens and call the `init` function.

```js {3-7}
import SuperTokens from "supertokens-auth-react";

SuperTokens.init({
 	appInfo: {
        appName: "YOUR APP NAME", // Example: "SuperTokens",
        apiDomain: "YOUR API DOMAIN", // Example: "https://api.supertokens.io",
        websiteDomain: "YOUR WEBSITE DOMAIN" // Example: "https://supertokens.io"
	},
});
```

### App Info values

- **appName**:
    - Description: This value represent the name of your application.
    - Default: ```""```
    - Example: ```appName: "SuperTokens"```

- **apiDomain**:
    - Description: This is your API domain that is used to serve resources to your users.
    - Default: ```""```
    - Example: ```apiDomain: "https://api.supertokens.io"```

- **websiteDomain**:
    - Description: This is your website URL.
    - Default: ```""```
    - Example: ```websiteDomain: "https://supertokens.io"```

- **apiBasePath**:
    - Description: This is the base path prefixes all the back end routes managed by SuperTokens.
    - Default: ```"/auth"```
    - Example: ```apiBasePath: "/api/v3/auth"```
    - Optional

- **websiteBasePath**: 
    - Description: This is the base path prefixes all the front end routes managed by SuperTokens.
    - Default: ```"/auth"```
    - Example: ```websiteBasePath: "/authentication"```
    - Optional

 - **apiGatewayPath**:
    - Description: If using an API gateway / proxy, it may prepend a path to all your APIs. This path goes here.
    - Default: `""`
    - Example: `apiGatewayPath: "/dev"`
    - Optional

:::info
If you try to refresh your website, you might see the following error "Please provide at least one recipe to the supertokens.init function call" in your console. Make sure to read about the email password following section.
:::
