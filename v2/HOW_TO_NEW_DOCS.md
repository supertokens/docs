# To create a new doc project, you will need to:
- Copy the `change_me` folder and rename it to the new docs
- Copy `@docusaurus/plugin-content-docs` that belongs to `id: "change_me"`
- Change `change_me` in that to the new docs project within that block
- If this doc will have a version, copy `docsVersionDropdown` navbar item and change `change_me` in that.
- If the github icon is not to be shown in the docs, modify `DO_NOT_SHOW_GITHUB_BUTTON` in `src/theme/NavbarItem/index.js`