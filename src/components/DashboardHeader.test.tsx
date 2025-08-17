import "../../tests/mockClerk";
import React from "react";
import { render, screen } from "@testing-library/react";
import DashboardHeader from "./DashboardHeader";

test("renders welcome message with Clerk user and wave emoji", () => {
  render(<DashboardHeader />);

  // check for welcome text including "Adam"
  const welcomeText = screen.getByText(/welcome back, adam/i);
  expect(welcomeText).toBeInTheDocument();

  // check for the wave emoji
  const waveEmoji = screen.getByRole("img", { name: /wave/i });
  expect(waveEmoji).toBeInTheDocument();
});
