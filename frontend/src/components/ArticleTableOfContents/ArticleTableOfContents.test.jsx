import { fireEvent, render, screen } from "@testing-library/react";
import ArticleTableOfContents from "./ArticleTableOfContents";

// AC-098/AC-099: one link per heading, each pointing at its heading's id.
it("renders one link per heading, linking to its id", () => {
  const headings = [
    { level: 1, id: "title", text: "Title" },
    { level: 2, id: "section-one", text: "Section One" },
  ];

  render(<ArticleTableOfContents headings={headings} />);

  const titleLink = screen.getByRole("link", { name: "Title" });
  expect(titleLink).toHaveAttribute("href", "#title");

  const sectionLink = screen.getByRole("link", { name: "Section One" });
  expect(sectionLink).toHaveAttribute("href", "#section-one");
});

// AC-099: the app uses react-router-dom's HashRouter, which treats the
// entire URL fragment as its route - so a click must scroll the heading
// into view itself (and must not let the browser change
// window.location.hash), rather than relying on native anchor-jump
// behavior, which HashRouter would instead read as a navigation to a
// nonexistent route and blank the whole page.
it("scrolls the target heading into view on click, without navigating via the URL hash", () => {
  const headings = [{ level: 2, id: "section-one", text: "Section One" }];
  const target = document.createElement("h2");
  target.id = "section-one";
  document.body.appendChild(target);
  target.scrollIntoView = vi.fn();

  render(<ArticleTableOfContents headings={headings} />);

  const hashBefore = window.location.hash;
  fireEvent.click(screen.getByRole("link", { name: "Section One" }));

  expect(target.scrollIntoView).toHaveBeenCalledTimes(1);
  expect(window.location.hash).toBe(hashBefore);

  document.body.removeChild(target);
});

// AC-100: no table of contents (and no empty container) when there are no headings.
it("renders nothing when there are no headings", () => {
  const { container } = render(<ArticleTableOfContents headings={[]} />);

  expect(container).toBeEmptyDOMElement();
});
