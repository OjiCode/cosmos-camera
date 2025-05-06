import React, { memo } from "react";
import styles from "./ShimmerCard.module.css";

const ShimmerCardComponent = () => {
  return <div className={styles.shimmerCard} aria-hidden="true"></div>;
};

export const ShimmerCard = memo(ShimmerCardComponent);
