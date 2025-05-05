"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteApodList } from "../../hooks/useApodQueries";
import { ApodCard } from "../ApodCard";
import { ShimmerCard } from "../ShimmerCard";
import { ApodData } from "../../services/apodService";
import { DAYS_PER_PAGE } from "../../constants";
import styles from "./PhotoGrid.module.css";
import type { InfiniteData } from "@tanstack/react-query";

const FIRST_SET_COUNT = DAYS_PER_PAGE;

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
      <div className={styles.gridContainer} aria-label="Loading images">
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
      <div className={styles.errorState}>
        Error loading images: {error?.message}
      </div> // TODO: Style this as well
    );
  }

  let imageIndex = 0;

  return (
    <div className={styles.gridContainer}>
      <div className={styles.grid}>
        {data?.pages.map((page: ApodData[], pageIndex: number) =>
          page.map((apod: ApodData) => {
            const currentIndex = imageIndex++;
            const isPriority = currentIndex < FIRST_SET_COUNT;
            return (
              <ApodCard
                key={
                  apod.date || `apod-${pageIndex}-${apod.title}-${currentIndex}`
                }
                apod={apod}
                isPriority={isPriority}
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
        <div className={styles.endOfListState}>No more images to load.</div>
      )}
      {/* // TODO: Last  bit of styling... I'm tired boss */}
    </div>
  );
};
