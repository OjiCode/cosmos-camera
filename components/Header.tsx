import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Header.module.css";

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
