---
id: version-3.3.X-from-saas-to-on-prem
title: From managed service to self hosted
hide_title: true
original_id: from-saas-to-on-prem
---

# From managed service to self hosted

## Step 1: Database migration
We can give you a backup of your data using which you can run restoration on your PostgreSQL or MySQL instance. Please [contact us](mailto:team@supertokens.io) to get started

## Step 2: Running SuperTokens core yourself
- There are two ways to run the core, one with docker, and one without. Please visit the Quick Setup > Core section under your recipe docs.

## Step 3: Change `connectionURI` and `apiKey` in your backend code

You will need to point it to the SuperTokens instance that you are running as mentioned in the two links in step 2