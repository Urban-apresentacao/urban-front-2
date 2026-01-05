"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ServiceForm from "@/components/forms/servicesForm/servicesForm.jsx";
import { getServiceById, updateService } from "@/services/services.service";
import Swal from "sweetalert2";
import styles from "../../users/register/page.module.css"; // Reutilizando CSS
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function EditServicePage() {
    const { id } = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode") || "view";

    const [serviceData, setServiceData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const response = await getServiceById(id);
                setServiceData(response.data);
            } catch (error) {
                Swal.fire("Erro", "Erro ao carregar serviço", "error");
                router.push("/admin/services");
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id, router]);

    const handleUpdate = async (data) => {
        try {
            await updateService(id, data);
            return { success: true };
        } catch (error) {
            console.error(error);
            Swal.fire("Erro", "Erro ao atualizar", "error");
            return { success: false };
        }
    };

    const handleSuccess = () => {
        Swal.fire({
            title: "Sucesso!", text: "Atualizado com sucesso.", icon: "success", timer: 1500, showConfirmButton: false
        }).then(() => router.push("/admin/services"));
    };

    if (loading) return <div>Carregando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/services" className={styles.backLink}>
                    <ChevronLeft size={20} /> Voltar
                </Link>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>{mode === 'view' ? 'Visualizar Serviço' : 'Editar Serviço'}</h2>
            </div>
            {serviceData && (
                <ServiceForm
                    initialData={serviceData}
                    mode={mode}
                    saveFunction={handleUpdate}
                    onSuccess={handleSuccess}
                    onCancel={() => router.push("/admin/services")}
                />
            )}
        </div>
    );
}