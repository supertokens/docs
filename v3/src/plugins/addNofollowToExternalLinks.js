const url = require("url");

module.exports = () => {
  /**
   * Check if the URL is external or not
   * @param {string} href the URL that is to be checked
   * @returns boolean true if the URL is external and false otherwise
   */
  function isUrlExternal (href) {
    try {
      const hrefFromURL = new url.URL(href);
      const host = hrefFromURL.host;
      const protocol = hrefFromURL.protocol;

      // no nofollow needed for email or phone number links
      if (protocol === "mailto:" || protocol === "tel:") {
        return false;
      }

      // if the host contains `supertokens.com`
      if (host.includes("supertokens.com")) {
        return false;
      }

      // if the host does not contain `supertokens.com`, it is an external URL
      return true;
    } catch {
      // the URL constructor throws in case the URL is relative
      // in that case it is not an external url
      return false;
    }
  }

  /**
   * Check if the node element is a link and if it should have `nofollow`
   * @param {Node} data element node from the document's tree
   * @returns boolean true if `nofollow` should be added and false otherwise
   */
  function shouldAddNofollowToLink (data) {
    return (
      data !== undefined &&
      data.type === "element" &&
      data.tagName === "a" &&
      data.properties !== undefined &&
      isUrlExternal(data.properties.href)
    )
  }

  /**
   * Add `nofollow` to the element passed if it is an external link and recursively do the same to the element's children
   * @param {Node} data element node from the document's tree
   * @returns updated element with `nofollow` in external links
   */
  function addNofollowToExternalLinks(data) {
    try {
      if (shouldAddNofollowToLink(data)) {
        data.properties = Object.assign({}, data.properties, {
          rel: "nofollow noreferrer noopener"
        });
      }
  
      if (data.children) {
        data.children = data.children.map((child) => {
          return addNofollowToExternalLinks(child);
        });
      }
  
      return data;
    } catch (error) {
      console.log(error.message);
    }
  };

  const transformer = (data, _) => {
    if (data.children !== undefined && data.children.length > 0) {
      data.children = data.children.map((child) => {
        return addNofollowToExternalLinks(child);
      });
    }
    return data;
  }

  return transformer;
}
