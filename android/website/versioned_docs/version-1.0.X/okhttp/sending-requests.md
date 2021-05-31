---
id: version-1.0.X-sending-requests
title: Sending Requests
hide_title: true
original_id: sending-requests
---

# Sending Requests

Since SuperTokens uses interception with both ```OkHttp``` and ```Retrofit``` the code to make API calls does not require any changes. 

In the case the response status code matches the session expired status code, you need to ask the user to login again.