---
id: new-frontend-sdk
title: New Frontend SDK
hide_title: true
---

# New frontend SDK checklist

- Implement all recipes
- Make sure that override of recipe interface can be done in a way that works with [this issue](https://github.com/supertokens/supertokens-node/issues/199) in mind.
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
- Change [references docs](https://supertokens.com/docs/community/sdks) to add link to new docs