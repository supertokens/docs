---
id: version-2.1.X-installation-with-docker
title: Installation with Docker
hide_title: true
original_id: installation-with-docker
---

# Installation With Docker

### 1) Go to your [dashboard](/dashboard-saas) to get the docker image and license key ID
- In the listed app, choose "Yes" for the question "Use docker?"
- Copy the docker pull command and run it on your computer. This will download the docker image for the selected version
- Copy the license key id. You will require to pass this as an environment variable in the `docker run` command (Will be explained later).

### 2) See Docker README
Visit the [Docker](../docker) section to find the readme for your Docker image

### 3) Setup database
Please visit the relevant database page under the [Database Setup section](./database-setup/mysql)

### 4) CLI commands
Head over to the [CLI docs](../cli/overview) to learn more about the available commands.

### 5) Integration with APIs and frontend
- Go to the [Backend SDK Integration](../backend-integration) section to see documentation for integrating SuperTokens with your backend APIs
- Go to the [Frontend SDK Integration](../frontend-integration) section to see documentation for integrating SuperTokens with your frontend clients.

### 6) Manage payments and license keys
- Go to the [About License Keys](../about-license-keys) section to learn about how you can manage license keys.
- Go to the [About Payments](../about-payments) section to learn about how payments will work.