---
id: version-0.1.X-troubleshooting
title: Troubleshooting
hide_title: true
original_id: troubleshooting
---

# Troubleshooting

## MySQL Errors
### Error: Client does not support authentication protocol
- Run the following command in your MySQL shell:
    ```SQL
    ALTER USER 'user_name' IDENTIFIED WITH mysql_native_password BY 'some_password';
    ```

## Cookie errors
### I cannot see any / some cookies in my browser
- Make sure you have set the correct domain for the cookies. For example, is your website domain is ```example.com``` and your API domain is ```api.example.com```, then your cookie domain should be ```.example.com``` or ```api.example.com```.
- If you are using chrome, then a cookie will only be visible in the inspector if the domain and path of the cookie match the domain and path of the currently loaded URL.

### The cookies are showing on my browser, but not getting sent to the APIs
- One reason could be that your cookie path does not cover your API path. For example, if your cookie path is ```/api```, then that cookie will only be sent to all APIs that are ```/api/*```.
- If you are not using HTTPS, make sure to set the secure flag to ```false``` in the core config.

## CORS errors
### Blocked by CORS policy: The value of the 'Access-Control-Allow-Credentials' header in the response is '' which must be 'true'
- This error occurs when your API domain is different than your website domain (even if only the port numbers are different).
- To solve this error, add the following header to your response from your APIs:
    ```
    Access-Control-Allow-Credentials: true
    ```

## CLI errors
### ```supertokens list``` command throws ```java.net.ConnectException: Connection refused (Connection refused)```
- This happens if a SuperTokens process could not stop properly.
- To fix this:
    - Go to the ```<installation directory>/.started/``` folder.
    - delete the file in this directory that corresponds to the host-port of the process that should have been stopped.
