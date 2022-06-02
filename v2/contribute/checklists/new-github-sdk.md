---
id: new-github-sdk
title: New Github repo
hide_title: true
---

# New github repo

- Rename main to master
- Add branch protection rules for `master` and for `[0-9]*.[0-9]*`
    - Require a pull request before merging
        - Require approvals
    - Require status checks to pass before merging
        - Add all required checks
    - Require conversation resolution
    - restrict who can push to branch (master only admin, otherwise core team)
- Add protected tag (`v*`)
- Setup github action for manually running tests
- Write readme