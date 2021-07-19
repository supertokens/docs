---
id: appinfo
title: About appInfo
hide_title: true
---

<!-- COPY DOCS -->
<!-- ./thirdpartyemailpassword/appinfo.md -->

# About appInfo

The `appInfo` object is to be specified on the frontend as well as on the backend (**must be the same values in both the places**). The various fields and their meaning is defined below:

<div class="additionalInformation" text="appName (Compulsory)">

This is the name of your application. It is used when sending password reset or email verification emails (in the default email design). An example of this is `appName: "GitHub"`.

</div>

<div class="additionalInformation" text="websiteDomain (Compulsory)">

This is the domain part of your website on which the SuperTokens' will operate on. By operate, we mean that the login UI will be shown on this domain and / or the session information will be stored under this domain. For example:
- For local development, you are likely using `localhost` with some port (ex `8080`). Then the value of this should be `"http://localhost:8080"`.
- If your website is `https://www.example.com`, then the value of this should be `"https://www.example.com"`.
- If your website is `https://example.com`, then the value of this should be `"https://example.com"`.
- If you have multiple sub domains, and your users login via `https://auth.example.com`, then the value of this should be `"https://auth.example.com"`.

By default, the login UI will be displayed on `{websiteDomain}/auth/*` (See about `websiteBasePath` to change the `/auth/*` part).

We need the domain information on the frontend for routing purposes, and on the backend so that we can generate correct email verification and password reset links.

</div>


<div class="additionalInformation" text="apiDomain (Compulsory)">

This is the domain part of your API endpoint that the frontend talks to. For example:
- For local development, you are likely using `localhost` with some port (ex `9000`). Then the value of this should be `"http://localhost:9000"`.
- If your frontend queries `https://api.example.com/*`, then the value of this should be `"https://api.example.com"`
- If your API endpoint is reached via `/api/*`, then the value of this is the same as the `websiteDomain` - since `/api/*` is equal to querying `{websiteDomain}/api/*`.

By default, our login widgets will query `{apiDomain}/auth/*` (See about `apiBasePath` to change the `/auth/*` part).

</div>

<div class="additionalInformation" text="websiteBasePath (Optional)">

By default, the login UI will be displayed on `{websiteDomain}/auth`. Other auth related UIs will be shown on `{websiteDomain}/auth/*`. If you want to change the `/auth` to something else, then you must set this value (remember to set this same value on the backend and frontend). For example:
- If you want the login UI to show on `{websiteDomain}/user/*`, then the value of this should be `"/user"`.
- If you are using a dedicated sub domain for auth, like `https://auth.example.com`, then you probably want the login UI to show up on `https://auth.example.com`. In this case, set this value to `"/"`.

</div>

<div class="additionalInformation" text="apiBasePath (Optional)">

By default, our frontend SDk will query `{apiDomain}/auth/*`. If you want to change the `/auth` to something else, then you must set this value (remember to set this same value on the backend and frontend). For example:
- If you have versioning in your API path and want to query `{apiDomain}/v0/auth/*`, then the value of this should be `"/v0/auth"`.
- If you want to scope our APIs not via `auth` but via other string like `supertokens`, then you can set the value of this to `"/supertokens"`. This means, our APIs will be exposed on `{apiDomain}/supertokens/*`.
- If you do not want to scope our APIs at all, then you can set the values of this to be `"/"`. This means our APIs for this recipe will be available on `{apiDomain}/*`

</div>

<div class="additionalInformation" text="apiGatewayPath (Optional - see if using an API gateway)">

If you are using an API gateway (like the one provided by AWS) or a proxy, it may add a path to your API endpoints to scope them for different development environments. 

For example, your APIs for development would be exposed via `{apiDomain}/dev/*`, and for production, they may be exposed via `{apiDomain}/prod/*`. Whilst the frontend would need to use the `/dev/` and `/prod/`, your backend code would not see that sub path (i.e. `/dev/` and `/prod/` are stripped away by the gateway). 

For these situations, you should set the `apiGatewayPath` to `/dev` or `/prod` based on env vars. For example:
- If your API gateway is using `/development` for scoping, and you want to expose the SuperTokens APIs on `/supertokens/*`, then set `apiGatewayPath: "/development"` & `apiBasePath: "/supertokens"`. This means that our frontend SDK will query `{apiDomain}/development/supertokens/*` to reach the endpoints exposed by us.
- If you set this and not `apiBasePath`, then the frontend SDK will query `{apiDomain}{apiGatewayPath}/auth/*` to reach the endpoints exposed by us.

The reason we have this distinction between `apiGatewayPath` and `apiBasePath` is that when routing, our backend SDK will not see the `apiGatewayPath` path from the request as they are stripped away by the gateway. Taking the above example, whilst the frontend queries `{apiDomain}/development/supertokens/*`, our backend SDK will see `{apiDomain}/supertokens/*`.

</div>

> You will most likely need to set different values of these fields across your dev env. You can achieve that using environment variables that determine if your app is running in dev / staging or prod
