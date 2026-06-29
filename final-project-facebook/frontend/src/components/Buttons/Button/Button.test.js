import React from "react";
import { render, screen } from "@testing-library/react";
import Button from "./Button";

describe("Button tests", () => {
  test("should render chilren text", () => {
    render(<Button>test</Button>);
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  test("should apply passed className", () => {
    const { container } = render(
      <Button className="test-class">test</Button>
    );
    expect(container.firstChild).toHaveClass("test-class");
  });

  test.each([["button"], ["submit"]])(
    "should set button type to '%s'",
    (type) => {
      const { container } = render(
        <Button type={type}>test</Button>
      );
      expect(container.firstChild).toHaveAttribute("type", type);
    }
  );

  test("should default button type to 'button' if not specified", () => {
    const { container } = render(<Button>test</Button>);
    expect(container.firstChild).toHaveAttribute("type", "button");
  });

  test("should pass other props to button element", () => {
    const { container } = render(
      <Button data-test="data-attr">test</Button>
    );
    expect(container.firstChild).toHaveAttribute("data-test", "data-attr");
  });

  test("should call onClick handler", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>test</Button>);
    screen.getByText(/test/i).click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
