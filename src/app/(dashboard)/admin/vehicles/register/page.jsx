import VehicleForm from "@/components/vehicleForm/vehicleForm";

import Link from "next/link";
import Swal from "sweetalert2"; // Importando o SweetAlert
import styles from "./page.module.css";
// import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";

export default function RegisterVehiclePage() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/vehicles" className={styles.backLink}>
                    <ChevronLeft size={20} />
                    Voltar
                </Link>
                <h1 className={styles.title}>Cadastrar Novo Usuário</h1>
            </div>

            <div className={styles.formCard}>
                <VehicleForm 
                    // saveFunction={handleCreateUser}
                    // onSuccess={handleSuccess}
                    // onCancel={handleCancel}
                />
            </div>
        </div>
    );
}