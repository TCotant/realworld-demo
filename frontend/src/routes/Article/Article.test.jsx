import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import Article from "./Article";

// markdown-to-jsx's ESM/CJS interop breaks under vitest's SSR transform in
// this environment; body rendering isn't what this test cares about.
vi.mock("markdown-to-jsx", () => ({ default: ({ children }) => <div>{children}</div> }));

function renderArticle(articleState) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: "/article/a-slug", state: articleState }]}>
        <Routes>
          <Route path="/article/:slug" element={<Article />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

// REQ-043: navigation state is rendered directly, without refetching - so
// this exercises the state-supplied `image` without needing to mock
// getArticle.
it("renders an ArticleImage with the article's image as its src", () => {
  renderArticle({
    title: "A Title",
    body: "body text",
    tagList: [],
    createdAt: "2020-01-01T00:00:00.000Z",
    author: { username: "jane", following: false, followersCount: 0 },
    image: "https://example.com/cover.png",
  });

  expect(screen.getByAltText("A Title")).toHaveAttribute("src", "https://example.com/cover.png");
});

it("renders no image when the article has none", () => {
  renderArticle({
    title: "A Title",
    body: "body text",
    tagList: [],
    createdAt: "2020-01-01T00:00:00.000Z",
    author: { username: "jane", following: false, followersCount: 0 },
    image: "",
  });

  expect(screen.queryByAltText("A Title")).not.toBeInTheDocument();
});

// AC-098/AC-100: table of contents presence follows from headings in the body.
it("renders a table of contents and the wide column split when the body has headings", () => {
  const { container } = renderArticle({
    title: "A Title",
    body: "# Heading One\n\nSome text.\n\n## Heading Two",
    tagList: [],
    createdAt: "2020-01-01T00:00:00.000Z",
    author: { username: "jane", following: false, followersCount: 0 },
  });

  expect(screen.getByRole("navigation", { name: "Table of contents" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Heading One" })).toHaveAttribute("href", "#heading-one");
  expect(screen.getByRole("link", { name: "Heading Two" })).toHaveAttribute("href", "#heading-two");
  expect(container.querySelector(".col-md-9")).not.toBeNull();
  expect(container.querySelector(".col-md-12")).toBeNull();
});

it("renders no table of contents and the full-width column when the body has no headings", () => {
  const { container } = renderArticle({
    title: "A Title",
    body: "Just some text with no headings.",
    tagList: [],
    createdAt: "2020-01-01T00:00:00.000Z",
    author: { username: "jane", following: false, followersCount: 0 },
  });

  expect(screen.queryByRole("navigation", { name: "Table of contents" })).not.toBeInTheDocument();
  expect(container.querySelector(".col-md-12")).not.toBeNull();
  expect(container.querySelector(".col-md-9")).toBeNull();
});

// AC-101: the table of contents reflects the same body content whether it
// arrived via navigation state (REQ-043) or was fetched, without an extra request.
it("derives the table of contents from state-supplied body without fetching", () => {
  renderArticle({
    title: "A Title",
    body: "# Only Heading",
    tagList: [],
    createdAt: "2020-01-01T00:00:00.000Z",
    author: { username: "jane", following: false, followersCount: 0 },
  });

  expect(screen.getByRole("link", { name: "Only Heading" })).toBeInTheDocument();
});

// AC-102: viewing an article again after its body was edited (headings
// added, removed, or reordered) reflects the updated set and order.
it("reflects an edited body's updated set and order of headings on a subsequent view", () => {
  const { container: firstView, unmount } = renderArticle({
    title: "A Title",
    body: "# First\n\n## Second",
    tagList: [],
    createdAt: "2020-01-01T00:00:00.000Z",
    author: { username: "jane", following: false, followersCount: 0 },
  });

  expect(
    Array.from(firstView.querySelectorAll(".article-toc a")).map((link) => link.textContent),
  ).toEqual(["First", "Second"]);

  unmount();

  const { container: secondView } = renderArticle({
    title: "A Title",
    body: "# Second\n\n## Third",
    tagList: [],
    createdAt: "2020-01-01T00:00:00.000Z",
    author: { username: "jane", following: false, followersCount: 0 },
  });

  expect(
    Array.from(secondView.querySelectorAll(".article-toc a")).map((link) => link.textContent),
  ).toEqual(["Second", "Third"]);
});
