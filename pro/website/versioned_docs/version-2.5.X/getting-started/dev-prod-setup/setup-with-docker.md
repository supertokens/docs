---
id: version-2.5.X-setup-with-docker
title: Setup with Docker
hide_title: true
original_id: setup-with-docker
---

# Setup on premises with Docker

### 1) Go to your [dashboard](/dashboard-saas) to get the docker pull command
Copy the docker pull command and run it on your computer. This will download the docker image for the selected version and database. You will also need the license key displayed on your dashboard.

### 2) See Docker README.md and start the Docker container
Visit the [Docker](../../docker) section to find the readme for your Docker image. SuperTokens will use an in-memory database if you do not provide the relevant database config values to it.

### 3) Integrate into your app
- Go to the [Backend SDK Integration](../../backend-integration) section to see documentation for integrating SuperTokens with your backend APIs
- Go to the [Frontend SDK Integration](../../frontend-integration) section to see documentation for integrating SuperTokens with your frontend clients.

-----------

## Connecting to your database
Please visit the relevant database page under the [Database Setup section](../database-setup/mysql)