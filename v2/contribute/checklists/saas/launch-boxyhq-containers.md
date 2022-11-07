---
id: launch-boxyhq-containers
title: Launch BoxyHQ Containers for app
hide_title: true
---

# Launch BoxyHQ Containers for ap
## Manual changes
- For the app, go to the aws_deployment and get the information regarding in which region (let's call it R1) and db server the app is deployed. Also get the information like db_user (DB_USER_n), db_password (DB_PASSWORD__n), db_name (DB_NAME_n) for the deployment
- For each deployment_id (D_n) found in the previous step, go to aws_containers and get the information of instance on which the containers are deployed (let's call it I_n) and the container_name for supertokens container (C_n)
- Now for each deployment, go to the respective DB server, select the database (DB_NAME_n) and run following query:
```sql
CREATE SCHEMA boxyhq;
CREATE USER {{DB_USER_n}}_boxyhq WITH LOGIN PASSWORD '{{DB_PASSWORD_n}}' VALID UNTIL 'infinity';
ALTER USER {{DB_USER_n}}_boxyhq set SEARCH_PATH = 'boxyhq';
GRANT ALL PRIVILEGES ON DATABASE {{DB_NAME_n}} TO {{DB_USER_n}}_boxyhq;
GRANT ALL PRIVILEGES ON SCHEMA boxyhq TO {{DB_USER_n}}_boxyhq;
```
- Generate API key online
    - Go to https://randomkeygen.com
    - Click on `Generate a New Set of Random Passwords and Keys`
    - Go To `CodeIgniter Encryption Keys` and select one key {{JACKSON_API_KEY_n}}
- In boxyhq_containers table add the following entry
    - container_name: {{C_n}}-boxyhq
    - instance_id: {{I_n}}
    - deployment_id: {{D_n}}
    - boxyhq_port: 5125
    - nginx_port: 5225
    - service_key: {{JACKSON_API_KEY_n}}
    - postgres_user: {{DB_USER_n}}_boxyhq

## AWS
### System Manager
- Run the following documents to launch boxyhq and nginx containers on the instance (I_n)

#### StartUpdateBoxyHQ
- Parameters
    - jacksonApiKeys: {{JACKSON_API_KEY_n}}
    - postgresqlUser: {{DB_USER_n}}_boxyhq
    - postgresqlPassword: {{DB_PASSWORD_n}}
    - postgresqlHost: {{cloud_endpoint db server found in aurora_servers}}
    - postgresqlPort: 5432
    - postgresqlDatabaseName: {{DB_NAME_n}}
    - boxyHQPort: 5125
    - containerName: {{C_n}}-boxyhq
- InstanceId: I_n

#### StartUpdateNginx
- Parameters
    - nginxHostPort: 5225
    - superTokensPort: 5125
    - userAppDNS: {{C_n}}-{{region}}
    - instanceDNS: {{private_dns_name for I_n from aws_instances}}
    - containerName: {{C_n}}-boxyhq-nginx
- InstanceId: I_n


### EC2
- Add `boxyhq` security group to the instance's (I_n's) security group