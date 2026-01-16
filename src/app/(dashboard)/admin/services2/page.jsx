import styles from "./page.module.css";
import ServiceClient from "./ServicesClient";

export default function ServicesPage() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Painel de Serviços</h1>
            <ServiceClient />
        </div>
    );
}