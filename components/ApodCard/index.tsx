import React, { memo } from "react";
import Link from "next/link";
import { ApodData } from "../../services/apodService";
import styles from "./ApodCard.module.css";
import { ImageWithShimmer } from "../ImageWithShimmer";
import { PlayCircleIcon, PhotoIcon } from "@heroicons/react/24/solid";

interface ApodCardProps {
  apod: ApodData;
}

export const ApodCard = memo(({ apod }: ApodCardProps) => {
  const { date, title, url, media_type, thumbnail_url } = apod;
  const imageUrl = media_type === "video" ? thumbnail_url : url;
  const imageAlt = `${title} - APOD ${date}`;

  if (!imageUrl) {
    return null;
  }

  return (
    <Link
      href={`/apod/${date}`}
      className={styles.apodCard}
      aria-label={imageAlt}
    >
      <ImageWithShimmer
        src={imageUrl}
        alt={imageAlt}
        fill
        sizes="(min-width: 1112px) 272px, (min-width: 846px) 33.33vw, (min-width: 580px) 50vw, 100vw"
        priority={true}
        className={styles.objectCover}
      />
      <div className={styles.iconContainer}>
        {media_type === "video" ? (
          <PlayCircleIcon className={styles.icon} />
        ) : (
          <PhotoIcon className={styles.icon} />
        )}
      </div>
    </Link>
  );
});

ApodCard.displayName = "ApodCard";
