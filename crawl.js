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

async function getCurrentHTML(currentURL) {
  try {
    const response = await fetch(currentURL);
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
    return htmlBody;
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // Make sure the currentURL is on the same host as the baseURL
  const checkBaseURL = new URL(baseURL);
  const checkCurrentURL = new URL(currentURL);
  if (checkBaseURL.hostname !== checkCurrentURL.hostname) {
    return pages;
  }

  const normalizedURL = normalizeURL(currentURL);
  // If pages contains normalCurrentURL, increment pages and return pages
  // else add to pages and set a count of 1
  if (pages[normalizedURL]) {
    pages[normalizedURL]++;
    return pages
  } else {
    pages[normalizedURL] = 1;
  }
  
  // Get the htmlBody text from normalCurrentURL
  const htmlBody = await getCurrentHTML(currentURL);
  // If no htmlbody, return pages
  if (!htmlBody) {
    return pages;
  }
  // Get all valid URLs from htmlBody
  const validURLS = getURLsFromHTML(htmlBody, baseURL);
  for (const validURL of validURLS) {
    pages = crawlPage(baseURL, validURL, pages);
    console.log(pages)
  }
  // Return a list of pages
  return pages;
}

export { normalizeURL, getURLsFromHTML, crawlPage };