import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import LanguageSwitcher from "../LanguageSwitcher";

// Mock document methods
const mockChangeLanguage = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      changeLanguage: mockChangeLanguage,
      language: "en",
    },
  }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    mockChangeLanguage.mockClear();
    // Setup document properties
    Object.defineProperty(document.documentElement, "dir", {
      writable: true,
      value: "ltr",
    });
    Object.defineProperty(document.documentElement, "lang", {
      writable: true,
      value: "en",
    });
  });

  it("should render the language switcher button", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should render the language switcher button", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should display language names in dropdown", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Both language options should show their names
    expect(screen.getAllByText("English").length).toBeGreaterThan(0);
    expect(screen.getByText("தமிழ்")).toBeInTheDocument();
  });

  it("should show checkmark for current language", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    // Should show checkmark (✓) for the current language
    expect(screen.getByText("✓")).toBeInTheDocument();
  });

  it("should have proper styling for dropdown items", () => {
    const { container } = render(<LanguageSwitcher />);

    const button = screen.getByRole("button");
    fireEvent.click(button);

    const dropdown = container.querySelector(".absolute.right-0");
    expect(dropdown).toBeInTheDocument();
  });
});
