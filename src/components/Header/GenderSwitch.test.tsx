import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import GenderSwitch from "./GenderSwitch";

const mockSetGender = vi.fn();
let mockGender: "female" | "male" | null = null;

vi.mock("@/app/context/GenderPreferenceContext", () => ({
  useGenderPreference: () => ({
    gender: mockGender,
    setGender: mockSetGender,
  }),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/en/shop-with-sidebar",
}));

const mockReplace = vi.fn();
vi.mock("@/i18n/routing", () => ({
  useRouter: () => ({ replace: mockReplace }),
}));

const messages = {
  Header: {
    genderSwitch: {
      women: "Women",
      men: "Men",
      all: "All",
    },
  },
};

function renderGenderSwitch() {
  return render(
    <NextIntlClientProvider locale="en" messages={messages}>
      <GenderSwitch />
    </NextIntlClientProvider>
  );
}

describe("GenderSwitch", () => {
  beforeEach(() => {
    mockGender = null;
    mockSetGender.mockClear();
    mockReplace.mockClear();
  });

  it("renders 3 buttons (women, men, all)", () => {
    renderGenderSwitch();
    expect(screen.getByText("Women")).toBeInTheDocument();
    expect(screen.getByText("Men")).toBeInTheDocument();
    expect(screen.getByText("All")).toBeInTheDocument();
  });

  it("highlights active gender (female)", () => {
    mockGender = "female";
    renderGenderSwitch();
    const womenBtn = screen.getByText("Women");
    expect(womenBtn.className).toContain("text-malachite");
  });

  it("does not highlight inactive buttons", () => {
    mockGender = "female";
    renderGenderSwitch();
    const menBtn = screen.getByText("Men");
    // Inactive buttons have text-onyx as their base class
    expect(menBtn.className).toContain("text-onyx");
  });

  it("click on Women calls setGender('female')", () => {
    renderGenderSwitch();
    fireEvent.click(screen.getByText("Women"));
    expect(mockSetGender).toHaveBeenCalledWith("female");
  });

  it("click on Men calls setGender('male')", () => {
    renderGenderSwitch();
    fireEvent.click(screen.getByText("Men"));
    expect(mockSetGender).toHaveBeenCalledWith("male");
  });

  it("click on All calls setGender(null)", () => {
    renderGenderSwitch();
    fireEvent.click(screen.getByText("All"));
    expect(mockSetGender).toHaveBeenCalledWith(null);
  });
});
