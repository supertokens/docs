---
id: db-restore
title: DB restore using automated backups
hide_title: true
---
# Restoring API/Saas related DBs using automated backups

### Database - Development API Server

- get the latest automated backup of the production server db
- use restore snapshot option
- make sure while restoring, the db instance type, security groups and all other configuration (including the root password) are same as the old db cluster
- update the route 53 entry related to this db (dev-mysql.supertokens.dns)
- once the restoration is finished, update the following:
    - development node api server config
- restart development node api server containers
- remove old cluster

### Database - Production API Server

- get the latest automated backup of the production server db
- use restore snapshot option
- make sure while restoring, the db instance type, security groups and all other configuration (including the root password) are same as the old db cluster
- update the route 53 entry related to this db (production-mysql.supertokens.dns)
- once the restoration is finished, update the following:
    - production node api server config
    - db configuration on retool site
    - db configuration on metabase site
- restart production node api server containers
- remove old cluster

### Database - API Saas DB (saas users db used to store active users)

- get the latest automated backup of the saas db
- use restore snapshot option
- make sure while restoring, the db instance type, security groups and all other configuration (including the root password) are same as the old db cluster
- update the route 53 entry related to this db (production-saas-users-mysql.supertokens.dns)
- once the restoration is finished, update the following:
    - production node api server config
- restart production node api server containers
- remove old cluster


# Restoring Saas users' containers related DBs using automated backups

### Database - Saas Postgresql DB (any region)

- get the latest automated backup of the saas db
- use restore snapshot option
- make sure while restoring, the db instance type, security groups and all other configuration (including the root password) are same as the old db cluster
- once the restoration is finished, update the db cluster info in api server production DB (table: aurora_servers)
- find and restart all the containers which are associated with the old cluster (which is being replaced)
- remove old cluster