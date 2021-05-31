---
id: sending-requests
title: Sending Requests
hide_title: true
---

# Sending Requests

Since SuperTokens uses interception with both ```OkHttp``` and ```Retrofit``` the code to make API calls does not require any changes. 

In the case the response status code matches the session expired status code, you need to ask the user to login again.