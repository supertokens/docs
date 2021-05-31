---
id: version-1.2.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Initialize SuperTokens
- Initialize supertokens by passing your flask app as parameter to SuperTokens constructor
```python
from supertokens_flask import SuperTokens
from flask import Flask

app = Flask(__name__)
SuperTokens(app)
```

## 2) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK).
- Simply add `@supertokens_middleware` decorator to the api.
```python
from supertokens_flask import supertokens_middleware

@app.route('/refresh', methods=['POST'])
@supertokens_middleware
def refresh():
    return '' # send response
```

## 3) Error handling
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom_error_handling) as well.

## 4) Change SuperTokens configurations
- If using our managed service, then you can change configuration values on your dashboard using the <div class="edit-conf-action-button">Edit configuration</div> button. Instead, if using the self hosted version, please make changes to the [config.yaml file](/docs/pro/configuration/core#optional-config-values).
- Set appropriate values for `cookie_domain` and `refresh_api_path`.
- You can also specify these values via `app.config` mentioned below.

## 5) Specify the location of SuperTokens Service and other configs
- Set `SUPERTOKENS_HOSTS` in config of your app.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- If using our managed service, you can get the connection information using the <div class="connect-action-button">Connect</div> button on your dashboard. For self hosted, the default location of SuperTokens is `localhost:3567`. If using the trial instance, use `https://try.supertokens.io`.
- You can also specify an API key if you have set one in the `config.yaml` file

```python
from supertokens_flask import SuperTokens
from flask import Flask

app = Flask(__name__)
app.config['SUPERTOKENS_HOSTS'] = "http://localhost:3567;https://try.supertokens.io"
app.config['SUPERTOKENS_API_KEY'] = "key"
SuperTokens(app)
```

- All config values (these will override the ones specified in the `config.yaml` file):
    - ```SUPERTOKENS_HOSTS: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```SUPERTOKENS_ACCESS_TOKEN_PATH: string``` - See `access_token_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```SUPERTOKENS_REFRESH_API_PATH: string``` - See `refresh_api_path` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```SUPERTOKENS_COOKIE_DOMAIN: string``` - See `cookie_domain` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```SUPERTOKENS_COOKIE_SECURE: bool``` - See `cookie_secure` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```SUPERTOKENS_COOKIE_SAME_SITE: string``` - See `cookie_same_site` in the [config.yaml file](/docs/pro/configuration/core#optional-config-values)
    - ```SUPERTOKENS_API_KEY``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/pro/configuration/core#optional-config-values) 