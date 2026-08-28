import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import ArticlesPreview from "./ArticlesPreview";

function makeArticle(overrides = {}) {
  return {
    slug: "a-slug",
    title: "A Title",
    description: "d",
    tagList: [],
    author: { username: "jane" },
    createdAt: "2020-01-01T00:00:00.000Z",
    favorited: false,
    favoritesCount: 0,
    ...overrides,
  };
}

it("renders an ArticleImage with the article's image as its src", () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <ArticlesPreview articles={[makeArticle({ image: "https://example.com/cover.png" })]} />
      </MemoryRouter>
    </AuthProvider>,
  );

  expect(screen.getByAltText("A Title")).toHaveAttribute("src", "https://example.com/cover.png");
});

it("renders no image when the article has none", () => {
  render(
    <AuthProvider>
      <MemoryRouter>
        <ArticlesPreview articles={[makeArticle({ image: "" })]} />
      </MemoryRouter>
    </AuthProvider>,
  );

  expect(screen.queryByAltText("A Title")).not.toBeInTheDocument();
});
