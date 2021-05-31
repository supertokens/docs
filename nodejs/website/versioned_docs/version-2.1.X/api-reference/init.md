---
id: version-2.1.X-init
title: init
hide_title: true
original_id: init
---

# `init(config)`

### Parameters
- `config`:
    - These will override the ones specified in the `config.yaml` file:
    - ```hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```accessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```refreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSecure: *bool``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```cookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)

### Returns
- `void`

### Throws
- nothing