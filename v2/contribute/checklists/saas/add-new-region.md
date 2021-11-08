---
id: add-new-region
title: Add new region
hide_title: true
---

# Add new region

- S3
    - Create bucket with name supertokens-saas-{region} (use settings from supertokens-saas-us-east-1 bucket
    - Bucket Policy:
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
    - Set Block all public access to false
    - Update IAM Policy S3SSLUpdater, listBucketItems, s3crr_for_supertokens-ssl_to_supertokens-saas-us-east-1
    - Add migration policy for supertokens-ssl


- Route 53
    - Add new hosted zone {region}.dns (Private hosted zone)

- EC2
    - Security Groups:
        - supertokens-nginx-port
            - open port 3567-3600 on the instance
        - dev-postgresql
            - open dev postgres server port to the internet
        - ping-ssh
            - allow ping and ssh to instance
        - default
            - Update inbound rules to allow 4243 and 5432 port for prod and dev instance

- RDS
    - Create based on other regions rds


- System Manager
    - Copy documents from us-east-1 region


- Lambda
    - Import all functions from eu-west-1

- VPC
    - Create endpoint of type gateway from s3 service


:::important
- Make sure to start a dev instance in production
- Give region SSH keys to team members
:::