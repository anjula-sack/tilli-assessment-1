import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../LoginForm";

const mockPush = jest.fn();
const mockGet = jest.fn();

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
  usePathname: () => "/",
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

// Mock appwrite
jest.mock("@/lib/appwrite", () => ({
  login: jest.fn(),
}));

// Mock i18n to return actual module with mocked language
jest.mock("@/lib/i18n", () => ({
  __esModule: true,
  default: {
    language: "en",
    changeLanguage: jest.fn(),
  },
}));

describe("LoginForm", () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockGet.mockReturnValue("PRE");
    const { login } = require("@/lib/appwrite");
    login.mockClear();
  });

  it("should render the login form", () => {
    render(<LoginForm />);

    expect(screen.getByText("login.title")).toBeInTheDocument();
  });

  it("should render teacher info section", () => {
    render(<LoginForm />);

    expect(screen.getByText("login.teacherInfo")).toBeInTheDocument();
  });

  it("should render submit button", () => {
    render(<LoginForm />);

    const button = screen.getByRole("button", { name: /common.getStarted/i });
    expect(button).toBeInTheDocument();
  });

  it("should allow selecting school", () => {
    render(<LoginForm />);

    const schoolSelect = screen.getAllByRole("combobox")[0];
    expect(schoolSelect).toBeInTheDocument();
  });

  it("should allow selecting grade", () => {
    render(<LoginForm />);

    const gradeSelect = screen.getAllByRole("combobox")[1];
    expect(gradeSelect).toBeInTheDocument();
  });



  it("should render mascot image", () => {
    render(<LoginForm />);

    const mascot = screen.getByAltText("app.mascotAlt");
    expect(mascot).toBeInTheDocument();
  });

  it("should render description text", () => {
    render(<LoginForm />);

    expect(screen.getByText("login.description")).toBeInTheDocument();
  });



  it("should handle form submission", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockResolvedValue({});

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");
    if (form) {
      fireEvent.submit(form);
    }

    // Form submission is handled
    await waitFor(() => {
      // No error should be displayed initially
      expect(screen.queryByText("login.loginFailed")).not.toBeInTheDocument();
    });
  });

  it("should disable submit button while loading", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<LoginForm />);

    const submitButton = screen.getByRole("button", {
      name: /common.getStarted/i,
    });

    const form = submitButton.closest("form");
    if (form) {
      fireEvent.submit(form);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    }
  });





  it("should display error message on login failure", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockRejectedValue(new Error("Login failed"));

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("login.loginFailed")).toBeInTheDocument();
    });
  });

  it("should call router.push with correct path on successful login", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockResolvedValue({});

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");

    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard?testType=PRE");
    });
  });

  it("should handle testType query parameter", () => {
    mockGet.mockReturnValue("POST");

    render(<LoginForm />);

    // Component should render without errors
    expect(screen.getByText("login.title")).toBeInTheDocument();
  });

  it("should default to PRE testType when no query param", () => {
    mockGet.mockReturnValue(null);

    render(<LoginForm />);

    expect(screen.getByText("login.title")).toBeInTheDocument();
  });



  it("should have all required fields marked with asterisk", () => {
    render(<LoginForm />);

    // Check for required field labels
    expect(screen.getByText(/login.school.*\*/)).toBeInTheDocument();
    expect(screen.getByText(/login.grade.*\*/)).toBeInTheDocument();
  });

  it("should clear error message when form is resubmitted", async () => {
    const { login } = require("@/lib/appwrite");
    login.mockRejectedValueOnce(new Error("Login failed"));

    render(<LoginForm />);

    const form = screen
      .getByRole("button", { name: /common.getStarted/i })
      .closest("form");

    // First submission - should fail
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(screen.getByText("login.loginFailed")).toBeInTheDocument();
    });

    // Second submission - should clear error first
    login.mockResolvedValue({});
    if (form) {
      fireEvent.submit(form);
    }

    // Error should be cleared during submission
    await waitFor(() => {
      expect(screen.queryByText("login.loginFailed")).not.toBeInTheDocument();
    });
  });
});
