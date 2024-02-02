---
id: scaling-prod-instances
title: Adding Load Balancer for production deployment for older saas architecture
hide_title: true
---

# Adding Load Balancer for production deployment for older saas architecture

- call API:
```
endpoint: /0/manual/app/scale/deployment
method: POST
params:
    - password
    - appId
    - scaleTo
    - deploymentToScale
```
- wait 5 mins
- Create Target Group
    - Choose a target type: Instances
    - Protocol:
        HTTPS: 3567
    - Protocol Version: HTTP1
    - Health Check Path: /hello
    - Add Instances
    - Advanced health check settings:
        Healthy threshold: 5
        Unhealthy threshold: 2
        Timeout: 10s
        Interval: 30s
        Success Codes: 200
- Create Load Balancer
    - Application Load Balancer
    - Scheme: internet-facing
    - IP address type: ipv4
    - Load Balancer Protocol:
        HTTPS - 3567
    -  Availability Zones: select all
    - Certificate: *.aws.supertokens.com (Choose a certificate from ACM  - already configured in ACM)
    - Security Policy: 2016-08
    - Security Groups:
        - default
        - ping-ssh
        - supertokens-nginx-port
        - ec2-internal-team-access
    - Select Target Group created above
    - Enable load balancer access logs
        - Select Actions > Edit Attribute and add S3 bucket name (Select "Create this location for me")
        - Enable bucket versioning
        - Enable default encryption (Use default KMS key for S3)
        - Add tags for the bucket:
            - VantaContainsUserData: true
            - VantaDescription: store {{name-to-identify-the-loadbalancer}} loadbalancer logs
            - VantaOwner: rishabh@supertokens.com
        - Block public access for the bucket (Permissions -> Block all public access)
    - Add Tags for loadbalancer
        - VantaDescription: ...
        - VantaOwner: rishabh@supertokens.com
- Update DNS Route 53
- Add CloudWatch Alarms
    - HTTPCode_ELB_5XX_Count Alarm
        - Name: {{loadbalancer-name}} ELB HTTPCode_ELB_5XX_Count
        - Type: Metric alarm
        - Namespace: AWS/ApplicationELB
        - Metric name: HTTPCode_ELB_5XX_Count
        - LoadBalancer: {{loadbalancer-name}}
        - Statistic: Maximum
        - Period: 5 minutes
        - Threshold type: Static
        - Whenever HTTPCode_ELB_5XX_Count is...: Greater/Equal
        - than…: 1
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_ELB <!--- e.g. US_East_1, should be easy cause it will be in dropdown menu --->
    - TargetResponseTime Alarm
        - Name: {{loadbalancer-name}} ELB TargetResponseTime
        - Type: Metric alarm
        - Namespace: AWS/ApplicationELB
        - Metric name: TargetResponseTime
        - LoadBalancer: {{loadbalancer-name}}
        - Statistic: Maximum
        - Period: 5 minutes
        - Threshold type: Static
        - Whenever TargetResponseTime is...: Greater
        - than…: 1.5
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_ELB <!--- e.g. US_East_1, should be easy cause it will be in dropdown menu --->
    - UnHealthyHostCount Alarm
        - Name: {{loadbalancer-name}} ELB UnHealthyHostCount
        - Type: Metric alarm
        - Namespace: AWS/ApplicationELB
        - Metric name: UnHealthyHostCount
        - LoadBalancer: {{loadbalancer-name}}
        - Statistic: Maximum
        - Period: 5 minutes
        - Threshold type: Static
        - Whenever UnHealthyHostCount is...: Greater/Equal
        - than…: 1
        - SNS
            - Select an existing SNS topic: CloudWatch_Alarms_{{Region}}_ELB <!--- e.g. US_East_1, should be easy cause it will be in dropdown menu --->
- Add app id to database
    - add appId to `apps_with_load_balancer` table


## To make sure you cover
- [ ] Should span across multiple ec2 instances
- [ ] Should use multiple cores (two per ec2 instance or one?)
- [ ] Optimise thread pool size and db connection pool size
- [ ] Should be able to handle 1k requests per second
- [ ] We should be able to add more cores / ec2 instances without them having to change their connectionURI
- [ ] Even if one core is alive, their app should work (OK if performance issue).
- [ ] Should be able to hold 1 million sessions / users in the db
- [ ] Health check should happen for each core that is being used + the db + load balancer
- [ ] Add load balancer error monitoring and send notif to slack
- [ ] All CloudWatch Alarms are added
- [ ] S3 access logs are enabled
- [ ] S3 access logs bucket has versioning and encryption enabled
- [ ] Tags have been added for the load balancer and S3 access logs bucket
