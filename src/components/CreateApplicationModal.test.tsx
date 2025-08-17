import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import CreateApplicationModal from "./CreateApplicationModal";

test("renders CreateApplicationModal with title and form", () => {
  const mockOnClose = vi.fn();
  const mockOnCreate = vi.fn();

  render(
    <CreateApplicationModal onClose={mockOnClose} onCreate={mockOnCreate} />
  );

  expect(screen.getByText(/add new application/i)).toBeInTheDocument();
});

test("calls onClose when dialog triggers onOpenChange", () => {
  const mockOnClose = vi.fn();
  const mockOnCreate = vi.fn();

  render(
    <CreateApplicationModal onClose={mockOnClose} onCreate={mockOnCreate} />
  );

  // Simulate the dialog closing
  fireEvent.keyDown(document, { key: "Escape" });
  expect(mockOnClose).toHaveBeenCalled();
});

test("submits form inside modal calls onCreate", async () => {
  const mockOnClose = vi.fn();
  const mockOnCreate = vi.fn();

  // Mock fetch to return a successful response
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, company: "Acme", position: "Dev" }),
    })
  ) as unknown as typeof fetch;

  render(
    <CreateApplicationModal onClose={mockOnClose} onCreate={mockOnCreate} />
  );

  fireEvent.change(screen.getByPlaceholderText(/company/i), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByPlaceholderText(/position/i), {
    target: { value: "Dev" },
  });

  const submitButton = screen.getByRole("button", { name: /add application/i });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(mockOnCreate).toHaveBeenCalledWith(
      expect.objectContaining({ company: "Acme", position: "Dev" })
    );
  });
});
