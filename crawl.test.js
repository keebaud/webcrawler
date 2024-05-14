import { test, expect } from "@jest/globals";
import { normalizeURL } from "./crawl.js";

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