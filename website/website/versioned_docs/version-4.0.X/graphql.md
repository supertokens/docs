---
id: version-4.0.X-graphql
title: Usage with GraphQL
hide_title: true
original_id: graphql
---

# Usage with GraphQL

## Usage with Interceptors
You can configure SuperTokens to intercept API calls when initialising the package. The package will then take care of managing your user session for you.

```ts
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import SuperTokensRequest from 'supertokens-website';

// passing true enables interceptors
SuperTokensRequest.init("/refresh", 440, true);

const client = new ApolloClient({
    link: new HttpLink({
        uri: "/graphql",  // change this depending on your path
    }),
    cache: new InMemoryCache(),  // change this depending on your preference
    // ... other params
});

// use client as usual.
```

## Usage without Interceptors
If you choose to opt out of interceptors you need to manually change the way the client handles API calls.

```ts
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import SuperTokensRequest from 'supertokens-website';

SuperTokensRequest.init("/refresh", 440);  // interception is off by default

const client = new ApolloClient({
    link: new HttpLink({
        uri: "/graphql",  // change this depending on your path
        fetch: (uri, options) => {
            return SuperTokensRequest.fetch(uri, options);
        }
    }),
    cache: new InMemoryCache(),  // change this depending on your preference
    // ... other params
});

// use client as usual.
```