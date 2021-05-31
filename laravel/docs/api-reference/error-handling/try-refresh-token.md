---
id: try-refresh-token
title: SuperTokensTryRefreshTokenException
hide_title: true
---

# ```SuperTokensTryRefreshTokenException```

- This error is thrown when:
    - Access token validation failed.
    - CSRF token validation failed. (If `enable_anti_csrf` in the config object is set to `true`)
- The way to handle this error is to send a session expired status code to your frontend.
- If you are building a website and get this error for a GET API that returns HTML, then you should reply with HTML & JS that calls your refresh session endpoint. Once that is successful, your frontend code should redirect the browser to call again the original GET API.

<div class="specialNote" style="margin-bottom: 20px">
We recommend you to use one of our frontend SDKs which will take care of calling your refresh token API for you.
</div>