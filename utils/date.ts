import { DAYS_PER_PAGE } from "../constants";

/**
 * Formats a Date object into a YYYY-MM-DD string using UTC values (This is because the NASA API uses UTC to determine the date of the photo)
 * @param date - The Date object to format
 * @returns The formatted date string.
 */
export const formatUTCDate = (date: Date): string => {
  const year = date.getUTCFullYear();
  // Months are 0-indexed in JavaScript, add 1 for correct month number
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Calculates the start and end date strings (YYYY-MM-DD) for a given pagination page number,
 * working backwards from today in UTC.
 * @param pageParam - The page number (0-indexed).
 * @returns An object containing the startDate and endDate strings.
 */
export const getDatesForPage = (
  pageParam: number
): { startDate: string; endDate: string } => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setUTCDate(today.getUTCDate() - pageParam * DAYS_PER_PAGE);

  const startDate = new Date(endDate);
  // Subtract (DAYS_PER_PAGE - 1) days to get the start date of the window
  startDate.setUTCDate(endDate.getUTCDate() - (DAYS_PER_PAGE - 1));

  return {
    startDate: formatUTCDate(startDate),
    endDate: formatUTCDate(endDate),
  };
};
