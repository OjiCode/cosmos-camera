import {
  useQuery,
  UseQueryResult,
  useInfiniteQuery,
  QueryFunctionContext,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { getApodList, getApodByDate, ApodData } from "../services/apodService";
import { getDatesForPage } from "../utils/date";
import { MILLISECONDS_PER_SECOND, SECONDS_PER_MINUTE } from "../constants";
import type { InfiniteData } from "@tanstack/react-query";

const STALE_TIME_MINUTES = 10;
const STALE_TIME_MS =
  STALE_TIME_MINUTES * SECONDS_PER_MINUTE * MILLISECONDS_PER_SECOND;

/**
 * Hook to fetch APOD data in 30-day pages for infinite scrolling.
 * Accepts optional initialData prefetched on the server.
 */
export function useInfiniteApodList(
  initialData?: InfiniteData<ApodData[], number>
): UseInfiniteQueryResult<InfiniteData<ApodData[], number>, Error> {
  return useInfiniteQuery<
    ApodData[],
    Error,
    InfiniteData<ApodData[], number>,
    (string | number)[],
    number
  >({
    queryKey: ["apodList", "infinite"],
    queryFn: async ({
      pageParam,
    }: QueryFunctionContext<(string | number)[], number>): Promise<
      ApodData[]
    > => {
      const { startDate, endDate } = getDatesForPage(pageParam);
      return getApodList(startDate, endDate);
    },
    getNextPageParam: (
      lastPage: ApodData[],
      _allPages: ApodData[][],
      lastPageParam: number
    ): number | undefined => {
      // Keep fetching unless the last page was empty
      return lastPage.length > 0 ? lastPageParam + 1 : undefined;
    },
    initialPageParam: 0,
    staleTime: STALE_TIME_MS,
    initialData: initialData,
  });
}

/**
 * Fetch a single APOD entry for a specific date.
 * @param date - The date (YYYY-MM-DD).
 * @returns The APOD for the given date.
 */
export function useApodByDate(date?: string): UseQueryResult<ApodData, Error> {
  return useQuery({
    queryKey: ["apod", date],
    queryFn: () => {
      if (!date) {
        return Promise.reject(new Error("Date is required."));
      }
      return getApodByDate(date);
    },
    enabled: !!date,
  });
}
