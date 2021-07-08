---
id: version-1.0.X-migration
title: Migration from old version
hide_title: true
original_id: migration
---

# Migration from the old version of SuperTokens

There has been an architectural changes to how SuperTokens works. The new setup can be seen [here](./getting-started/about#integration-with-supertokens). The reasons for this change are:
- **Community focus**: Earlier, each tech stack had their own "mini community". This means growing and taking advantage of the community would be much harder. For example, anytime a new backend framework is supported, its community would essentially start from 0 members regardless of the size of the community for other supported tech stacks In the new method, since all users will be using the SuperTokens core (which contains the main session logic), the community's effort will be much more concentrated and new framework SDKs can immediately take advantage of the existing community support.
- **Easier feature extensibility**: We are planning on adding more features like providing a comprehensive dashboard using which you can monitor and manipulate user sessions as well as get very useful analytics on API calls and requests (with zero extra effort). This is best served via a self running http web service.
- **Decoupling backend framework and database**: This allows us to more quickly support more tech stacks as well as maintain them in a more efficient manner. In the earlier method, if we had to support 10 backend frameworks and 10 databases, we would have to make at most 100 repositories. Now, we can do so with at most 20.

### 1) Sign up and install the SuperTokens http service (core)
- Sign up [here](/signup)
- Download the SuperTokens zip from your [dashboard](/dashboard-saas)

### 2) Install and configure the SuperTokens core
- See the [installation instructions](./getting-started/installation#3-install-supertokens)
- Earlier, the configuration options were given to the SuperTokens library directly. These have now moved to the ```config.yaml``` file which is used by the core. See the [configuration options](./configuration/core).

### 3) Setup database
- Some of the table names and structure have changed. If you are using the old version in production, and need migration help, please [contact us](mailto:team@supertokens.io)
- See the database changes [here](./getting-started/database-setup/mysql)

### 4) Backend framework changes
- [NodeJS changes](/docs/nodejs/migration)
- We we start to support other frameworks that are also supported in the older version, we will add links to those here.

### 5) Frontend framework changes
- [Website SDK changes](/docs/website/migration)