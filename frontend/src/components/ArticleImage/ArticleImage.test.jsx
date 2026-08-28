import { fireEvent, render, screen } from "@testing-library/react";
import ArticleImage from "./ArticleImage";

it("renders an img with the given src when src is present", () => {
  render(<ArticleImage alt="cover" src="https://example.com/cover.png" />);

  const img = screen.getByRole("img");
  expect(img).toHaveAttribute("src", "https://example.com/cover.png");
});

it.each([[null], [undefined], [""]])("renders nothing when src is %s", (src) => {
  const { container } = render(<ArticleImage alt="cover" src={src} />);

  expect(container).toBeEmptyDOMElement();
});

it("renders nothing after the img fires onError", () => {
  const { container } = render(<ArticleImage alt="cover" src="https://example.com/broken.png" />);

  fireEvent.error(screen.getByRole("img"));

  expect(container).toBeEmptyDOMElement();
});
