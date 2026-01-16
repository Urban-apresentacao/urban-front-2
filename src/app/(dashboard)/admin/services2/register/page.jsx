"use client";

import { useRouter } from "next/navigation";
import ServiceForm from "@/components/forms/servicesForm2/servicesForm";
import { createService } from "@/services/services.service";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";
import styles from "./page.module.css";

export default function RegisterServicePage() {
    const router = useRouter();

    const handleCreate = async (data) => {
        try {
            await createService(data);
            return { success: true };
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Erro",
                // Tenta pegar a mensagem do backend, senão usa genérica
                text: error.response?.data?.message || "Erro ao criar serviço",
                icon: "error",
                confirmButtonColor: "#f59e0b"
            });
            return { success: false };
        }
    };

    const handleSuccess = () => {
        Swal.fire({
            title: "Sucesso!",
            text: "Serviço criado com sucesso.",
            icon: "success",
            confirmButtonColor: "#10b981"
        }).then(() => router.push("/admin/services"));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/services" className={styles.backLink}>
                    <ChevronLeft size={20} /> Voltar
                </Link>
                <h1 className={styles.title}>Cadastrar Novo Serviço</h1>
            </div>
            <div className={styles.formCard}>
                {/* mode="edit" garante que o form nasça editável e vazio */}
                <ServiceForm 
                    saveFunction={handleCreate}
                    onSuccess={handleSuccess}
                    onCancel={() => router.back()}
                    mode="edit" 
                />
            </div>
        </div>
    );
}