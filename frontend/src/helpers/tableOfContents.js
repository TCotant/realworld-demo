// Byte-for-byte match of markdown-to-jsx 7.2.0's default slug algorithm
// (the `zn` function in dist/index.js), so passing this explicitly via
// options.slugify (in Article.jsx) changes nothing about today's already-
// existing, undocumented heading `id` output — it only makes the algorithm
// an explicit, shared value instead of an implicit library default.
export function slugifyHeading(text) {
  return text
    .replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g, "a")
    .replace(/[çÇ]/g, "c")
    .replace(/[ðÐ]/g, "d")
    .replace(/[ÈÉÊËéèêë]/g, "e")
    .replace(/[ÏïÎîÍíÌì]/g, "i")
    .replace(/[Ññ]/g, "n")
    .replace(/[øØœŒÕõÔôÓóÒò]/g, "o")
    .replace(/[ÜüÛûÚúÙù]/g, "u")
    .replace(/[ŸÿÝý]/g, "y")
    .replace(/[^a-z0-9- ]/gi, "")
    .replace(/ /gi, "-")
    .toLowerCase();
}

// Best-effort display cleanup only — never used for id generation. Strips
// the common inline markdown forms so "**Bold** word" reads as "Bold word"
// in the table of contents instead of showing literal `**`.
export function stripInlineMarkdown(text) {
  return text
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // [label](url) -> label
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/`([^`]*)`/g, "$1"); // inline code
}

// Splits out fenced code blocks (``` or ~~~) before scanning, so a line
// that merely *looks* like a heading inside a code sample is never mistaken
// for one — mirrors markdown-to-jsx's own rule priority, where
// codeFenced/codeBlock are matched before heading.
const FENCE_RE = /^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1[ \t]*$/gm;
// Space between the hashes and the heading text is optional, matching
// markdown-to-jsx's own ATX-heading regex (` *(#{1,6}) *([^\n]+?)…`) —
// e.g. "#NoSpace" renders as a real <h1> and must not be missed here.
const HEADING_RE = /^ {0,3}(#{1,6})[ \t]*([^\n]+?)(?:[ \t]+#+)?[ \t]*$/gm;

// Out of scope for v1 (matches only top-level ATX headings against the raw
// body, one line at a time): a heading nested inside a blockquote or list
// item — e.g. "> # Heading" or "- # Heading" — is rendered as a real
// heading by markdown-to-jsx (which recursively re-parses blockquote/list
// item content as block-level markdown), but is not matched here and so is
// silently omitted from the table of contents. Detecting this without
// re-implementing the library's own block-nesting rules was judged the
// same fragile, hand-rolled-parser trap as the Setext-heading and indented-
// code-block gaps noted below.
export function extractHeadings(body) {
  if (!body) return [];

  const withoutFences = body.replace(FENCE_RE, "");
  const headings = [];

  for (const match of withoutFences.matchAll(HEADING_RE)) {
    const [, hashes, rawText] = match;
    headings.push({
      level: hashes.length,
      id: slugifyHeading(rawText),
      text: stripInlineMarkdown(rawText),
    });
  }

  return headings;
}
