---
id: version-1.0.X-setup
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

## 4) Change SuperTokens `config.yaml`
- Set appropriate values for `cookie_domain` and `refresh_api_path` in the SuperTokens [config.yaml file](/docs/pro/configuration/core#optional-config-values).

## 5) (Optional) Specify the location of SuperTokens Service
- Set `SUPERTOKENS_HOSTS` in config of your app.
- You can provide multiple addresses in case you are running more than one SuperTokens service (as shown below).
- The default location of SuperTokens is `localhost:3567`
```python
from supertokens_flask import SuperTokens
from flask import Flask

app = Flask(__name__)
app.config['SUPERTOKENS_HOSTS'] = [{
    'hostname': 'localhost',
    'port': 3567
}, {
    'hostname': 'example.com',
    'port': 8080
}]
SuperTokens(app)
```