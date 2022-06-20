---
id: adding-new-ec2-instance-for-node-api
title: Adding new EC2 instance for node API
hide_title: true
---

# Adding new EC2 instance for node API

The list includes all the changes that needs to be made to make sure the things won't break when we add a new EC2 instance for our node API

- cronjobs need to be thread safe. If two or more instance of the same cronjob are running at the same time, it should not affect the outcome of the cronjob. Also, few cronjobs might only need to be run on one server.
- Mysql pool size will need to be updated to account for multiple node containers. Cronjobs should run on only one of them
- CI/CD script needs to be updated. There should be delay while restarting each api container and the containers will be restarted one after the other
- nginx config file will be updated. If the request fails with 504 error from one server, nginx should query other server before sending response to the client
- when adding a new ec2 instance, all steps related to compliance needs to be followed
- Health check monitoring (may not be required, but OK)
- Resource monitoring
- Secrets need to be stored to the new server
- Correct node process env needs to be set for the new instance
- Inbound IP address rules must be changed for mysql db (may not be required) and for postgresql dbs in managed service (for all regions).
- Install nvm and make node version v16.15.1 by default.
