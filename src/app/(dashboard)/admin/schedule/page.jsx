import ScheduleClient from "./ScheduleClient";
import styles from "./page.module.css";

export default function SchedulePage() {
    return (
        <div className={styles.container}>
            {/* <h1 className={styles.title}>Agendamentos</h1> */}
            <ScheduleClient />
        </div>
    );
}