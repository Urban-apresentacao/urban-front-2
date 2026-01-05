'use client';

import React, { useEffect } from 'react';
import styles from './page.module.css';
import VehicleUserCard from '@/components/vehicleUserCard/vehicleUserCard';
import { useVehicleUsers } from '@/hooks/useVehicleUsers';
import { useRouter } from 'next/navigation'; // Para navegar para edição
import Swal from 'sweetalert2'; 
import { toggleVehicleStatus } from '@/services/vehicles.service'

export default function UserVehiclesPage() {
  const { vehicles, fetchUserVehicles, loading, error } = useVehicleUsers();
  const router = useRouter();

  // Exemplo de ID (Ideal vir de um Contexto de Autenticação)
  const loggedUserId = 112; 

  useEffect(() => {
    if (loggedUserId) {
      fetchUserVehicles(loggedUserId);
    }
  }, [fetchUserVehicles, loggedUserId]);

  // --- FUNÇÃO 1: NAVEGAR PARA EDITAR ---
  const handleEdit = (vehicleId) => {
    // Redireciona para a pasta [id] que você já criou
    // Ex: /dashboard/user/vehicles/15?mode=edit
    router.push(`/user/vehicles/${vehicleId}?mode=edit`);
  };

  // --- FUNÇÃO 2: INATIVAR / VENDER ---
  const handleToggleStatus = async (vehicle) => {
    const isActive = vehicle.veic_situacao === true || vehicle.veic_situacao === '1';
    const actionText = isActive ? "Desativar" : "Reativar";
    
    const result = await Swal.fire({
      title: `${actionText} Veículo?`,
      text: isActive 
        ? "Ao desativar, este veículo não aparecerá em novos agendamentos." 
        : "O veículo voltará a ficar disponível para agendamentos.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isActive ? "#ef4444" : "#16a34a",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Sim, ${actionText}`,
      cancelButtonText: "Cancelar"
    });

    if (result.isConfirmed) {
      try {
        // Chama seu service reutilizado
        // status: false (0) ou true (1)
        await toggleVehicleStatus(vehicle.veic_id, !isActive);

        await Swal.fire({
            title: "Sucesso!",
            text: `Veículo ${isActive ? 'desativado' : 'ativado'} com sucesso.`,
            icon: "success",
            confirmButtonColor: "#16a34a"
        });

        // Recarrega a lista para mostrar o novo status
        fetchUserVehicles(loggedUserId);

      } catch (err) {
        console.error(err);
        Swal.fire("Erro", "Não foi possível alterar o status.", "error");
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerTitle}>
            <h1 className={styles.title}>Meus Veículos</h1>
            <p className={styles.description}>
            Gerencie os veículos vinculados à sua conta
            </p>
        </div>
        {/* Aqui entrará o botão "Novo Veículo" depois */}
      </header>

      {error && <div className={styles.errorBox}>{error}</div>}

      {loading ? (
        <div className={styles.loadingState}>Carregando seus veículos...</div>
      ) : (
        <div className={styles.grid}>
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => (
              <VehicleUserCard 
                key={vehicle.veic_id || vehicle.veic_usu_id} 
                vehicle={vehicle} 
                // Passamos as funções para o Card
                onEdit={() => handleEdit(vehicle.veic_id)}
                onToggleStatus={() => handleToggleStatus(vehicle)}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>Nenhum veículo vinculado encontrado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}