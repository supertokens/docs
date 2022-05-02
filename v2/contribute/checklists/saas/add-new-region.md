---
id: add-new-region
title: Add new region
hide_title: true
---

# Add new region

- SNS
    - Create the following SNS topics
        - CloudWatch_Alarms_US_East_1_EC2
            - Type: Standard
        - CloudWatch_Alarms_US_East_1_ELB
            - Type: Standard
        - CloudWatch_Alarms_US_East_1_Lambda
            - Type: Standard
        - CloudWatch_Alarms_US_East_1_RDS
            - Type: Standard
    - Create subcription for each topic using email address address provided by slack
    - Do confirm subscription for all 4 emails that would come on the slack channel

- S3
    - Create bucket with name supertokens-saas-{region} (use settings from supertokens-saas-us-east-1 bucket)
    - Create bucket with name supertokens-s3-access-logs-{region} (use settings from supertokens-s3-access-logs-us-east-1 bucket)
    - Bucket Policy for supertokens-saas-{region}:
    ```
    {
        "Version": "2012-10-17",
        "Id": "Policy1594127151493",
        "Statement": [
            {
                "Sid": "Stmt1594127148960",
                "Effect": "Allow",
                "Principal": "*",
                "Action": "s3:GetObject",
                "Resource": [
                    "arn:aws:s3:::supertokens-saas-<region>/*”,
                    "arn:aws:s3:::supertokens-saas-<region>”
                ],
                "Condition": {
                    "StringEquals": {
                        "aws:sourceVpc": “<region-vpc>”
                    }
                }
            }
        ]
    }
    ```
    - Set Block all public access to true
    - Update IAM Policy S3SSLUpdater, listBucketItems, s3crr_for_supertokens-ssl_to_supertokens-saas-us-east-1
    - Add migration policy for supertokens-ssl
    - Add tags:
        - VantaDescription: ...
        - VantaOwner: rishabh@supertokens.com
    - For supertokens-saas-{region} bucket, enable server access logging and set it to s3://supertokens-s3-access-logs-{region}/saas


- Route 53
    - Add new hosted zone {region}.dns (Private hosted zone)

- EC2
    - Security Groups:
        - supertokens-nginx-port
            - open port 3567-3600 on the instance
        - dev-postgresql
            - open dev postgres server port to the internet
        - ping-ssh
            - allow ping to instance (no ssh - the name is outdated, but we still keep that)
        - default
            - Update inbound rules to allow 4243 and 5432 port for prod and dev instance
        - ec2-internal-team-access
            - For SSH into these instances for internal team members.

- Add PostgreSQL RDS
    - Create based on other regions rds
    - For each db instance withing the cluster, add tags:
        - VantaContainsUserData: true
        - VantaDescription: db cluster to store development/production containers data
        - VantaOwner: rishabh@supertokens.com
    - Add CloudWatch Alarms
        - FreeableMemory Alarm
            - Name: db-{{RDS-cluster-name}} FreeableMemory
            - Type: Metric alarm
            - Namespace: AWS/RDS
            - Metric name: FreeableMemory
            - DbClusterIdentifier: {{db-cluster-identifier}}
            - EngineName: aurora
            - Statistic: Minimum
            - Period: 15 minutes
            - Threshold type: Static
            - Whenever FreeableMemory is...: Lower
            - than…: 52428800
            - SNS
                - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_RDS <!--- e.g. US_East_1, should be easy cause it will be in dropdown menu --->
        - FreeStorageSpace Alarm
            - Name: db-{{RDS-cluster-name}} FreeStorageSpace
            - Type: Metric alarm
            - Namespace: AWS/RDS
            - Metric name: FreeStorageSpace
            - DbClusterIdentifier: {{db-cluster-identifier}}
            - EngineName: aurora
            - Statistic: Minimum
            - Period: 15 minutes
            - Threshold type: Static
            - Whenever FreeStorageSpace is...: Lower
            - than…: 1073741824
            - SNS
                - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_RDS <!--- e.g. US_East_1, should be easy cause it will be in dropdown menu --->
        - CPUUtilization Alarm
            - Name: db-{{RDS-cluster-name}} CPUUtilization
            - Type: Metric alarm
            - Namespace: AWS/RDS
            - Metric name: CPUUtilization
            - DbClusterIdentifier: {{db-cluster-identifier}}
            - EngineName: aurora
            - Statistic: Maximum
            - Period: 15 minutes
            - Threshold type: Static
            - Whenever CPUUtilization is...: Greater
            - than…: 80
            - SNS
                - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_RDS <!--- e.g. US_East_1, should be easy cause it will be in dropdown menu --->
        - ReadIOPS Alarm
            - Name: db-{{RDS-cluster-name}} ReadIOPS
            - Type: Metric alarm
            - Namespace: AWS/RDS
            - Metric name: ReadIOPS
            - DbClusterIdentifier: {{db-cluster-identifier}}
            - EngineName: aurora
            - Statistic: Maximum
            - Period: 15 minutes
            - Threshold type: Static
            - Whenever ReadIOPS is...: Greater
            - than…: 1000
            - SNS
                - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_RDS <!--- e.g. US_East_1, should be easy cause it will be in dropdown menu --->



- System Manager
    - Copy documents from us-east-1 region


- Lambda
    - Import all functions from eu-west-1
    - For all the functions, create cloudwatch alarm:
        - Errors:
            - Name: {{lambda-function-name}} Errors
        - Type: Metric alarm
        - Namespace: AWS/Lambda
        - Metric name: Errors
        - FunctionName: {{lambda-function-name}}
        - Statistic: Maximum
        - Period: 15 minutes
        - Threshold type: Static
        - Whenever HTTPCode_ELB_5XX_Count is...: Greater/Equal
        - than…: 1
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_Lambda

- VPC
    - Create endpoint of type gateway from s3 service
    - Enable vpc flow logs and set it to s3://supertokens-s3-access-logs-{region}/vpc-flow-logs

- Cloudwatch
    - For all the log groups in the Logs section, change the retention period to 12 months

:::important
- Make sure to start a dev instance in production
- Give region SSH keys to team members
- Add new region to SOC2 software 
:::
