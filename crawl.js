import { URL } from "url";
import { JSDOM } from "jsdom";

function normalizeURL(dirtyURL) {
    const normalURL = dirtyURL.endsWith('/') ? new URL(dirtyURL.slice(0, -1)) : new URL(dirtyURL)
    return normalURL.pathname === '/' ? normalURL.hostname : `${normalURL.hostname}${normalURL.pathname}`;
};

function getURLsFromHTML(htmlBody, baseURL) {
    if (baseURL.endsWith('/')) {
        baseURL = baseURL.slice(0, -1);
    };
    const dom = new JSDOM(htmlBody);
    let nodeLinks = dom.window.document.querySelectorAll('a');
    let urls = Array.from(nodeLinks).map(link => link.href);

    const transformedUrls = urls.map(url => {
        if(url.startsWith('http://') || url.startsWith('https://')) {
          // It's an absolute URL, maybe we don't need to change it
          return url;
        } else {
          // It's a relative URL, so we transform it
          // Example transformation: prepend a base URL
          return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`
        };
      });
    
    return transformedUrls;
};

export { normalizeURL, getURLsFromHTML };