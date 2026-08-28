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
