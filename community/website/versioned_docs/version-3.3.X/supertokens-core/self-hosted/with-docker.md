---
id: version-3.3.X-with-docker
title: Self Hosted setup with Docker
hide_title: true
original_id: with-docker
---

<!-- COPY DOCS -->
<!-- ./community/docs/supertokens-core/self-hosted/with-docker.md -->

# Self Hosted setup with Docker

## Running the docker image 🚀
<!--DOCUSAURUS_CODE_TABS-->
<!--With MySQL-->
```bash
docker run -p 3567:3567 -d supertokens/supertokens-mysql
```

- To see all the env variables available, please see [the README file](https://github.com/supertokens/supertokens-docker-mysql/blob/master/README.md).
- The above command will start the container with an in-memory database. This means you **do not need to connect it to MySQL to test out SuperTokens**.
- When you are ready to connect it to your database, please visit the [Database setup section](../database-setup/mysql)

<!--With PostgreSQL-->
```bash
docker run -p 3567:3567 -d supertokens/supertokens-postgresql
```

- To see all the env variables available, please see [the README file](https://github.com/supertokens/supertokens-docker-postgresql/blob/master/README.md).
- The above command will start the container with an in-memory database. This means you **do not need to connect it to PostgreSQL to test out SuperTokens**.
- When you are ready to connect it to your database, please visit the [Database setup section](../database-setup/postgresql)


<!--With MongoDB-->
```bash
docker run -p 3567:3567 -d supertokens/supertokens-mongodb
```

- To see all the env variables available, please see [the README file](https://github.com/supertokens/supertokens-docker-mongodb/blob/master/README.md).
- The above command will start the container with an in-memory database. This means you **do not need to connect it to MongoDB to test out SuperTokens**.
- When you are ready to connect it to your database, please visit the [Database setup section](../database-setup/mongodb)

> We do not offer login functionality with MongDB yet. We only offer session management.

<!--END_DOCUSAURUS_CODE_TABS-->


## Testing that the service is running 🤞
Open a browser and visit `http://localhost:3567/hello`. If you see a page that says `Hello` back, then the container was started successfully!

If you are having issues with starting the docker image, please feel free to reach out to us [over email](mailto:founders@supertokens.com) or [via Discord](https://supertokens.com/discord).

# Connecting the backend SDK with SuperTokens 🔌
- The default `port` for SuperTokens is `3567`. You can change this by binding a different port in the `docker run` command. For example, `docker run -p 8080:3567` will run SuperTokens on port `8080` on your machine.
- There is no API key by default. You can add one visiting the [API keys section](../../common-customizations/core/api-keys) 
- Assuming the default, the connection info will go in the `supertokens` object in the `init` function on your backend:

<!--DOCUSAURUS_CODE_TABS-->
<!--NodeJS-->

```js
let supertokens = require("supertokens-node");

supertokens.init({
__HIGHLIGHT__    supertokens: {
        connectionURI: "http://localhost:3567"
    }, __END_HIGHLIGHT__
    appInfo: {...},
    recipeList: [...]
});
```

<!--END_DOCUSAURUS_CODE_TABS-->
