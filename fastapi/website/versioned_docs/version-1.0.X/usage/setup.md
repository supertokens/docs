---
id: version-1.0.X-setup
title: Minimum setup
hide_title: true
original_id: setup
---

# Minimum setup (2 mins)

## 1) Initialize SuperTokens
- Initialize SuperTokens by passing your FastAPI app as parameter to the SuperTokens constructor
```python
from supertokens_fastapi import SuperTokens
from fastapi import FastAPI

app = FastAPI()
SuperTokens(app, hosts="http://localhost:3567;https://try.supertokens.com", api_key="key")
```

- All config values:
    - ```hosts: string``` - `;` separated string for all the locations of SuperTokens instances.
    - ```access_token_path``` - See `access_token_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```refresh_token_path``` - See `refresh_api_path` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```cookie_domain``` - See `cookie_domain` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```cookie_secure``` - See `cookie_secure` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```cookie_same_site``` - See `cookie_same_site` in the [config.yaml file](/docs/community/2.5.X/configuration/core#optional-config-values)
    - ```api_key``` - Specify any one of the API keys that you have set in the [config.yaml](/docs/community/2.5.X/configuration/core#optional-config-values) 
- There are more config values in the `config.yaml` file (for on premise) or on the SaaS dashboard. The values you set via the `init` function above will override those.

## 2) Create a refresh API
- This API will be used to get new access and refresh tokens (done automatically from our frontend SDK).
- Simply add `supertokens_session` dependency using `Depends` in the api.
```python
from supertokens_fastapi import supertokens_session, Session
from fastapi import Depends

@app.post('/session/refresh')
async def refresh(refresh_session: Session = Depends(supertokens_session)):
    return {} # send response
```

## 3) Error handling
- By default, SuperTokens takes care of handling session errors for you. However, you can [define your own logic](./custom-error-handling) as well.