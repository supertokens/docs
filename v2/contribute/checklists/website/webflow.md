---
id: webflow
title: Webflow pages
hide_title: true
---

## New Webflow page

- Make in webflow
- Add the clone header in the webflow file
- Update the fonts by adding custom fonts from the google apis
- Then tell Joel to update the backend website to inlcude the new link
- Change index.tsx, constants.tsx and notfoundwhitelist to set value to true
- Then in the tech folder shared to you through google drive, update sitemap and meta folders
- For OG image, save the image, then rename it properly and add it to the assets folder in the code section
- Then remember, only after the website has been pushed to production, you go to https://supertokens.io/update-seo-content and update the seo content. If the link navigates you to homepage, go to the website, inspect element and paste this in console : `localStorage.setItem('st_antcs', 'st-team-udid1234')` After that you can check the link again
- To check if everything is working fine, https://socialsharepreview.com/

## Managing Webflow files
- Keep one main file where each project is added as a separate page.
- Have another project which is the currently working page
- For homepage and pricing page, having separate projects is fine
- For a new page on website remove the existing page in currently working page and put it inside the main file as another page.
- Now you can work on the new page in this project so you avoid creating multiple projects

## Steps to update backend website server:
1. cd supertokens-backend-website
2. git reset --hard
3. git clean -f
4. git pull
