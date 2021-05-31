---
id: version-1.4.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Initialize SuperTokens
- Initialize SuperTokens by passing your flask app as parameter to SuperTokens constructor
```python
from supertokens_flask import SuperTokens
from flask import Flask

app = Flask(__name__)
app.config['SUPERTOKENS_HOSTS'] = "http://localhost:3567;https://try.supertokens.io"
app.config['SUPERTOKENS_API_KEY'] = "key"
SuperTokens(app)
```

- All config values:
    - ```SUPERTOKENS_HOSTS: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```SUPERTOKENS_ACCESS_TOKEN_PATH: string``` - See `access_token_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```SUPERTOKENS_REFRESH_API_PATH: string``` - See `refresh_api_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```SUPERTOKENS_COOKIE_DOMAIN: string``` - See `cookie_domain` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```SUPERTOKENS_COOKIE_SECURE: bool``` - See `cookie_secure` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```SUPERTOKENS_COOKIE_SAME_SITE: string``` - See `cookie_same_site` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```SUPERTOKENS_API_KEY``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/community/2.5.X/configuration/core#optional-config-values)
- There are more config values in the `config.yaml` file (for on premise) or on the SaaS dashboard. The values you set via the `init` function above will override those.

## 2) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK).
- Simply add `@supertokens_middleware` decorator to the api.
```python
from supertokens_flask import supertokens_middleware

@app.route('/session/refresh', methods=['POST'])
@supertokens_middleware
def refresh():
    return '' # send response
```

## 3) Error handling
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.