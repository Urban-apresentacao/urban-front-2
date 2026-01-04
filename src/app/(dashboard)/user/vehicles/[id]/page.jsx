"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Para redirecionar
// import VehicleForm from "@/components/forms/VehicleForm"; // Importe o form que você criou
// import { getVehicleById, updateVehicle } from "@/services/vehicle.service"; // Seus services
import Swal from "sweetalert2";

export default function EditVehiclePage({ params }) {
  const router = useRouter();
  const { id } = params; // Pega o ID da URL (ex: user/vehicle/5)
  
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Busca os dados do veículo ao carregar a página
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVehicleById(id);
        
        // Ajuste conforme o retorno da sua API (ex: data.data ou data direto)
        // O Form espera um objeto simples
        setVehicleData(data.data || data); 
      } catch (error) {
        console.error(error);
        Swal.fire("Erro", "Não foi possível carregar o veículo.", "error");
        router.push("/user/vehicle"); // Volta se der erro
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  // 2. Função de Salvar (passada para o Form)
  const handleSave = async (formData) => {
    try {
      await updateVehicle(id, formData);
      Swal.fire("Sucesso", "Veículo atualizado com sucesso!", "success");
      return { success: true }; // O Form espera esse retorno
    } catch (error) {
      const msg = error.response?.data?.message || "Erro ao salvar";
      Swal.fire("Erro", msg, "error");
      return { success: false };
    }
  };

  // 3. O que fazer após salvar ou cancelar
  const handleBack = () => {
    router.push("/user/vehicle"); // Volta para a listagem
  };

  if (loading) return <div className="p-10 text-center">Carregando dados do veículo...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Editar Veículo</h1>
      
      {/* Renderiza o seu formulário */}
      {/* <VehicleForm 
        mode="edit"
        initialData={vehicleData}
        saveFunction={handleSave}
        onSuccess={handleBack}
        onCancel={handleBack}
      /> */}
    </div>
  );
}