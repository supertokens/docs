---
id: version-1.0.X-overview
title: Overview
hide_title: true
original_id: overview
---

# Session Object
A `Session` object is returned when a session is verified successfully. Following are the functions you can use on this `session` object:
- [`getUserId`](./get-user-id)
- [`getSessionData`](./get-session-data)
- [`updateSessionData`](./update-session-data)
- [`revokeSession`](./revoke-session)
- [`getJWTPayload`](./get-jwt-payload)

> Session Object can be used only with `express`. Currently, session object is not returned for without express option.