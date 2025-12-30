"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import AppointmentForm from "@/components/appointmentsForm/appointmentsForm";
import { getAppointmentById, updateAppointment } from "@/services/appointments.service";
import Swal from "sweetalert2";

export default function AppointmentDetailsPage() {
    const { id } = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    // Pega o modo da URL (?mode=view ou ?mode=edit)
    const mode = searchParams.get("mode") || "view";
    
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getAppointmentById(id)
                .then(response => {
                    setAppointment(response.data);
                })
                .catch(err => {
                    console.error(err);
                    Swal.fire("Erro", "Não foi possível carregar o agendamento.", "error");
                    router.push("/admin/appointments");
                })
                .finally(() => setLoading(false));
        }
    }, [id, router]);

   const handleSave = async (data) => {
        try {
            await updateAppointment(id, data);
            Swal.fire({ icon: 'success', title: 'Sucesso!', text: 'Agendamento atualizado.', timer: 1500, showConfirmButton: false });
            router.push("/admin/appointments");
        } catch (error) {
            console.error(error);

            const errorMsg = error.response?.data?.message || 'Falha ao atualizar.';
            const isBusinessRule = error.response?.status === 400;

            Swal.fire({
                icon: isBusinessRule ? 'warning' : 'error',
                title: isBusinessRule ? 'Atenção!' : 'Erro',
                text: errorMsg,
                confirmButtonColor: isBusinessRule ? '#f59e0b' : '#ef4444',
                confirmButtonText: 'Voltar e Corrigir'
            });
        }
    };

    if (loading) return <div className="p-6">Carregando dados...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <AppointmentForm 
                initialData={appointment}
                mode={mode}
                onCancel={() => router.push("/admin/appointments")}
                saveFunction={handleSave}
            />
        </div>
    );
}