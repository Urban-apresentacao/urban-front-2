import styles from "./page.module.css"

// import { useUsers } from "@/hooks/useUsers"
import UsersClient from "./UsersClient";

export default function Users() {

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Painel de Usuários</h1>
           <UsersClient />
        </div>
    );
}