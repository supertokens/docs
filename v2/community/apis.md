---
id: apis
title: API Reference
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./community/apis.md -->

# API Reference

:::important
- This section is only for detailed API reference. This section will NOT provide a step by step guide.
- For a step by step guide to implementing SuperTokens, please [pick a recipe](/docs/community/recipes) and follow the setup instructions in there.
:::


You should directly interact with the APIs if:
- You are building your own frontend and want to query APIs exposed via our backend SDK.
- You are NOT using our backend SDK and want to query the core directly.

Please make sure that you have seen the [architecture page](/docs/community/architecture).

## Core driver interface
### [Open API Spec](https://app.swaggerhub.com/apis/supertokens/CDI)
This is the API spec used by the backend SDK to query the SuperTokens Core.

To know which version you should see:
- Check the version of the core you are running (for managed service, visit the dashboard, else run `supertokens --version` command)
- Go to the [supertokens-core GitHub page](https://github.com/supertokens/supertokens-core)
- Switch to the branch that matches the version of the core your running
- Open the file called `coreDriverInterfaceSupported.json`
- In there, you will see an array of `X.Y` values, pick the latest one, and see the API spec for that.

## Frontend driver interface
### [Open API Spec](https://app.swaggerhub.com/apis/supertokens/FDI)
This is the API spec used by the frontend SDK to query the backend SDK APIs.

To know which version you should see:
- Go to our GitHub page of the backend or frontend SDK you are using
- Switch to the branch that matches the version of the SDK
- Open the file called `frontendDriverInterfaceSupported.json`
- In there, you will see an array of `X.Y` values, pick the latest one, and see the API spec for that.
