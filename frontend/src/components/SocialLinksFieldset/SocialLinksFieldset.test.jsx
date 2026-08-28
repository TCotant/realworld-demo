import { fireEvent, render, screen } from "@testing-library/react";
import SocialLinksFieldset from "./SocialLinksFieldset";

it("renders one row per entry, populated with its label/url", () => {
  render(
    <SocialLinksFieldset
      links={[{ label: "GitHub", url: "https://github.com/jane" }]}
      onChange={vi.fn()}
    />
  );

  expect(screen.getByPlaceholderText("Label (e.g. GitHub)")).toHaveValue("GitHub");
  expect(screen.getByPlaceholderText("URL")).toHaveValue("https://github.com/jane");
});

it("clicking Add a link calls onChange with an appended empty entry", () => {
  const onChange = vi.fn();
  render(
    <SocialLinksFieldset
      links={[{ label: "GitHub", url: "https://github.com/jane" }]}
      onChange={onChange}
    />
  );

  fireEvent.click(screen.getByText("Add a link"));

  expect(onChange).toHaveBeenCalledWith([
    { label: "GitHub", url: "https://github.com/jane" },
    { label: "", url: "" },
  ]);
});

it("clicking a row's Remove calls onChange with that row excluded", () => {
  const onChange = vi.fn();
  render(
    <SocialLinksFieldset
      links={[
        { label: "GitHub", url: "https://github.com/jane" },
        { label: "Blog", url: "https://jane.example.com" },
      ]}
      onChange={onChange}
    />
  );

  fireEvent.click(screen.getAllByText("Remove")[0]);

  expect(onChange).toHaveBeenCalledWith([{ label: "Blog", url: "https://jane.example.com" }]);
});

it("typing in a row's url input calls onChange with just that field updated", () => {
  const onChange = vi.fn();
  render(
    <SocialLinksFieldset
      links={[{ label: "GitHub", url: "https://github.com/jane" }]}
      onChange={onChange}
    />
  );

  fireEvent.change(screen.getByPlaceholderText("URL"), {
    target: { value: "https://github.com/janedoe" },
  });

  expect(onChange).toHaveBeenCalledWith([
    { label: "GitHub", url: "https://github.com/janedoe" },
  ]);
});
