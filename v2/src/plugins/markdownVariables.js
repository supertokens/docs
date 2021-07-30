let configuredVariables = require("./markdownVariables.json");

module.exports = () => {

    function getModifiedChild(child, exportedVariables) {
        // A child will either have a value or more children
        // If it has a value, check if it is using a variable. If it is then replace otherwise skip
        if (child.value) {
            var valueCopy = child.value;

            // For each entry in the variables object replace all occurences of that variable in the value string
            Object.keys(exportedVariables).forEach(key => {
                valueCopy = valueCopy.split(`^{${key}}`).join(`${exportedVariables[key]}`)
            });

            child.value = valueCopy;
        }

        // If it has children then modify all children
        if (child.children) {
            child.children = child.children.map(subChild => {
                return getModifiedChild(subChild, exportedVariables);
            })
        }

        return child;
    }

    return (data, file) => {
        var recipeName = file.path.split("/v2/")[1].split("/")[0]
        var fileSplit = file.path.split("/");
        var fileName = fileSplit[fileSplit.length - 1].replace(".mdx", "").replace(".md", "");

        let configObjectForRecipe = configuredVariables[recipeName];

        // If there is no config entry for the recipe, exit early
        if (!configObjectForRecipe) {
            return data;
        }

        let configObjectForFile = configObjectForRecipe[fileName];

        // If the config entry for recipe has no entry for the file name, exit early
        if (!configObjectForFile) {
            return data;
        }

        var dataCopy = data;

        if (dataCopy.children.length) {

            dataCopy.children = dataCopy.children.map(child => {
                return getModifiedChild(child, configObjectForFile);
            })

            return dataCopy;
        }
    }
}