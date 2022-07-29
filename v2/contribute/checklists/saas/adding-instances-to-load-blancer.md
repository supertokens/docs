---
id: adding-instances-to-load-blancer
title: Adding instances to an existing load balancer
hide_title: true
---

# Scaling an existing managed service which has an associated load balancer
> If the app doesn't have a load balancer associated, please check [link](/docs/contribute/checklists/saas/scaling-prod-instances)

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
- the `scaleTo` parameter value should be greater than the existing number of instances associated with the app. If that condition is not satisfied, no change will happen
- Find the existing Target Group for the app, select add instances and add the new instances created for the app. All the instance ids assocaited with the app can be found from `aws_containers` table. This will require deployment id. To get thedeployment id from app id, use table `aws_deployments` (production deployment).