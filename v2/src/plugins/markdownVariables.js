/**
 * This script runs as part of the Remark plugins docusaurus uses to convert markdown to html.
 * This plugin intercepts the markdown content and modifies it before the content is parsed into HTML.
 * This plugin only modifies the markdown content passed to the HTML parser, it does not modify the markdown file itself
 * 
 * The plugin does the following:
 * - For the given file, it extracts the recipe name from its path
 * - Checks if the config file for variables has an entry for the recipe name, exits early if none exists
 * - It iterates through the children of the current file (each markdown/HTML element is recieved as a child)
 *      - If the child has a value/url property: Modifies the property by replacing all occurences of ^{variableName} syntax for every key of the config object
 *      - If the child has more children it loops through and repeats these steps recursively
 * - After processing is done, it returns the modified data
 * 
 * NOTE: There may be markdown elements that do not have a direct 'value' property [For example links have 'url'],
 * in such a case this script will need to be modified to accomodate using variables for that element.
 * 
 * NOTE: Changes to this file require restarting the docusaurus process, hot reload wont reflect the changes.
 * This is because of how docusaurus handles its cache for plugins
 */

let configuredVariables = require("./markdownVariables.json");
let { replaceTSIgnoreWithEmptyLine } = require("./codeTypeChecking")

module.exports = () => {

    function getModifiedChild(child, exportedVariables) {
        // A child will either have value properties or more children

        // Links have 'url's instead of 'value'
        if (child.url) {
            var urlCopy = child.url;
            Object.keys(exportedVariables).forEach(key => {
                urlCopy = urlCopy.split(`^{${key}}`).join(`${exportedVariables[key]}`)
            });

            child.url = urlCopy;
        }

        // If it has a value, check if it is using a variable. If it is then replace otherwise skip
        if (child.value) {
            var valueCopy = child.value;

            // For each entry in the variables object replace all occurences of that variable in the value string
            Object.keys(exportedVariables).forEach(key => {
                valueCopy = valueCopy.split(`^{${key}}`).join(`${exportedVariables[key]}`)
            });

            child.value = valueCopy;
        }

        // Some elements (for example titles in code blocks) appear under 'meta'
        if (child.meta) {
            var metaCopy = child.meta;

            Object.keys(exportedVariables).forEach(key => {
                metaCopy = metaCopy.split(`^{${key}}`).join(`${exportedVariables[key]}`)
            });

            child.meta = metaCopy;
        }

        // If it has children then repeat recursively
        if (child.children) {
            child.children = child.children.map(subChild => {
                return getModifiedChild(subChild, exportedVariables);
            })
        }

        return child;
    }

    return (data, file) => {
        let recipeName = file.path.split("/v2/")[1].split("/")[0]

        let configObjectForRecipe = configuredVariables[recipeName];

        let dataCopy = data;

        if (dataCopy.children.length) {
            dataCopy.children = dataCopy.children.map(child => {
                return replaceTSIgnoreWithEmptyLine(child);
            })
        }

        // If there is no config entry for the recipe, exit early
        if (!configObjectForRecipe) {
            return data;
        }

        if (dataCopy.children.length) {
            dataCopy.children = dataCopy.children.map(child => {
                return getModifiedChild(child, configObjectForRecipe);
            })

            return dataCopy;
        }

        // Returning nothing is the equivalent of returning the default data, this is just a precaution
        return data;
    }
}