import styles from "./page.module.css";

export default function UsersLoading() {
  return (
    <div className={styles.container}>
      <div className={styles.headerSkeleton} />

      <div className={styles.list}>
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className={styles.cardSkeleton} />
        ))}
      </div>
    </div>
  );
}
