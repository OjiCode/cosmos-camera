"use client";

import { useState } from "react";
import { ShimmerCard } from "../ShimmerCard";
import styles from "./VideoPlayer.module.css";

interface VideoPlayerProps {
  src: string;
  title: string;
}

export const VideoPlayer = ({ src, title }: VideoPlayerProps) => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className={styles.videoWrapper}>
      {isLoading && <ShimmerCard />}
      <iframe
        src={src}
        title={title}
        onLoad={handleLoad}
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className={`${styles.iframe} ${!isLoading ? styles.iframeLoaded : ""}`}
      ></iframe>
    </div>
  );
};
