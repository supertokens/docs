---
id: move-to-aurora-serverless
title: Checklist for moving to Aurora serverless for Saas apps
hide_title: true
---
# Checklist for moving to Aurora serverless for Saas apps

### API code changes

- the logic to figure out which db cluster to use when deploying an app will get simplified. Currently, for each region, we get all the db clusters and check how many apps are using them. Based on the number of apps and max allowed apps per cluster parameter, we decide which db cluster will be used to deploy the app. This logic will get simplified. We will just fetch the db cluster for a specific region and deployment type and deploy the app directly without making any further checks.

### Script required
- for existing deployments using non serverless db cluster, a script will be required which will be doing the following things
    - create db_name and db_user in serverless aurora cluster with same db_password
    - create all tables as how they are in the non serverless db cluster for the db_name
    - capture current timestamp as T and move all the existing data based on the timestamp (whichever table supports it)
    - stop the existing supertokens container for the app
    - move all the new data (inserted after timestamp T, for tables having timestamp) and pending data (for non timestamp included tables)
    - update db cluster info in api database
    - restart the containers


### AWS
- remove RDS clusters
- remove Cloudwatch metrics created for the RDS cluster
    - Read IOPS
    - FreeableMemory
    - CPUUtilization
    - FreeLocalStorage