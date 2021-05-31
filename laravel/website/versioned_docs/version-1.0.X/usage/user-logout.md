---
id: version-1.0.X-user-logout
title: Logout / Revoke Session
hide_title: true
original_id: user-logout
---

# Logout / Revoke Session

### `revokeSession` function: [API Reference](../api-reference/session-object/revoke-session)
```php
$session->revokeSession()
```
- This function deletes the session from the database and clears relevant auth cookies
- If using blacklisting, this will immediately invalidate the JWT access token.

<div class="divider"></div>

### Example
```php
Route::middleware("supertokens.middleware")->post("/logout", function (Request $request) {
    $session = $request->supertokens;
    $session->revokeSession();

    return "Success! Go to login page";
});
```