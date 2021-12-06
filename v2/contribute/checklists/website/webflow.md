---
id: webflow
title: Webflow pages
hide_title: true
---


## Managing Webflow files
- Keep one main file where each project is added as a separate page.
- Have another project which is the currently working page
- For homepage and pricing page, having separate projects is fine
- For a new page on website remove the existing page in currently working page and put it inside the main file as another page.
- Now you can work on the new page in this project so you avoid creating multiple projects

## Overall changes when making changes to a existing file

1. Download the Webflow file
2. Open terminal
3. Go to main website folder
4. Go to master branch (git checkout master)
5. Then you get latest version of the master branch, so you do (git pull)
6. Now create your own branch from the master branch (git checkout -b name-of-your-branch)
7. Main website…. Go to webflow folder and delete the files that you are replacing and then copy the new files inside that particular folder. 
8. Do git status to check what has changed
9. Npm run start
10. Go to localhost: 9001 and go to the page you have changed. 
11. It should be completely screwed up. If it is not screwed up you need to reset everything in main-website. Run this command git reset —hard. Do from step 5
12. Open a new terminal and go to main website again. Go to cd automate_webflow/
13. WEBFLOW_PAGE_PATH=folder/ npm run start
14. Go back to the webpage and then you should see all your changes implemented. Remember to refresh the page
15. Sometimes the changes will not be reflected, if that the case go to the old terminal and stop the process (command +C ) and restart by doing npm run start. And check again if the changes have come. If changes not updated then run ./buildMainSite on a new terminal
16. If changes are done do git add — all
17. Go one directory back (main-website)
18. Then, git commit -m”Name of the change”
19. Do git push
20. Copy and paste new command that you get in the terminal
21. Compare and pull request on GitHub main website


## Overall changes when adding a new file

1. Tell Joel to make backend changes.. Give him the folder name that’ll be there in the main website folder, Also give him the full url. 
2. Inside the Webflow file, in custom fonts section, add the google font url for fonts used inside that file. For blog noto serif and Rubik both should be there. 
3. Then, download the Webflow file
4. Open terminal
5. Then do these steps to update backend website server:
6.  cd supertokens-backend-website
7. git reset --hard
8. git clean -f -d
9. git pull
10. Go to main website folder (cd ../)
11. Go to master branch (git checkout master)
12. Then you get latest version of the master branch, so you do (git pull)
13. Now create your own branch from the master branch (git checkout -b name-of-your-branch)
14. Main website…. Go and create the folder with the exact naming convention as what you gave Joel and paste in the files you downloaded from Webflow inside that particular folder. 
15. Add the OG image inside the assets folder -> meta images. For adding a new blog go to assets folder -> meta images -> blog and paste it there. 
16. If adding a new page on website, you need to change the index.tsx file, the consonants.tsx file and the notfoundwhitelist file. If simply adding a new blog, then these changes are not required. 
17. Go the sitemap and meta excel sheet and update information there. 
18. Do git status to check what has changed
19. Npm run start
20. Go to localhost: 9001 and go to the page you have changed. 
21. It should be completely screwed up. If it is not screwed up you need to reset everything in main-website. Run this command git reset —hard. Do from step 14
22. Open a new terminal and go to main website again. Go to cd automate_webflow/
23. WEBFLOW_PAGE_PATH=folder/ npm run start
24. Go back to the webpage and then you should see all your changes implemented. Remember to refresh the page
25. Sometimes the changes will not be reflected, if that the case go to the old terminal and stop the process (command +C ) and restart by doing npm run start. And check again if the changes have come. If changes not updated then run ./buildMainSite on a new terminal.
26. Now suppose if changes are reflected, but they are not proper and you want to redo the changes then do, git reset —hard, then git status and then remove the new untracked files by using rm path_of_file OR you can go back one directory to cd …/. It’ll take you to main website and there you can do git clean -f -d
27. If changes are done do git add — all
28. Go one directory back (main-website)
29. Then, git commit -m”Name of the change”
30. Do git push
31. Copy and paste new command that you get in the terminal
32. Compare and pull request on GitHub main website
33. Test everything 
* Then remember, only after the website has been pushed to production, you go to https://supertokens.io/update-seo-content and update the seo content. If the link navigates you to homepage, go to the website, inspect element and paste this in console : localStorage.setItem('st_antcs', 'st-team-udid1234') After that you can check the link again
* To check if everything is working fine, https://socialsharepreview.com/
