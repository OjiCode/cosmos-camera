"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import type { InfiniteData } from "@tanstack/react-query";
import { useInfiniteApodList } from "../../hooks/useApodQueries";
import { ShimmerCard } from "../ShimmerCard";
import { ApodData } from "../../services/apodService";
import { DAYS_PER_PAGE } from "../../constants";
import styles from "./PhotoGrid.module.css";
import { ApodCard } from "../ApodCard";
interface PhotoGridProps {
  initialInfiniteData?: InfiniteData<ApodData[], number>;
}

export const PhotoGrid = ({ initialInfiniteData }: PhotoGridProps) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteApodList(initialInfiniteData);

  const { ref: sentinelRef, inView } = useInView({
    threshold: 0,
    rootMargin: "0px 0px 200px 0px",
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  if (status === "pending") {
    return (
      <div
        className={styles.gridContainer}
        aria-label="Loading images"
        aria-live="polite"
      >
        <div className={styles.grid}>
          {[...Array(DAYS_PER_PAGE)].map((_, index) => (
            <ShimmerCard key={`shimmer-${index}`} />
          ))}
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className={styles.errorState} aria-live="assertive">
        Error loading images: {error?.message}
      </div>
    );
  }

  let imageIndex = 0;

  return (
    <div className={styles.gridContainer}>
      <div role="grid" className={styles.grid}>
        {data?.pages.map((page: ApodData[], pageIndex: number) =>
          [...page].reverse().map((apod: ApodData) => {
            const currentIndex = imageIndex++;
            return (
              <ApodCard
                key={
                  apod.date || `apod-${pageIndex}-${apod.title}-${currentIndex}`
                }
                apod={apod}
              />
            );
          })
        )}

        {isFetchingNextPage &&
          [...Array(DAYS_PER_PAGE)].map((_, index) => (
            <ShimmerCard key={`shimmer-next-${index}`} />
          ))}
      </div>
      <div
        ref={sentinelRef}
        className={styles.photoGrid__sentinel}
        aria-hidden="true"
        data-testid="photo-grid-sentinel"
      />

      {!hasNextPage && !isFetching && (
        <div className={styles.endOfListState} aria-live="polite">
          No more images to load.
        </div>
      )}
    </div>
  );
};
