---
id: constructor
title: constructor
hide_title: true
---
# `Supertokens(app, hosts, api_key, access_token_path, refresh_token_path, cookie_domain, cookie_secure, cookie_same_site)`

### Parameters
- ```app: FastAPI```: your app instance
- ```hosts: str``` - `;` separated string for all the locations of SuperTokens instances.
- ```access_token_path: str``` - See `access_token_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
- ```refresh_token_path: str``` - See `refresh_api_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
- ```cookie_domain: str``` - See `cookie_domain` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
- ```cookie_secure: bool``` - See `cookie_secure` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
- ```cookie_same_site: str``` - See `cookie_same_site` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
- ```api_key``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/community/2.5.X/configuration/core#optional-config-values). 

### Returns
- `None`

### Throws
- nothing