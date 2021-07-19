# To create a new doc project, you will need to:
- Copy the `change_me` folder and rename it to the new docs
- Copy `@docusaurus/plugin-content-docs` that belongs to `id: "change_me"`
- Change `change_me` in that to the new docs project within that block
- If this doc will have a version, copy `docsVersionDropdown` navbar item and change `change_me` in that.
- If the github icon is not to be shown in the docs, modify `DO_NOT_SHOW_GITHUB_BUTTON` in `src/theme/NavbarItem/index.js`
- If creating a new recipe, to add the recipe label in the nav bar, edit `RECIPE_LABELS` in src > theme > Navbar > index.js to add info about the new recipe.
- If the new doc needs to be linked with older versions of the docs, then add it to the `LINK_TO_OLDER_VERSIONS` in `src/theme/NavbarItem/index.js`