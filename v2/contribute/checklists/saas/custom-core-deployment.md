---
id: custom-core-deployment
title: Deploying custom version of core
hide_title: true
---

# Deploying custom version of core

## Create core version
- Add the code to the core, plugin-interface and postgresql plugin in a specific branch
- Increase the patch version of all these such that there is no such version that exists in an actual released version of the core / plugin
- Execute the `./runBuild` command in the core, plugin-interface and plugin repos (this will replace the old jar with the new one).
- Push everything to the branch on git

## Git changes
- Add branch protection rules to this branch, so that no one can push to them other than the admin and deletion of the branch is not allowed.
- Tag the branch of the three repos with their version tag `vX.Y.Z` and push to git
- Make sure that github actions pass.

## Building the docker image
- TODO
- Push to `rishabhpoddar/supertokens-postgresql:X.Y-feature-name`. For example, `rishabhpoddar/supertokens-postgresql:4.1-multitenant-config`

## Deploying in user's SaaS
TODO

## Post deployment
- Remove those version tags from git