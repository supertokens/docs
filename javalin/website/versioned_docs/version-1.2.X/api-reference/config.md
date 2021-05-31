---
id: version-1.2.X-config
title: config
hide_title: true
original_id: config
---

# `config()`

### Modifiers
- These will override the ones specified in the `config.yaml` file:
    - ```withHosts(String hosts, String apiKey)``` - `;` separated string for all the locations of SuperTokens instances. An optional apiKey argument.
    - ```withAccessTokenPath(string)``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withRefreshApiPath(string)``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withCookieDomain(string)``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withCookieSecure(boolean)``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```withCookieSameSite(string)``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)

### Returns
- `void`

### Throws
- nothing