---
id: issues-removing-app
title: Issues while removing app
hide_title: true
---

# Issues that can come while removing a saas app and how to deal with them

## Issue removing database due to existing connections
- For the app, get the database name, database user and RDS cluster info from the aws_deployments table (do this for both development and production deployment)
- connect to the rds cluster
- check if database or database user exists
- if the database exists, execute the query:
```sql
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'TARGET_DB'; -- ← change this to required DB
```
- remove the appId from app_id_marked_for_removal table
- execute the remove app script again for this app