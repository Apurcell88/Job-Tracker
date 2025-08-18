import React from "react";
import DashboardApplications from "./DashboardApplications";

import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Status } from "@/generated/prisma";
import { vi } from "vitest";

test("fetches recent applications on mount", async () => {
  const mockData = {
    total: 2,
    recentApplications: [
      {
        id: 1,
        company: "Acme",
        position: "Dev",
        tags: [],
        appliedDate: "2025-08-17",
        status: "APPLIED",
      },
      {
        id: 2,
        company: "Globex",
        position: "QA",
        tags: [],
        appliedDate: "2025-08-16",
        status: "APPLIED",
      },
    ],
  };

  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockData),
    })
  ) as any;

  render(<DashboardApplications onStatusChange={vi.fn()} />);

  await waitFor(() => {
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Globex")).toBeInTheDocument();
  });

  expect(fetch).toHaveBeenCalledWith("/api/applications/recent");
});

// Mock CreateApplicationModal to expose onCreate
vi.mock("./CreateApplicationModal", () => {
  return {
    __esModule: true,
    default: ({ onCreate }: any) => (
      <button
        data-testid="mock-add-app"
        onClick={() =>
          onCreate({
            id: "1",
            company: "Acme",
            position: "Developer",
            appliedDate: "2025-08-17",
            status: "APPLIED" as Status,
            tags: [],
            location: "",
            jobUrl: "",
            notes: "",
            resumeLink: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
          })
        }
      >
        Mock Add Application
      </button>
    ),
  };
});

test("adds a new application correctly", async () => {
  const mockOnStatusChange = vi.fn();

  // Mock fetch to return empty recent applications
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ total: 0, recentApplications: [] }),
    })
  ) as any;

  render(<DashboardApplications onStatusChange={mockOnStatusChange} />);

  // Click the DashboardApplications "+ Add Application" button
  fireEvent.click(screen.getByText(/\+ Add Application/i));

  // Wait for the mocked modal button to appear
  await waitFor(() => screen.getByTestId("mock-add-app"));

  // Click the mocked modal button to "add" the application
  fireEvent.click(screen.getByTestId("mock-add-app"));

  // Wait for the new application to appear in the table
  await waitFor(() => {
    expect(screen.getByText("Acme")).toBeInTheDocument();
    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  // onStatusChange should have been called
  expect(mockOnStatusChange).toHaveBeenCalled();
});

// handleStatusChange function
// Mock SWR mutate
vi.mock("swr", () => ({ mutate: vi.fn() }));

vi.spyOn(console, "error").mockImplementation(() => {});

const mockApp = {
  id: "1",
  company: "Acme",
  position: "Developer",
  appliedDate: "2025-08-17",
  status: "APPLIED" as Status,
  tags: [],
  location: "",
  jobUrl: "",
  notes: "",
  resumeLink: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

test("updates status for a non-interviewing application", async () => {
  const mockOnStatusChange = vi.fn();

  // Mock fetch to always return the same initial application
  global.fetch = vi.fn((url) => {
    if (url === "/api/applications/recent") {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ total: 1, recentApplications: [mockApp] }),
      });
    }
    if (url === `/api/applications/${mockApp.id}/status`) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockApp, status: "OFFER" as Status }),
      });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }) as any;

  render(<DashboardApplications onStatusChange={mockOnStatusChange} />);

  // Wait for the table row to appear
  const companyCell = await screen.findByText(/Acme/i);
  expect(companyCell).toBeInTheDocument();

  const positionCell = await screen.findByText(/Developer/i);
  expect(positionCell).toBeInTheDocument();

  // Change the status
  const statusSelect = screen.getByDisplayValue("APPLIED") as HTMLSelectElement;
  fireEvent.change(statusSelect, { target: { value: "OFFER" } });

  // Wait for UI to reflect new status
  await waitFor(() => {
    expect(screen.getByDisplayValue("OFFER")).toBeInTheDocument();
  });

  // onStatusChange should have been called
  expect(mockOnStatusChange).toHaveBeenCalled();
});

// Mock InterviewModal
vi.mock("./InterviewModal", () => ({
  default: ({ onConfirm, onCancel }: any) => (
    <div>
      <button
        data-testid="confirm-btn"
        onClick={() => onConfirm("2025-08-20T10:00")}
      >
        Confirm Interview
      </button>
      <button data-testid="cancel-btn" onClick={onCancel}>
        Cancel Interview
      </button>
    </div>
  ),
}));

test("change status to INTERVIEWING opens InterviewModal", async () => {
  const mockOnStatusChange = vi.fn();

  (global.fetch as any) = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          total: 1,
          recentApplications: [mockApp],
        }),
    })
  );

  render(<DashboardApplications onStatusChange={mockOnStatusChange} />);

  await screen.findByText(/Acme/i);

  const statusSelect = screen.getByDisplayValue("APPLIED") as HTMLSelectElement;
  fireEvent.change(statusSelect, { target: { value: "INTERVIEWING" } });

  // Modal should appear
  await screen.findByTestId("confirm-btn");
  await screen.findByTestId("cancel-btn");
});

test("confirming interview calls updateStatus and mutate", async () => {});
