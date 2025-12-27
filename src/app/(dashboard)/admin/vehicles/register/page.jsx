"use client";

import { useRouter } from "next/navigation";
import VehicleForm from "@/components/vehicleForm/vehicleForm";
import { createVehicle } from "@/services/vehicles.service"; // Importando o serviço
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "./page.module.css";

export default function RegisterVehiclePage() {
    const router = useRouter();

    // Lógica principal de salvamento com tratamento de erros
    const handleCreateVehicle = async (vehicleData) => {
        try {
            await createVehicle(vehicleData);
            return { success: true };
        } catch (error) {
            // Lógica de limpeza do console (igual ao User)
            const status = error.response?.status;

            // Só loga se for erro crítico (não loga 400/409)
            if (!status || status >= 500) {
                 console.error("Erro Crítico ao criar veículo:", error);
            }

            let title = "Erro ao cadastrar";
            let text = "Ocorreu um erro inesperado.";

            if (error.response) {
                const { data } = error.response;
                
                if (data && data.message) text = data.message;
                else if (typeof data === 'string') text = data;

                if (status === 409) title = "Veículo já cadastrado"; // Ex: Placa duplicada
                if (status === 400) title = "Dados Inválidos";
                if (status === 500) title = "Erro Interno";
            } else if (error.request) {
                text = "Sem conexão com o servidor.";
            }

            await Swal.fire({
                title: title,
                text: text,
                icon: "warning",
                confirmButtonColor: "#f59e0b"
            });

            return { success: false, error };
        }
    };

    const handleSuccess = () => {
        Swal.fire({
            title: "Sucesso!",
            text: "Veículo cadastrado com sucesso.",
            icon: "success",
            confirmButtonColor: "#10b981"
        }).then(() => {
            router.push("/admin/vehicles");
        });
    };

    const handleCancel = () => {
        router.back();
    };

    return (
       <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/vehicles" className={styles.backLink}>
                    <ChevronLeft size={20} />
                    Voltar
                </Link>
                <h1 className={styles.title}>Cadastrar Novo Veículo</h1>
            </div>

            <div className={styles.formCard}>
                <VehicleForm 
                    saveFunction={handleCreateVehicle}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                     // Força o modo de criação (editável desde o início)
                />
            </div>
        </div>
    );
}