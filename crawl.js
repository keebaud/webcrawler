import { URL } from "url";
import { JSDOM } from "jsdom";
// import { get } from "http";

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
          return url.endsWith('/') ? url.slice(0, -1) : url;
        } else {
          // It's a relative URL, so we transform it
          // Example transformation: prepend a base URL
          return `${baseURL}${url.startsWith('/') ? '' : '/'}${url}`
        };
      });
    
    return transformedUrls;
};

async function crawlPage(baseURL) {
  try {
    const response = await fetch(baseURL);
    if (response.status >= 400) {
      console.log(`Website response code: ${response.status}`);
      return;
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      console.log('Content Type does not include text/html');
      return;
    }

    const htmlBody = await response.text();
    console.log(htmlBody);
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

export { normalizeURL, getURLsFromHTML, crawlPage };