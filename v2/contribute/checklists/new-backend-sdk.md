---
id: new-backend-sdk
title: New Backend SDK
hide_title: true
---

# New backend SDK checklist

- Create a new github repo"
    - Branch permissions
    - Team permissions
    - Delete branch if merged (in PR)
- Implement all recipes
- Add unit tests for at least:
    - normalizing urls and paths
    - config normalizing for session recipe
    - getting top level domains for session recipe
- Make sure that override of API and recipe interface can be done in a way that works with [this issue](https://github.com/supertokens/supertokens-node/issues/199) in mind.
- Add to example implementations in examples folder
- Setup CICD
- Create all files in the github repo (see another repo and make sure all files exist)
- Add ID in our backend api:
    - for release
    - to show in compatibility area
- Changes to rest of website:
    - Home page
    - Product roadmap change
    - Introduction page in docs
- Update all recipe docs
- Add SDK docs on website. Follow [this](https://github.com/supertokens/docs/blob/master/v2/HOW_TO_NEW_DOCS.md#to-create-new-sdk-docs-using-an-automatic-docs-generation-tool-and-not-docusaurus)
- Add core connection code snippet to dashboard
- Change [references docs](https://supertokens.com/docs/community/sdks) to add link to new docs