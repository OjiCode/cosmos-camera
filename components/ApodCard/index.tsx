"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ApodData } from "../../services/apodService";
import styles from "./ApodCard.module.css";

interface ApodCardProps {
  apod: ApodData;
  isPriority?: boolean;
}

export const ApodCard = React.memo(
  ({ apod, isPriority = false }: ApodCardProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isFailed, setIsFailed] = useState(false);

    const altText = `NASA's Astronomy Picture of the Day for ${apod.date}: ${apod.title}`;
    const displayUrl = apod.thumbnail_url || apod.url;
    const displayAlt =
      apod.media_type === "video" ? `Video thumbnail for ${altText}` : altText;

    if (!displayUrl || isFailed) {
      return null;
    }

    return (
      <Link
        href={`/apod/${apod.date}`}
        className={`${styles.apodCard} focus-visible-ring`}
        aria-label={altText}
      >
        <div className={styles.imageContainer}>
          <Image
            src={displayUrl}
            alt={displayAlt}
            fill
            sizes="(max-width: 580px) calc(100vw - 4rem), (max-width: 846px) calc((100vw - 5rem) / 2), (max-width: 1200px) calc((100vw - 6rem) / 3), 272px"
            priority={isPriority}
            className={`${styles.apodCard__image} ${
              isLoaded ? styles.imageLoaded : ""
            }`}
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsFailed(true)}
          />
        </div>
      </Link>
    );
  }
);

ApodCard.displayName = "ApodCard";
