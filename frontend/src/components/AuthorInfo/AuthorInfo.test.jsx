import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthProvider from "../../context/AuthContext";
import AuthorInfo from "./AuthorInfo";

vi.mock("markdown-to-jsx", () => ({ default: ({ children }) => <div>{children}</div> }));

function renderAuthorInfo(profileState) {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={[{ pathname: "/profile/jane", state: profileState }]}>
        <Routes>
          <Route path="/profile/:username" element={<AuthorInfo />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );
}

// AC-093: each social link renders as a clickable hyperlink to its URL.
it("renders each social link as an anchor to its url", () => {
  renderAuthorInfo({
    bio: "",
    followersCount: 0,
    following: false,
    image: "",
    socialLinks: [
      { label: "GitHub", url: "https://github.com/jane" },
      { label: "", url: "https://jane.example.com" },
    ],
  });

  expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/jane",
  );
  expect(
    screen.getByRole("link", { name: "https://jane.example.com" }),
  ).toHaveAttribute("href", "https://jane.example.com");
});

// AC-094: no social links -> no links list rendered.
it("renders no links list when socialLinks is empty", () => {
  renderAuthorInfo({ bio: "", followersCount: 0, following: false, image: "", socialLinks: [] });

  expect(document.querySelector(".social-links")).not.toBeInTheDocument();
});

// AC-095: a link with a label uses the label as its text; one with no
// label uses the url itself.
it("uses the label as link text when provided, and the url when not", () => {
  renderAuthorInfo({
    bio: "",
    followersCount: 0,
    following: false,
    image: "",
    socialLinks: [
      { label: "My Blog", url: "https://jane.example.com" },
      { label: "", url: "https://github.com/jane" },
    ],
  });

  expect(screen.getByText("My Blog")).toBeInTheDocument();
  expect(screen.getByText("https://github.com/jane")).toBeInTheDocument();
});

// A link whose URL uses a script-executing scheme (e.g. javascript:) is
// shown as plain text rather than a clickable anchor, so it can't execute
// script in the page's origin on click.
it("renders a javascript: URL as plain text, not a clickable link", () => {
  renderAuthorInfo({
    bio: "",
    followersCount: 0,
    following: false,
    image: "",
    socialLinks: [{ label: "Suspicious", url: "javascript:alert(1)" }],
  });

  expect(screen.getByText("Suspicious")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Suspicious" })).not.toBeInTheDocument();
});
