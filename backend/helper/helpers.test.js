const { slugify, normalizeSocialLinks } = require("./helpers");

describe("Slugify", () => {
  const stringsArray = [
    "  Hello World  ",
    "  Hello WORLD  ",
    " HELLO WORLD",
    "Hello World",
    "Hello_world ",
    "Hello-world",
  ];

  test.each(stringsArray)("%p", (string) => {
    expect(slugify(string)).toBe("hello-world");
  });
});

describe("normalizeSocialLinks", () => {
  // REQ-051: entries are trimmed and any entry whose URL is blank or
  // whitespace-only after trimming is discarded.
  test("trims label/url and drops an entry with a blank/whitespace-only url", () => {
    const result = normalizeSocialLinks([
      { label: "  GitHub  ", url: "  https://github.com/jane  " },
      { label: "Blank", url: "   " },
      { label: "", url: "" },
    ]);

    expect(result).toEqual([{ label: "GitHub", url: "https://github.com/jane" }]);
  });
});
