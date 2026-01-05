"use client";

import { useState, useEffect, use } from "react"; 
import { useRouter } from "next/navigation"; 
import Swal from "sweetalert2";
import { ChevronLeft, Loader2 } from "lucide-react"; 

import VehicleFormUser from "@/components/forms/vehicleForm/vehicleFormUser/vehicleForm"; 
import { getVehicleById, updateVehicle } from "@/services/vehicles.service";

// ✅ IMPORTANDO O CSS MODULE
import styles from "./page.module.css";

export default function EditVehiclePage({ params }) {
  const router = useRouter();
  const { id } = use(params); 

  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await getVehicleById(id);
        setVehicleData(data.data || data); 

      } catch (error) {
        console.error("Erro ao carregar veículo:", error);
        Swal.fire({
            title: "Erro", 
            text: "Não foi possível carregar os dados.", 
            icon: "error",
            confirmButtonColor: "#ef4444"
        });
        router.push("/user/vehicles");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, router]);

  // 2. Salvar
  const handleSave = async (formData) => {
    try {
      await updateVehicle(id, formData);
      await Swal.fire({
        title: "Sucesso", 
        text: "Veículo atualizado!", 
        icon: "success",
        confirmButtonColor: "#16a34a"
      });
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao salvar.";
      Swal.fire({ title: "Erro", text: msg, icon: "error", confirmButtonColor: "#ef4444" });
      return { success: false };
    }
  };

  const handleBack = () => {
    router.push("/user/vehicles");
  };

  // Loading com estilo CSS
  if (loading) {
    return (
        <div className={styles.loadingState}>
            <Loader2 className="animate-spin" size={32} />
            <p>Carregando dados do veículo...</p>
        </div>
    );
  }

  return (
    // ✅ USANDO AS CLASSES DO CSS MODULE
    <div className={styles.container}>
      
      <div className={styles.header}>
        <button 
            onClick={handleBack} 
            className={styles.backButton}
            title="Voltar"
        >
            <ChevronLeft size={28} />
        </button>
        <h1 className={styles.title}>
            Editar Veículo
        </h1>
      </div>

      <div className={styles.formWrapper}>
          {vehicleData ? (
            <VehicleFormUser 
                mode="edit"
                initialData={vehicleData}
                saveFunction={handleSave}
                onSuccess={handleBack}
                onCancel={handleBack}
            />
          ) : (
            <p>Veículo não encontrado.</p>
          )}
      </div>
    </div>
  );
}