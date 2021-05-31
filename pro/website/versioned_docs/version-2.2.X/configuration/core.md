---
id: version-2.2.X-core
title: Core
hide_title: true
original_id: core
---

# Core configurations

### Config file location
The ```config.yaml``` file is located in the SuperTokens installation directory. By default, this location is:
- Linux: ```/usr/lib/supertokens/config.yaml```
- Mac: ```/usr/local/etc/supertokens/config.yaml```
- Windows: ```C:\Program Files\supertokens\config.yaml```

> Changes to the config values below will require you to restart the SuperTokens instance as well as your backend API process.

### Optional config values
- **refresh_api_path**: 
    - Description: Set this to be the path for your refresh API. For example, if your refresh API URL is ```"https://api.example.com/refresh"```, then the value of this param should be ```"/refresh"```
    - Default: ```"/refresh"```
    - Example: ```refresh_api_path: "/session/refresh"```
- **cookie_domain**: 
    - Description: This is the domain to set for the session cookies. This should be equal to the domain of your APIs. For example (api.example.com). Do not set any port here and do not put ```http://``` or ```https://```
    - Default: ```"localhost"```
    - Example: ```cookie_domain: "api.example.com"```
- **port**: 
    - Description: The port at which SuperTokens service runs.
    - Default: ```3567```
    - Example: ```port: 8080```
- **host**: 
    - Description: The host on which SuperTokens service runs. Values here can be ```localhost```, ```example.com```, ```0.0.0.0``` or any IP address associated with your machine.
    - Default: ```localhost```
    - Example: ```host: "192.168.0.1"```
- **access_token_validity**:
    - Description: Time in **seconds** for how long an access token is valid for.
    - Default: ```3600```
    - Example: ```access_token_validity: 60```
- **access_token_blacklisting**:
    - Description: If ```true```, allows for immediate revocation of any access token. Keep in mind that setting this to true will result in a db query for each API call that requires authentication.
    - Default: ```false```
    - Example: ```access_token_blacklisting: true```
- **access_token_path**:
    - Description: Set this to the prefix for all your APIs that require authentication. For example, if your APIs have the path ```"/api/a"```, ```"/api/b"``` etc set this to ```"/api"``` or to ```"/"```
    - Default: ```"/"```
    - Example: ```access_token_path: "/"```
- **access_token_signing_key_dynamic**:
    - Description:  If this is set to ```true```, the JWT (access token) signing key will change every fixed interval of time based on the value of ```access_token_signing_key_update_interval```.
    - Default: ```true```
    - Example: ```access_token_signing_key_dynamic: true```
- **access_token_signing_key_update_interval**:
    - Description: Time in hours for how frequently the JWT (access token) signing key will change. This value only makes sense if ```access_token_signing_key_dynamic``` is ```true```.
    - Default: ```24```
    - Example: ```access_token_signing_key_update_interval: 24```
- **enable_anti_csrf**:
    - Description: Protects against CSRF attack if this is set to ```true```.
    - Default: ```true```
    - Example: ```enable_anti_csrf: true```
- **refresh_token_validity**:
    - Description: Time in mins for how long a refresh token is valid for.
    - Default: ```144000```
    - Example: ```refresh_token_validity: 144000```
- **info_log_path**:
    - Description: Give the path to a file (on your local system) in which the SuperTokens service can write ```INFO``` logs to. Set it to ```"null"``` if you want it to log to standard output instead.
    - Default: ```<installation directory>/logs/info.log```
    - Example: ```info_log_path: "/info.log"```
- **error_log_path**:
    - Description: Give the path to a file (on your local system) in which the SuperTokens service can write ```ERROR``` logs to. Set it to ```"null"``` if you want it to log to standard error instead.
    - Default: ```<installation directory>/logs/error.log```
    - Example: ```error_log_path: "/error.log"```
- **cookie_secure**:
    - Description: Sets if the cookies are secure or not. 
    - Default: ```false```
    - Example: ```cookie_secure: true```
- **cookie_same_site**:
    - Description: Sets the sameSite attribute for cookies issued by SuperTokens. The values can be `"none" | "lax" | "strict"`
    - Default: `"none"`
    - Example: `cookie_same_site: "lax"`
- **max_server_pool_size**:
    - Description: Sets the max thread pool size for incoming http server requests.
    - Default: ```10```
    - Example: ```max_server_pool_size: 10```
- **session_expired_status_code**:
    - Description: The HTTP status code your backend APIs send on session expiry
    - Default: ```440```
    - Example: ```session_expired_status_code: 403```