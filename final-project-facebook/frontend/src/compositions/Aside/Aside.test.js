import React from "react";
import { render, screen } from "@testing-library/react";
import Aside from "./Aside.jsx";

describe("Aside component", () => {
  test("renders children correctly", () => {
    const { getByText } = render(
      <Aside>
        <p>Test Child</p>
      </Aside>
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });
  test("has a className", () => {
    const { container } = render(
      <Aside className="aside-wrapper">
        <p>Test Child</p>
      </Aside>
    );
    expect(container.firstChild).toHaveClass("aside-wrapper");
  });
  test("spreads restProps in Aside component", () => {
    const { container } = render(
      <Aside data-testid="aside-element">
        <p>Test Child</p>
      </Aside>
    );
    expect(container.firstChild).toHaveAttribute("data-testid");
  });
});
