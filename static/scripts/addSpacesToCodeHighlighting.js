// this is used in the buildDocs script.
// It takes a .md file location and is used to add spaces after or 
// before code highlight tags

let fs = require('fs')

let mdFile = process.argv[2];

fs.readFile(mdFile, 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    let originalData = data;

    let matched = data.match(/__HIGHLIGHT_PHRASE__[^ ]/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            data = data.replace(matched[i], "__HIGHLIGHT_PHRASE__ " + matched[i].charAt(matched[i].length - 1));
        }
    }

    matched = data.match(/__HIGHLIGHT__[^ ]/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            data = data.replace(matched[i], "__HIGHLIGHT__ " + matched[i].charAt(matched[i].length - 1));
        }
    }

    matched = data.match(/[^ ]__END_HIGHLIGHT_PHRASE__/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            data = data.replace(matched[i], matched[i].charAt(0) + " __END_HIGHLIGHT_PHRASE__");
        }
    }

    matched = data.match(/[^ ]__END_HIGHLIGHT__/g);
    if (matched != null) {
        for (let i = 0; i < matched.length; i++) {
            data = data.replace(matched[i], matched[i].charAt(0) + " __END_HIGHLIGHT__");
        }
    }

    if (data !== originalData) {
        fs.writeFile(mdFile, data, 'utf8', function (err) {
            if (err) return console.log(err);
        });
    }
});