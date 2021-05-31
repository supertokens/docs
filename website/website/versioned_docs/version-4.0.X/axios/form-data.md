---
id: version-4.0.X-form-data
title: Submitting form data
hide_title: true
original_id: form-data
---

# Submitting form data

This is only applicable for ```non-GET``` method form submissions.

Traditionally, when submitting form data, the browser makes an API call for you to submit the data. With SuperTokens, you will have to make this API call yourself as it provides ```CSRF``` protection and calls the refresh API in case the access token has expired.

```html
<!DOCTYPE html>
<html>
    <body>
        
        <form onsubmit="return submitData()">
            Enter name: <input type="text" name="fname">
            <input type="submit" value="Submit">
        </form>

        <script>
            supertokens.axios.init(/* params.. */); // initialise SuperTokens
        </script>

        <script>
        function submitData() {
            // extract element out of the user input field and call API using axios

            return false; // will prevent any redirection that happens when a form is submitted. 
        }
        </script>

    </body>
</html>
```
