---
id: verify-session
title: Verify Session
hide_title: true
---

# Verify Session

### Use `"supertokens.middleware"`
```php
Route::middleware("supertokens.middleware")
```
- All APIs that require a valid session must use this middleware.
- CSRF protection will be applied to all non-GET and non-OPTIONS APIs automatically. If you want to disable this for a particular API, then use `"supertokens.middleware:false"`.
- If successful, it will create a [session object](./session-object) that can be accessed via `$request->supertokens`.
- This uses the [`getSession()`](../api-reference/get-session) function.

<div class="divider"></div>

### Example
```php
Route::middleware("supertokens.middleware")->post('/like-comment', function (Illuminate\Http\Request $request) {
    $session = $request->supertokens;
    return $session->getUserId();
});
```