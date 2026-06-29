import React from "react";
import { render } from "@testing-library/react";
import Feed from "./Feed.jsx";

describe("Feed component", () => {
  test("renders children correctly", () => {
    const { getByText } = render(
      <Feed>
        <p>Test Child</p>
      </Feed>
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });
  test("has a className", () => {
    const { container } = render(
      <Feed className="test">
        <p>Test Child</p>
      </Feed>
    );
    expect(container.firstChild).toHaveClass("test");
  });
});