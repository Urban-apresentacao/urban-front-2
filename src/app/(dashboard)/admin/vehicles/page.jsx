import styles from './page.module.css'

import VehiclesClient from './VehiclesClient';

export default function Vehicles() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Painel de Veículos</h1>
            <VehiclesClient />
        </div>
    );
}