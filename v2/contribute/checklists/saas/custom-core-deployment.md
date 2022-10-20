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
- For the Dockerfile of supertokens-postgresql image, update:
    - coreBranch
    - coreVersion
    - pluginBranch
    - pluginVersion 
    - pluginInterfaceBranch
    - pluginInterfaceVersion
    
    In the following dockerfile:
   
    ```bash
    FROM ubuntu:bionic-20200219 as tmp
    ARG coreBranch="third-party-tenant-mapping"
    ARG coreVersion="4.1.1"
    ARG pluginName="postgresql"
    ARG pluginBranch="thirdparty-tenant-mapping"
    ARG pluginVersion="2.0.0"
    ARG pluginInterfaceBranch="third-party-tenant-mapping"
    ARG pluginInterfaceVersion="2.18.0"
    RUN apt-get update && apt-get install -y curl zip
    RUN OS= && dpkgArch="$(dpkg --print-architecture)" && \
        case "${dpkgArch##*-}" in \
        amd64) OS='linux';; \
        arm64) OS='linux-arm';; \
        *) OS='linux';; \
        esac && \
        curl -o supertokens.zip -s -X GET \
        "https://api.supertokens.io/0/manual/zip/download?os=$OS&coreBranch=$coreBranch&coreVersion=$coreVersion&pluginName=$pluginName&pluginBranch=$pluginBranch&pluginVersion=$pluginVersion&pluginInterfaceBranch=$pluginInterfaceBranch&pluginInterfaceVersion=$pluginInterfaceVersion" \
        -H "api-version: 0"
    RUN unzip supertokens.zip
    RUN cd supertokens && ./install
    FROM debian:stable-slim
    RUN groupadd supertokens && useradd -m -s /bin/bash -g supertokens supertokens
    RUN apt-get update && apt-get install -y --no-install-recommends gnupg dirmngr && rm -rf /var/lib/apt/lists/*
    ENV GOSU_VERSION 1.7
    RUN set -x \
        && apt-get update && apt-get install -y --no-install-recommends ca-certificates wget && rm -rf /var/lib/apt/lists/* \
        && wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture)" \
        && wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/$GOSU_VERSION/gosu-$(dpkg --print-architecture).asc" \
        && export GNUPGHOME="$(mktemp -d)" \
        && gpg --batch --keyserver hkps://keys.openpgp.org --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4 \
        && gpg --batch --verify /usr/local/bin/gosu.asc /usr/local/bin/gosu \
        && gpgconf --kill all \
        && rm -rf "$GNUPGHOME" /usr/local/bin/gosu.asc \
        && chmod +x /usr/local/bin/gosu \
        && apt-get purge -y --auto-remove ca-certificates wget
    COPY --from=tmp --chown=supertokens /usr/lib/supertokens /usr/lib/supertokens
    COPY --from=tmp --chown=supertokens /usr/bin/supertokens /usr/bin/supertokens
    COPY docker-entrypoint.sh /usr/local/bin/
    RUN echo "$(md5sum /usr/lib/supertokens/config.yaml | awk '{ print $1 }')" >> /CONFIG_HASH
    RUN ln -s usr/local/bin/docker-entrypoint.sh /entrypoint.sh # backwards compat
    EXPOSE 3567
    ENTRYPOINT ["docker-entrypoint.sh"]
    CMD ["supertokens", "start"]
    ```

- Build the image using
    ```bash
    docker buildx build --platform linux/amd64,linux/arm64 --tag rishabhpoddar/supertokens-postgresql:X.Y-feature-name . --no-cache --push
    ```

    Make sure to change X.Y to the core version and change feature-name to the right name (can be anything unique).

- Push to `rishabhpoddar/supertokens-postgresql:X.Y-<feature-name>`. For example, `rishabhpoddar/supertokens-postgresql:4.1-multitenant-config`

## Deploying in user's SaaS
- Update the code in the backend for the image version tag name and version number in `APP_ID_TO_CUSTOM_IMAGE` variable in [this file](https://github.com/supertokens/supertokens-backend-apis/blob/master/app/0/ts/helpers/saas/deployment.ts).
- Push the backend code to production
- Restart all the dev / prod containers for that app.

## Remove git tags
Remove the tags that were created earlier from all the repos:
```bash
git push origin --delete vX.Y.Z
git fetch -p && git branch -vv | awk '/: gone]/{print $1}' | xargs git branch -D
```