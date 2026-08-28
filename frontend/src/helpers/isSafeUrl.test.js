import isSafeUrl from "./isSafeUrl";

it.each([
  "https://github.com/jane",
  "http://example.com",
  "//example.com/path",
  "github.com/jane",
])("%p is safe", (url) => {
  expect(isSafeUrl(url)).toBe(true);
});

it.each([
  "javascript:alert(1)",
  "  javascript:alert(1)",
  "JavaScript:alert(1)",
  "data:text/html,<script>alert(1)</script>",
  "vbscript:msgbox(1)",
])("%p is unsafe", (url) => {
  expect(isSafeUrl(url)).toBe(false);
});
