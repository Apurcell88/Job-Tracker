// Mocking Clerk - Clerk hooks like useUser can't run in tests without a mock. Create a reusable mock.
import { vi } from "vitest";

// Default mock user
const mockUser = {
  id: "user_123",
  firstName: "Adam",
  lastName: "Purcell",
  emailAddresses: [{ emailAddress: "apurcell88@gmail.com" }],
};

vi.mock("@clerk/nextjs", async (importOriginal) => {
  const actual = await importOriginal(); // import real module if needed
  return {
    useUser: () => ({
      isSignedIn: true,
      isLoaded: true,
      user: mockUser,
    }),
    SignedIn: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    SignedOut: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  };
});
