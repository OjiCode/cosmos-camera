import { formatUTCDate } from "./date";

describe("formatUTCDate", () => {
  it("should format a Date object into a YYYY-MM-DD string using UTC", () => {
    // A date in the middle of the month
    const date1 = new Date(Date.UTC(2024, 5, 15));
    expect(formatUTCDate(date1)).toBe("2024-06-15");

    // A date at the beginning of the month/year
    const date2 = new Date(Date.UTC(2023, 0, 1));
    expect(formatUTCDate(date2)).toBe("2023-01-01");

    // A date at the end of the month/year
    const date3 = new Date(Date.UTC(2022, 11, 31));
    expect(formatUTCDate(date3)).toBe("2022-12-31");

    // A date with single-digit month and day
    const date4 = new Date(Date.UTC(2024, 2, 5));
    expect(formatUTCDate(date4)).toBe("2024-03-05");
  });
});
