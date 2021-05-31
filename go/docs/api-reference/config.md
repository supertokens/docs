---
id: config
title: Config
hide_title: true
---

# `Config(config ConfigMap) error`

### Parameters
- `config`:
    ```
    type ConfigMap struct {
        Hosts           string
        AccessTokenPath string
        RefreshAPIPath  string
        CookieDomain    string
        CookieSecure    *bool
        CookieSameSite  string
        APIKey          string
    }
    ```
    - These will override the ones specified in the `config.yaml` file:
    - ```Hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```AccessTokenPath: string``` - See `access_token_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```RefreshAPIPath: string``` - See `refresh_api_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```CookieDomain: string``` - See `cookie_domain` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```CookieSecure: *bool``` - See `cookie_secure` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```CookieSameSite: string``` - See `cookie_same_site` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```APIKey``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/community/2.5.X/configuration/core#optional-config-values) 

### Returns
- nothing