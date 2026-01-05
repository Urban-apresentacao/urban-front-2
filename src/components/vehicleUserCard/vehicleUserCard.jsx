'use client';

import React from 'react';
import {
  Truck, Car, Bike, Calendar, Fuel, Droplet,
  Edit2, Trash2, Info, CalendarClock, Power, RotateCcw
} from 'lucide-react';
import styles from './vehicleUserCard.module.css';

// Recebe as funções onEdit e onToggleStatus do componente Pai (Page)
const VehicleUserCard = ({ vehicle, onEdit, onToggleStatus }) => {

  // Desestruturando os dados
  const {
    mar_nome, mod_nome, veic_placa, veic_ano, veic_cor,
    veic_combustivel, cat_id, ehproprietario, veic_situacao,
    veic_observ, data_inicial
  } = vehicle;

  // Formatação de Data
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Ícone por categoria
  const getCategoryIcon = (id) => {
    const iconClass = styles.categoryIcon;
    switch (id) {
      case 1: return <Truck className={iconClass} />;
      case 2: return <Car className={iconClass} />;
      case 3: return <Bike className={iconClass} />;
      default: return <Car className={iconClass} />;
    }
  };

  const isInactive = veic_situacao === false || veic_situacao === '0' || veic_situacao === 0;

  return (
    <div className={`${styles.card} ${isInactive ? styles.inactiveCard : ''}`}>
      <div className={styles.header}>
        <div className={styles.mainInfo}>
          <div className={styles.iconWrapper}>
            {getCategoryIcon(cat_id)}
          </div>
          <div className={styles.titleGroup}>
            <h3>{mar_nome} {mod_nome}</h3>
            <span className={styles.subtitle}>
              {ehproprietario ? "Proprietário" : "Vinculado"}
            </span>
          </div>
        </div>

        {/* --- BARRA DE AÇÕES --- */}
        <div className={styles.actionsHeader}>

          {/* BOTÃO EDITAR */}
          <button
            className={`${styles.iconButton} ${styles.btnEdit}`}
            onClick={onEdit}
            title="Editar Veículo"
          >
            <Edit2 size={18} />
          </button>

        {/* BOTÃO ATIVAR / DESATIVAR */}
          <button
            className={`${styles.iconButton} ${isInactive ? styles.btnActivate : styles.btnDelete}`}
            onClick={onToggleStatus}
            title={isInactive ? "Restaurar Veículo" : "Desativar Veículo"}
          >
            {isInactive ? <RotateCcw size={18} /> : <Trash2 size={18} />}
          </button>

        </div>
      </div>

      {/* Badge da Placa */}
      <div style={{ marginTop: '8px', marginBottom: '8px' }}>
        <span className={styles.plateBadge}>{veic_placa}</span>
      </div>

      <hr className={styles.divider} />

      <div className={styles.detailsGrid}>
        <div className={styles.detailItem}>
          <Calendar className={styles.detailIcon} />
          <span>Ano: <strong className={styles.detailValue}>{veic_ano}</strong></span>
        </div>
        <div className={styles.detailItem}>
          <Droplet className={styles.detailIcon} />
          <span>Cor: <strong className={styles.detailValue}>{veic_cor}</strong></span>
        </div>
        <div className={`${styles.detailItem} ${styles.fullWidth}`}>
          <Fuel className={styles.detailIcon} />
          <span>Combustível: <strong className={styles.detailValue}>{veic_combustivel}</strong></span>
        </div>
      </div>

      {/* Observação */}
      {veic_observ && (
        <div className={styles.obsContainer}>
          <Info size={14} className={styles.obsIcon} />
          <span className={styles.obsText}>{veic_observ}</span>
        </div>
      )}

      {/* Footer com Data e Status */}
      <div className={styles.footer}>
        <div className={styles.dateInfo}>
          <CalendarClock size={14} />
          <span>Desde: {formatDate(data_inicial)}</span>
        </div>

        <span className={`${styles.statusBadge} ${!isInactive ? styles.statusActive : styles.statusInactive}`}>
          {!isInactive ? 'Ativo' : 'Inativo'}
        </span>
      </div>
    </div>
  );
};

export default VehicleUserCard;