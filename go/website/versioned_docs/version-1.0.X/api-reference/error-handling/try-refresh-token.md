---
id: version-1.0.X-try-refresh-token
title: TryRefreshTokenError
hide_title: true
original_id: try-refresh-token
---

# ```TryRefreshTokenError```

- This error is thrown when:
    - Access token validation failed.
    - CSRF token validation failed. (If enable_anti_csrf in the config object is set to true)
- The way to handle this error is to NOT clear the cookies and send a session expired status code to your frontend.
- If you are building a website and get this error for a GET API that returns HTML, then you should reply with HTML & JS that calls your refresh session endpoint. Once that is successful, your frontend code should redirect the browser to call again the original GET API.

<div class="specialNote" style="margin-bottom: 20px">
We recommend you to use one of our frontend SDKs which will take care of calling your refresh token API for you.
</div>