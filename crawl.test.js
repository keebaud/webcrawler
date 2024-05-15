import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl.js";

test("Secure with trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev/path/")).toBe("blog.boot.dev/path")
});
test("Secure without trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev/path")).toBe("blog.boot.dev/path")
});
test("Insecure with trailing slash", () => {
    expect(normalizeURL("http://blog.boot.dev/path/")).toBe("blog.boot.dev/path")
});
test("Insecure without trailing slash", () => {
    expect(normalizeURL("http://blog.boot.dev/path")).toBe("blog.boot.dev/path")
});
test("Secure with no path and trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev/")).toBe("blog.boot.dev")
});
test("Secure with no path without trailing slash", () => {
    expect(normalizeURL("https://blog.boot.dev")).toBe("blog.boot.dev")
});
describe('getURLsFromHTML', () => {
    it('should return an array of URLs', () => {
      const htmlContent = `<a href="https://example.com">Example</a><a href="/relative">Relative</a>`;
      const baseURL = 'https://test.com';
      const expected = ['https://example.com', 'https://test.com/relative'];
      const result = getURLsFromHTML(htmlContent, baseURL);
  
      expect(result).toEqual(expected);
    });
  });