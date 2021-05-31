---
id: version-2.0.X-overview
title: Overview
hide_title: true
original_id: overview
---

# Error Handling Overview

All our functions will throw one of these four types of errors:
- **[GENERAL_ERROR](./general-error)**
- **[UNAUTHORISED](./unauthorised)**
- **[TRY_REFRESH_TOKEN](./try-refresh-token)**
- **[TOKEN_THEFT_DETECTED](./token-theft-detected)**

> To detect if the error thrown from supertokens-node lib, use the function [`isErrorFromAuth`](./is-error-from-auth). If the error is thrown by supertokens-node library, it will always be a supertokens.Error object.

The above are all ```enums``` and their number value, as seen on the console, are:
- ```GENERAL_ERROR```: ```1000```
- ```UNAUTHORISED```: ```2000```
- ```TRY_REFRESH_TOKEN```: ```3000```
- ```TOKEN_THEFT_DETECTED```: ```4000```