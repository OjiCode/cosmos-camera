import Link from "next/link";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

import { getApodByDate } from "../../../services/apodService";
import styles from "./ApodPage.module.css";
import { ImageWithShimmer } from "../../../components/ImageWithShimmer";

const VideoPlayer = dynamic(
  () =>
    import("../../../components/VideoPlayer").then((mod) => ({
      default: mod.VideoPlayer,
    })),
  {
    loading: () => (
      <div className={styles.videoLoading}>Loading video player...</div>
    ),
    ssr: true,
  }
);

interface ApodPageParams {
  date: string;
}

export default async function ApodPage({
  params,
}: {
  params: Promise<ApodPageParams>;
}) {
  const { date } = await params;

  try {
    const apodData = await getApodByDate(date);

    return (
      <div className={styles.container}>
        <Link href="/gallery" className={styles.backLink}>
          <ChevronLeftIcon className={styles.backIcon} />
          Back to Gallery
        </Link>

        <h1 className={styles.title}>{apodData.title}</h1>
        <p className={styles.date}>{apodData.date}</p>

        {apodData.media_type === "image" ? (
          <ImageWithShimmer
            className={styles.image}
            src={apodData.url}
            alt={apodData.title}
            fill
            priority
            contain
          />
        ) : apodData.media_type === "video" ? (
          <VideoPlayer src={apodData.url} title={apodData.title} />
        ) : (
          <p>Unsupported media type</p>
        )}

        {apodData.hdurl && apodData.media_type === "image" && (
          <p className={styles.hdLinkContainer}>
            <a
              href={apodData.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.hdLink}
            >
              View HD Image
            </a>
          </p>
        )}

        <div className={styles.explanationContainer}>
          <h2>Explanation</h2>
          <p>{apodData.explanation}</p>
        </div>

        {apodData.copyright && (
          <p className={styles.copyright}>Copyright: {apodData.copyright}</p>
        )}
      </div>
    );
  } catch (error) {
    console.error(`Failed to fetch APOD data for ${date}:`, error);
    return (
      <div className={styles.errorContainer}>
        <h1 className={styles.errorTitle}>Error Fetching APOD Data</h1>
        <p>Could not load the Astronomy Picture of the Day for {date}.</p>
        <p>
          <Link href="/gallery" className={styles.errorLink}>
            Return to Gallery
          </Link>
        </p>
      </div>
    );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<ApodPageParams>;
}): Promise<Metadata> {
  try {
    const { date } = await params;
    const apodData = await getApodByDate(date);
    return {
      title: `${apodData.title} - APOD ${apodData.date}`,
      description: apodData.explanation.substring(0, 150) + "...",
    };
  } catch {
    return {
      title: "Error Fetching APOD",
      description: "Could not load APOD data for the specified date.",
    };
  }
}
