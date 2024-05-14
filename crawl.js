import { URL } from "url";

function normalizeURL(dirtyURL) {
    const normalURL = dirtyURL.endsWith('/') ? new URL(dirtyURL.slice(0, -1)) : new URL(dirtyURL)
    return normalURL.pathname === '/' ? normalURL.hostname : `${normalURL.hostname}${normalURL.pathname}`;
};

export { normalizeURL };