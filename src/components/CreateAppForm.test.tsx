import "../../tests/mockClerk";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import CreateAppForm from "./CreateAppForm";

import { mock } from "node:test";

// Rendering
// Ensure all inputs and the submit button render
// Check placeholders and labels
test("renders all form fields", () => {
  render(<CreateAppForm onCreate={vi.fn()} />);

  expect(screen.getByPlaceholderText(/company/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/position/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/location/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/job url/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/resume link/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/notes/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/contact name/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/contact email/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/contact phone/i)).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/tags/i)).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /add application/i })
  ).toBeInTheDocument();
});

// User interactions / form behavior
// For testing the submit, mock fetch and/or toast so you're not hitting the backend
test("submits form with correct data", async () => {
  const mockOnCreate = vi.fn();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: "1",
          company: "Acme",
          tags: [{ name: "urgent" }, { name: "remote" }],
        }),
    })
  ) as any;

  render(<CreateAppForm onCreate={mockOnCreate} />);

  fireEvent.change(screen.getByPlaceholderText(/company/i), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByPlaceholderText(/position/i), {
    target: { value: "Dev" },
  });
  fireEvent.change(screen.getByPlaceholderText(/tags/i), {
    target: { value: "urgent,remote" },
  });

  fireEvent.click(screen.getByRole("button", { name: /add application/i }));

  await waitFor(() => expect(mockOnCreate).toHaveBeenCalled());

  const calledArg = mockOnCreate.mock.calls[0][0];
  expect(calledArg.tags).toEqual([{ name: "urgent" }, { name: "remote" }]);
  expect(calledArg.company).toBe("Acme");
});

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

import toast from "react-hot-toast";

test("shows success toast on successful submission", async () => {
  const mockOnCreate = vi.fn();

  // Mock fetch to succeed
  global.fetch = vi.fn(
    () =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ id: 1, company: "Acme", tags: [] }),
      }) as any
  );

  render(<CreateAppForm onCreate={mockOnCreate} />);

  fireEvent.change(screen.getByPlaceholderText(/company/i), {
    target: { value: "Acme" },
  });

  fireEvent.change(screen.getByPlaceholderText(/position/i), {
    target: { value: "Engineer" },
  });

  fireEvent.click(screen.getByRole("button", { name: /add application/i }));

  // wait for the side effects
  await waitFor(() => {
    expect(mockOnCreate).toHaveBeenCalled();
    expect(toast.success).toHaveBeenCalledWith("Application added!");
  });
});

test("shows error toast on failed submission", async () => {
  const mockOnCreate = vi.fn();

  // Mock fetch to fail
  global.fetch = vi.fn(
    () =>
      Promise.resolve({
        ok: false,
      }) as any
  );

  render(<CreateAppForm onCreate={mockOnCreate} />);

  // Fill in required fields
  fireEvent.change(screen.getByPlaceholderText(/company/i), {
    target: { value: "Acme" },
  });

  fireEvent.change(screen.getByPlaceholderText(/position/i), {
    target: { value: "Engineer" },
  });

  fireEvent.click(screen.getByRole("button", { name: /add application/i }));

  // wait for the side effects
  await waitFor(() => {
    expect(mockOnCreate).not.toHaveBeenCalled();
    expect(toast.error).toHaveBeenCalledWith("Something went wrong.");
  });
});

// Reset behaviors after success
test("clears inputs after successful submission", async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, company: "Acme" }),
    })
  ) as any;

  render(<CreateAppForm onCreate={vi.fn()} />);

  fireEvent.change(screen.getByPlaceholderText(/company/i), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByPlaceholderText(/position/i), {
    target: { value: "Engineer" },
  });
  fireEvent.click(screen.getByRole("button", { name: /add application/i }));

  await waitFor(() => {
    expect(screen.getByPlaceholderText(/company/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/position/i)).toHaveValue("");
  });
});

test("parses multiple tags with extra commas and spaces", async () => {
  const mockOnCreate = vi.fn();
  global.fetch = vi.fn((url, options) => {
    const body = JSON.parse(options.body); // parse the request body
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ ...body, id: 1 }), // echo body + add id
    });
  }) as any;

  render(<CreateAppForm onCreate={mockOnCreate} />);
  fireEvent.change(screen.getByPlaceholderText(/company/i), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByPlaceholderText(/position/i), {
    target: { value: "Dev" },
  });
  fireEvent.change(screen.getByPlaceholderText(/tags/i), {
    target: { value: " urgent, , remote, , ,high-priority " },
  });

  fireEvent.click(screen.getByRole("button", { name: /add application/i }));

  await waitFor(() => {
    const calledArg = mockOnCreate.mock.calls[0][0];
    expect(calledArg.tags).toEqual([
      { name: "urgent" },
      { name: "remote" },
      { name: "high-priority" },
    ]);
  });
});

test("submits with optional fields empty", async () => {
  const mockOnCreate = vi.fn();
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({ id: 1, company: "Acme", position: "Dev", tags: [] }),
    })
  ) as any;

  render(<CreateAppForm onCreate={mockOnCreate} />);

  fireEvent.change(screen.getByPlaceholderText(/company/i), {
    target: { value: "Acme" },
  });
  fireEvent.change(screen.getByPlaceholderText(/position/i), {
    target: { value: "Dev" },
  });

  fireEvent.click(screen.getByRole("button", { name: /add application/i }));

  await waitFor(() => expect(mockOnCreate).toHaveBeenCalled());
});
