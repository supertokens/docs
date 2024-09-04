---
id: new-structure
slug: /
title: New Structure
hide_title: true
---
:::info
This proposal replaces all the `recipe guides` and moves everything inside one navigation layer.

For example, if someone wants to read about `Post Signin/Signup Callbacks` in the current docs version, they need
to select their specific recipe and then go to `Auth Flow Customizations`. In the proposed change they will just access `Customizations` -> `Post Signin/Signup Callbacks`. In there they will have info on all the authentication recipes.

Given that the time needed to make all these changes will be considerable we can start by implementing the `quickstart` guides. This can be added in the existent structure without
any radical changes. We just replace the `Start Here`/Orange section from the current docs
:::

Besides the initial `quickstart guide` I adjusted the overall structure of the docs. The aim was to have an  
easier time understanding how to navigate everything and for all the info to be accessible from one place.

#### Quickstart

The actual quickstart guide. Split into 4 sections:

- `Basics` provide a high level overview of how things will work (just enough to grasp the idea of our core service) and introduce some of our terminology (recipes, overrides, etc)
- `Frontend` shows the user how the frontend is setup.
- `Backend` shows the user how the backend is setup.
- `Common Actions` here we summarize a series of operations that are crosscutting between frontend and backend and
  that are elementary for a basic login flow. Things like: signout or protecting routes. We don't go into extensive details. Just the bare minimum.

Information in the `quickstart` section will be adjustable based on user selection/url parameters. AKA - If a user has initialized a demo app with `react`, `go`, and `mfa`, the pages will have references to that specific setup.

#### Authentication Methods

I grouped the authentication methods that we support under a common category.
While navigating the current docs I found it annoying/confusing at times to
use the recipe selector. You select something like `Multi Tenancy` and end up on a page that is totally separated from the rest of the docs (different root navigation). I think that this ends up causing more friction for the user that ends up navigating our docs.

#### Session Management

Extensive information on how to handle sessions

#### User Management

Extensive information on how to work with users and roles in Supertokens.

#### Customizations

How our features can be customized. From simple ui changes to complex overrides and adjustments

#### Advanced Topics

High level subjects, like security and self hosting.

#### Guides

Custom guides/troubleshooting articles that involve being aware/having an idea of some of the previous sections (session management, authentication methods, etc)

#### References

Direct references to our SDKs or other parameters that are used throughout the product

