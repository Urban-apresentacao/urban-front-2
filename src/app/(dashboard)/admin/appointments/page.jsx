import AppointmentsClient from "./AppointmentsClient";
import styles from "./page.module.css";

export default function AppointmentsPage() {
  return (
    <div className={styles.container}>
            <h1 className={styles.title}>Agendamentos</h1>
      <AppointmentsClient />
    </div>
  );
}