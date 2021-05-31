---
id: sending-requests
title: Sending Requests
hide_title: true
---

# Sending Requests

## The ```SuperTokensHttpURLConnection.newRequest``` function: [API Reference](../api-reference/httpurlconnection#supertokenshttpurlconnectionnewrequesturl-url-preconnectcallback-preconnectcallback)

<!--DOCUSAURUS_CODE_TABS-->
<!--Java-->
```java
URL url = new URL("https://api.example.com/api/getUerInfo");
HttpURLConnection connection;
try {
    connection = SuperTokensHttpURLConnection.newRequest(url, new SuperTokensHttpURLConnection.PreConnectCallback() {
        @Override
        public void doAction(HttpURLConnection con) throws IOException {
            con.setRequestMethod("POST");
            // set some custom headers..
        }
    });
    if ( connection.getResponseCode() == 200 ) {
        // handle response..
    }
} catch (IOException e) {
    // Something went wrong making the API call
} finally {
    connection.disconnect();
}
```
<!--Kotlin-->
```java
val url = new URL("https://api.example.com/api/getUerInfo");
val connection;
try {
    connection = SuperTokensHttpURLConnection.newRequest(url, SuperTokensHttpURLConnection.PreConnectCallback {
        it.setRequestMethod("POST");
    })
    if ( connection.responseCode == 200 ) {
        // handle response..
    }
} catch (IOException e) {
    // Something went wrong making the API call
} finally {
    connection.disconnect();
}
```
<!--END_DOCUSAURUS_CODE_TABS-->

- If the status code of the returned ```connection``` object is session expired, then you should ask the user to login again.
- The callback may be called multiple times if the access token has expired.

