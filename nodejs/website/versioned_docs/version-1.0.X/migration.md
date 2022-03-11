---
id: version-1.0.X-migration
title: Migration from old version
hide_title: true
original_id: migration
---

# Migration from the old version of SuperTokens

The older library was called ```supertokens-node-<db name>-ref-jwt```. Now, you only need to use ```supertokens-node``` library regardless of the database.

### With express
- Import statement changes as seen [here](./usage-with-express/initialization).
- Config changes:
    - All the configs are now set in the ```config.yaml``` file which is provided to the SuperTokens core server.
    - The only config that the Node library takes is a list containing SuperTokens instances' IP and port as shown [here](./usage-with-express/initialization#configure)
- The ```init``` function now returns ```void``` instead of ```Promise<void>```
- The ```jwtPayload``` param must only be of type ```object```.
- The ```sessionData``` param must only be of type ```object```.
- ```userId``` must be of type ```string```. Earlier, we would accept ```number``` or ```string```.

### Without express
- Import statement changes as seen [here](./usage-without-express/initialization).
- Config changes:
    - All the configs are now set in the ```config.yaml``` file which is provided to the SuperTokens core server.
    - The only config that the Node library takes is a list containing SuperTokens instances' IP and port as shown [here](./usage-without-express/initialization#configure)
- The ```init``` function now returns ```void``` instead of ```Promise<void>```
- The ```jwtPayload``` param must only be of type ```object```.
- The ```sessionData``` param must only be of type ```object```.
- ```userId``` must be of type ```string```. Earlier, we would accept ```number``` or ```string```.
- **The return type of most of the functions have changed. Please go through all of them. If you need assistance in migration, please [contact us](mailto:team@supertokens.com)**

### Errors
- ```UNAUTHORISED_AND_TOKEN_THEFT_DETECTED``` is now called ```TOKEN_THEFT_DETECTED``` as shown [here](./error-handling/token-theft-detected).