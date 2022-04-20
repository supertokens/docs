---
id: scaling-prod-instances
title: Scaling prod instances
hide_title: true
---

# Scaling prod instances

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
    - Add load balancer access logs
        - Create a S3 bucket with no public access
- Update DNS Route 53


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