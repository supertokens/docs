---
id: version-2.2.X-installation-with-docker
title: Installation with Docker
hide_title: true
original_id: installation-with-docker
---

# Installation With Docker

### 1) Go to your [dashboard](/dashboard) to get the docker image and license key ID
- In the listed app, choose "Yes" for the question "Use docker?"
- Copy the docker pull command and run it on your computer. This will download the docker image for the selected version
- Copy the license key id. You will require to pass this as an environment variable in the `docker run` command.

### 2) See Docker README.md and start the Docker container
Visit the [Docker](../docker) section to find the readme for your Docker image. SuperTokens will use an in-memory database if you do not provide the relevant database config values to it.

### 3) Integrate into your app
- Go to the [Backend SDK Integration](../backend-integration) section to see documentation for integrating SuperTokens with your backend APIs
- Go to the [Frontend SDK Integration](../frontend-integration) section to see documentation for integrating SuperTokens with your frontend clients.

-----------

## Connecting to your database
Please visit the relevant database page under the [Database Setup section](./database-setup/mysql)