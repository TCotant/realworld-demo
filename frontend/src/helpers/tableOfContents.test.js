import { extractHeadings, slugifyHeading, stripInlineMarkdown } from "./tableOfContents";

it.each([
  ["Hello World", "hello-world"],
  ["Café Résumé", "cafe-resume"],
  ["What's New?", "whats-new"],
])("slugifies %p to %p", (input, expected) => {
  expect(slugifyHeading(input)).toBe(expected);
});

it.each([
  ["**Bold** word", "Bold word"],
  ["_Italic_ word", "Italic word"],
  ["`code` word", "code word"],
  ["[label](https://example.com) word", "label word"],
  ["Plain text", "Plain text"],
])("strips inline markdown from %p", (input, expected) => {
  expect(stripInlineMarkdown(input)).toBe(expected);
});

// AC-098: headings are returned in body order with correct level/text/id.
it("extracts headings in body order with level, text, and id", () => {
  const body = "# Title\n\nSome text.\n\n## Section One\n\nMore text.\n\n### Subsection";

  expect(extractHeadings(body)).toEqual([
    { level: 1, id: "title", text: "Title" },
    { level: 2, id: "section-one", text: "Section One" },
    { level: 3, id: "subsection", text: "Subsection" },
  ]);
});

// AC-100: a body with no headings returns an empty array.
it("returns an empty array when the body has no headings", () => {
  expect(extractHeadings("Just some text.\n\nNo headings here.")).toEqual([]);
});

it("returns an empty array for an empty or falsy body", () => {
  expect(extractHeadings("")).toEqual([]);
  expect(extractHeadings(undefined)).toEqual([]);
});

it("excludes a heading-looking line inside a fenced code block", () => {
  const body = "# Real Heading\n\n```\n# Not a heading\n```\n\n## Also Real";

  expect(extractHeadings(body)).toEqual([
    { level: 1, id: "real-heading", text: "Real Heading" },
    { level: 2, id: "also-real", text: "Also Real" },
  ]);
});

// markdown-to-jsx's own ATX-heading regex allows zero spaces between the
// hashes and the text (e.g. "#NoSpace" renders as a real <h1>), so this
// must be extracted too, not just the conventional "# With Space" form.
it("extracts a heading with no space between the hashes and the text", () => {
  expect(extractHeadings("#NoSpace")).toEqual([{ level: 1, id: "nospace", text: "NoSpace" }]);
});

// AC-103: a Setext-style heading is rendered by markdown-to-jsx but is not
// ATX syntax, so it's a documented gap in this line-scanning approach.
it("does not extract a Setext-style heading", () => {
  expect(extractHeadings("Title\n=====\n\nSome text.")).toEqual([]);
});

// AC-104: two headings with identical text produce identical ids, since
// markdown-to-jsx's own default slugify has no collision handling either.
it("gives two identically-worded headings the same id", () => {
  expect(extractHeadings("# Repeat\n\n## Repeat")).toEqual([
    { level: 1, id: "repeat", text: "Repeat" },
    { level: 2, id: "repeat", text: "Repeat" },
  ]);
});

// AC-105: a heading nested inside a blockquote or list item is rendered as
// a real heading by markdown-to-jsx's recursive re-parsing, but this
// line-by-line scan only matches a heading at the start of a line.
it("does not extract a heading nested inside a blockquote", () => {
  expect(extractHeadings("> # In Blockquote\n\nText")).toEqual([]);
});

it("does not extract a heading nested inside a list item", () => {
  expect(extractHeadings("- # In List Item\n\nText")).toEqual([]);
});

it("slugifies the raw heading text, matching what options.slugify receives internally", () => {
  const rawText = "**Bold** Heading";
  const body = `## ${rawText}`;

  const [heading] = extractHeadings(body);

  expect(heading.id).toBe(slugifyHeading(rawText));
  expect(heading.text).toBe(stripInlineMarkdown(rawText));
});
