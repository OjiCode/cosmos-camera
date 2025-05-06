import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "./Header.module.css";

const ThemeToggle = dynamic(
  () => import("./ThemeToggle").then((mod) => ({ default: mod.ThemeToggle })),
  { ssr: true }
);

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link
          href="/gallery"
          className={`${styles.titleLink} focus-visible-ring`}
        >
          CosmosCamera
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
};
