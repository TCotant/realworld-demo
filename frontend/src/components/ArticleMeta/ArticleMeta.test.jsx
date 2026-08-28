import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import ArticleMeta from "./ArticleMeta";

function LocationProbe() {
  const { state } = useLocation();
  return <div data-testid="state">{JSON.stringify(state)}</div>;
}

// AC-093: social links must still reach the profile page when it's opened
// via an article's author byline, which supplies profile data through
// navigation state (REQ-043) rather than a fresh fetch - so that state must
// carry socialLinks alongside the other author fields it already carries.
it("includes the author's socialLinks in the profile link's navigation state", () => {
  const author = {
    username: "jane",
    bio: "hi",
    image: "",
    following: false,
    followersCount: 0,
    socialLinks: [{ label: "GitHub", url: "https://github.com/jane" }],
  };

  render(
    <MemoryRouter initialEntries={["/article/a-slug"]}>
      <Routes>
        <Route
          path="/article/a-slug"
          element={<ArticleMeta author={author} createdAt="2020-01-01T00:00:00.000Z" />}
        />
        <Route path="/profile/:username" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

  fireEvent.click(screen.getByText("jane"));

  expect(screen.getByTestId("state").textContent).toContain("https://github.com/jane");
});
