module.exports = () => {
    return (data, file) => {
        data.children = data.children.map(child => {
            if (child.type === "heading") {
                child.children = child.children.map(headingChild => {
                    if (headingChild.type === "text") {
                        headingChild.value = headingChild.value
                            .replace("[[pre]]", "")
                            .replace("[[cust]]", "")
                            .trim();
                    }

                    return headingChild;
                });
            }

            return child;
        });

        return data;
    }
}