---
id: version-5.0.X-migration
title: Migration from old version
hide_title: true
original_id: migration
---

# Migration from the old version of ```supertokens-website```

## From `4.X.X` to >= `4.5.X`
- Change all import statements from `"supertokens-website/axios"` to `"supertokens-website"`
- For `axios`, we have renamed `makeSuper()` to `addAxiosInterceptors()`
- If using with `<scrip>` tag, we have changed `supertokens.axios.*` or `supertokens.fetch.*` to `supertokens.*`.
- We no longer support using this library without interceptors for ease of use.
- We have removed the `viaInterceptors` param from the `init` function call.
- We have removed `refreshTokenUrl` param, and replaced it with `apiDomain` and `apiBasePath`. The refresh API will always be on `apiDomain + apiBasePath + "/session/refresh"`
- We have renamed `websiteRootDomain` to `cookieDomain` - as that is more clear.

## From version `4.1.X` to `4.2.X`
### Using ```fetch```
- Change to the ```init``` function signature. See [here](./fetch/init).
- Default session expired code is `401`. Previously it was `440`. If using `440`, then be sure to set `sessionExpiredStatusCode` to `440` in the `init` call
- No need to add `credentials: "include"` to your API calls anymore. It is automatically inserted.

### Using ```axios```
- Change to the ```init``` function signature. See [here](./axios/init).
- Default session expired code is `401`. Previously it was `440`. If using `440`, then be sure to set `sessionExpiredStatusCode` to `440` in the `init` call
- No need to add `withCredentials: true` to your API calls anymore. It is automatically inserted.

## From version `0.0.X` to `4.X.X`
### Using ```fetch```
- Change to the ```init``` function. See [here](./fetch/init).
- Renaming of the ```sessionPossiblyExists``` function to [this](./fetch/checking-for-active-session).

### Using ```axios```
- Change to the ```init``` function. See [here](./axios/init).
- Renaming of the ```sessionPossiblyExists``` function to [this](./axios/checking-for-active-session).