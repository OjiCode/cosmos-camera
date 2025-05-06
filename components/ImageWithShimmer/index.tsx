"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ShimmerCard } from "../ShimmerCard";
import styles from "./ImageWithShimmer.module.css";

type ImageWithShimmerProps = Omit<
  ImageProps,
  "src" | "alt" | "onLoadingComplete"
> & {
  src: string;
  alt: string;
  contain?: boolean;
};

export const ImageWithShimmer = ({
  src,
  alt,
  className,
  contain,
  ...props
}: ImageWithShimmerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <div className={`${styles.imageWrapper} ${className || ""}`}>
      {isLoading && <ShimmerCard />}

      <Image
        src={src}
        alt={alt}
        className={`${styles.image} ${!isLoading ? styles.imageLoaded : ""} ${
          contain ? styles.image__contain : ""
        }`}
        onLoad={handleLoadingComplete}
        {...props}
      />
    </div>
  );
};
