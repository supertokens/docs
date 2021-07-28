module.exports = () => {
    // Copied from Stack Overflow
    function getIndicesOf(searchStr, str, caseSensitive) {
        var searchStrLen = searchStr.length;
        if (searchStrLen == 0) {
            return [];
        }
        var startIndex = 0, index, indices = [];
        if (!caseSensitive) {
            str = str.toLowerCase();
            searchStr = searchStr.toLowerCase();
        }
        while ((index = str.indexOf(searchStr, startIndex)) > -1) {
            indices.push(index);
            startIndex = index + searchStrLen;
        }
        return indices;
    }

    function getModifiedChild(child, exportedVariables) {
        // A child will either have a value or more children
        // If it has a value, check if it is using a variable. If it is then replace otherwise skip
        if (child.value && child.value.includes("^{")) {
            console.log("Markdown variables ran");
            var valueCopy = child.value;
            // Find all occurences of ^{ to find starting points of all variables used in the file
            var indices = getIndicesOf("^{", valueCopy);
            // Sort by descending, this helps when replacing later because you replace last instance first and dont need to worry about indices changing
            indices.sort((a, b) => b - a);
            indices.forEach(index => {
                // Find the end index of the var declaration starting from current index
                let endIndexRange = valueCopy.substring(index, valueCopy.length).indexOf("}");
                let fullVariableDeclaration = valueCopy.substring(index, index + endIndexRange + 1);
                let variableName = fullVariableDeclaration.replace("^{", "").replace("}", "").trim();
                if (exportedVariables[variableName]) {
                    valueCopy = valueCopy.substring(0, index) + exportedVariables[variableName] + valueCopy.substring(index + endIndexRange + 1);
                }
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
        var dataCopy = data;
        if (dataCopy.children.length) {
            var exportedData = {};
            dataCopy.children.forEach(child => {
                // Check if the markdown file has a valid export declaration, if it does parse it
                if (child.type === "export" && child.value.includes("pluginVariableData")) {
                    let exportString = child.value;

                    exportString.split("\n").forEach(splitValue => {
                        // Remove unwanted characters
                        splitValue = splitValue.replace("\\n", "");
                        splitValue = splitValue.replace(/["']/g, "");

                        // Remove trailing comma if present
                        if (splitValue.charAt(splitValue.length - 1) === ",") {
                            splitValue = splitValue.substring(0, splitValue.length - 1);
                        }

                        // Extract key value pairs and store in exported data
                        if (splitValue.includes(":")) {
                            let keyValPair = splitValue.split(":");
                            exportedData[keyValPair[0].trim()] = keyValPair[1].trim();
                        }
                    });
                }
            });

            dataCopy.children = dataCopy.children.map(child => {
                return getModifiedChild(child, exportedData);
            })

            return dataCopy;
        }
    }
}