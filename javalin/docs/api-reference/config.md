---
id: config
title: config
hide_title: true
---

# `config()`

### Modifiers
- These will override the ones specified in the `config.yaml` file:
    - ```withHosts(String hosts, String apiKey)``` - `;` separated string for all the locations of SuperTokens instances. An optional apiKey argument.
    - ```withAccessTokenPath(string)``` - See `access_token_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withRefreshApiPath(string)``` - See `refresh_api_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withCookieDomain(string)``` - See `cookie_domain` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withCookieSecure(boolean)``` - See `cookie_secure` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```withCookieSameSite(string)``` - See `cookie_same_site` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)

### Returns
- `void`

### Throws
- nothing