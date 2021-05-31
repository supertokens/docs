---
id: version-1.0.X-overview
title: Overview
hide_title: true
original_id: overview
---

# Error Handling Overview

All our functions will throw one of these four types of errors:
- **[SuperTokensGeneralException](./general-error)**
- **[SuperTokensUnauthorisedException](./unauthorised)**
- **[SuperTokensTryRefreshTokenException](./try-refresh-token)**
- **[SuperTokensTokenTheftException](./token-theft-detected)**

You can define custom error handling login using the **[handleError](./handle-error)** function.