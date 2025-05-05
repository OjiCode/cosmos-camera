export interface ApodData {
  copyright?: string;
  date: string;
  explanation: string;
  hdurl?: string;
  media_type: "image" | "video";
  service_version: string;
  title: string;
  url: string;
  thumbnail_url?: string;
}

const API_KEY = process.env.NEXT_PUBLIC_NASA_KEY as string;
const BASE_URL = "https://api.nasa.gov/planetary/apod";

if (!API_KEY) {
  console.error(
    "VITE_NASA_KEY is not defined. Please add it to your .env file."
  );
  // TODO: I could potentially show a modal here letting people know what's going wrong and to reach out to me for assistance.
}

/**
 * Fetches the Astronomy Picture of the Day data from the NASA APOD API.
 */
async function fetchApodApi<T>(params: Record<string, string>): Promise<T> {
  const queryParams = new URLSearchParams({ ...params, api_key: API_KEY });
  const url = `${BASE_URL}?${queryParams.toString()}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Error: ${response.status} ${response.statusText}`, {
        url,
        status: response.status,
        statusText: response.statusText,
        body: errorBody,
      });
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    console.error("Failed to fetch from NASA API:", error);
    throw error;
  }
}

/**
 * Fetches a list of APOD entries within a given date range.
 * @param startDate - The start date in YYYY-MM-DD format.
 * @param endDate - The end date in YYYY-MM-DD format.
 * @returns Promise<ApodData[]>.
 */
export async function getApodList(
  startDate: string,
  endDate: string
): Promise<ApodData[]> {
  return fetchApodApi<ApodData[]>({
    start_date: startDate,
    end_date: endDate,
    thumbs: "true", // Gets the thumbnail image if the media_type is video
  });
}

/**
 * Fetches a single APOD entry for a specific date.
 * @param date - The date in YYYY-MM-DD format.
 * @returns Promise<ApodData>
 */
export async function getApodByDate(date: string): Promise<ApodData> {
  return fetchApodApi<ApodData>({
    date,
  });
}
