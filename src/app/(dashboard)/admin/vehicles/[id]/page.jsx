"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import VehicleForm from "@/components/forms/vehicleForm/vehicleFormAdmin/vehicleForm";
import { getVehicleById, updateVehicle } from "@/services/vehicles.service";
import Swal from "sweetalert2";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import styles from "../register/page.module.css";

export default function EditVehiclePage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = params;

    const mode = searchParams.get("mode") || "view"; // 'view' ou 'edit'

    const [vehicleData, setVehicleData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Carrega os dados iniciais
    useEffect(() => {
        async function loadData() {
            if (!id) return;
            try {
                setLoading(true);
                const response = await getVehicleById(id);

                // Garante que temos dados antes de setar
                if (response && response.data) {
                    setVehicleData(response.data);
                } else {
                    throw new Error("Dados do veículo não encontrados.");
                }

            } catch (error) {
                console.error("Erro ao carregar veículo:", error);
                Swal.fire({
                    title: "Erro",
                    text: "Não foi possível carregar os dados do veículo.",
                    icon: "error"
                }).then(() => {
                    router.push("/admin/vehicles");
                });
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, router]);

    // 2. Função de Atualização (Lógica Correta)
    const handleUpdateVehicle = async (formData) => {
        try {
            // Chama o serviço
            const response = await updateVehicle(id, formData);

            // Opcional: Se seu backend retornar status 'error' mesmo com HTTP 200
            if (response && response.status === 'error') {
                throw new Error(response.message || "Erro ao atualizar");
            }

            // Sucesso
            await Swal.fire({
                title: "Sucesso",
                text: "Veículo atualizado com sucesso!",
                icon: "success",
                confirmButtonColor: '#16a34a',
            });

            // Redireciona após o usuário clicar em OK no alerta
            router.push("/admin/vehicles");

            // Retorna true para o componente filho saber que deu certo (parar loading, etc)
            return { success: true };

        } catch (error) {
            console.error("Erro ao atualizar veículo:", error);

            Swal.fire({
                title: "Erro",
                text: error.message || "Não foi possível atualizar o veículo.",
                icon: "error"
            });

            // Retorna false para o form manter os dados e permitir nova tentativa
            return { success: false };
        }
    };

    // 3. Botão cancelar
    const handleCancel = () => {
        router.push("/admin/vehicles");
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: '#666' }}>
                Carregando dados do veículo...
            </div>
        );
    }

    return (
        <div className={styles?.container || ""}>
            <div className={styles.header}>
                <Link href="/admin/vehicles" className={styles.backLink}>
                    <ChevronLeft size={20} /> Voltar
                </Link>
                <h2 style={{ marginBottom: '20px', color: '#333' }}>
                    {mode === 'view' ? 'Visualizar Veículo' : 'Editar Veículo'}
                </h2>
            </div>
            {vehicleData && (
                <VehicleForm
                    initialData={vehicleData}
                    mode={mode}
                    // IMPORTANTE: O nome da prop deve ser saveFunction para bater com o componente filho
                    saveFunction={handleUpdateVehicle}
                    onCancel={handleCancel}
                    // onSuccess é chamado pelo filho. Como já redirecionamos no handleUpdateVehicle,
                    // podemos passar vazio ou mover o redirect para cá.
                    onSuccess={() => { }}
                />
            )}
        </div>
    );
}