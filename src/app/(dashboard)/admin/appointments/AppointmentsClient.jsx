"use client";

import { useAppointments } from "@/hooks/useAppointments";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Eye, Search, Ban, Calendar, Filter, Plus, MessageCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Pagination } from "@/components/ui/pagination/pagination";
import Swal from "sweetalert2";

// Importações dos Serviços e Componentes do Modal
import { cancelAppointment, createAppointment, updateAppointment, getAppointmentById } from "@/services/appointments.service";
import AppointmentForm from "@/components/forms/appointmentsForm/appointmentsForm";
import ModalCalendar from "@/components/modals/modalCalendar/ModalCalendar";

import styles from "./AppointmentsClient.module.css";

const STATUS_MAP = {
  1: { label: "Pendente", color: "#f59e0b", bg: "#fef3c7" },
  2: { label: "Em Andamento", color: "#3b82f6", bg: "#dbeafe" },
  3: { label: "Concluído", color: "#16a34a", bg: "#dcfce7" },
  0: { label: "Cancelado", color: "#ef4444", bg: "#fee2e2" },
};

export default function AppointmentsClient() {
  const {
    appointments, loading, fetchAppointments, page, totalPages,
    sortColumn, sortDirection, handleSort
  } = useAppointments();

  const [filters, setFilters] = useState({ search: "", date: "", status: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const isMounted = useRef(false);

  useEffect(() => {
    fetchAppointments(filters, 1, "agend_data", "DESC");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchAppointments]);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      fetchAppointments(filters, 1, sortColumn, sortDirection);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [filters.search, filters.date, filters.status, sortColumn, sortDirection, fetchAppointments]);

  const handlePageChange = (newPage) => fetchAppointments(filters, newPage, sortColumn, sortDirection);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // --- AÇÕES DO MODAL ---

  // NOTA: handleOpenCreate não é mais usado no botão principal, 
  // mas mantive caso precise abrir o modal de outra forma no futuro.
  const handleOpenCreate = () => {
    setSelectedEvent(null);
    setFormMode('create');
    setIsModalOpen(true);
  };

  // 2. Abrir Modal de EDIÇÃO/VISUALIZAÇÃO
  const handleOpenEdit = async (id, mode = 'edit') => {
    try {
      const response = await getAppointmentById(id);
      const fullData = response.data;

      if (fullData.veic_modelo && fullData.veic_placa) {
        fullData.veiculoLabel = `${fullData.veic_modelo} - ${fullData.veic_placa}`;
      }

      setSelectedEvent(fullData);
      setFormMode(mode);
      setIsModalOpen(true);
    } catch (error) {
      console.error(error);
      Swal.fire("Erro", "Não foi possível carregar os detalhes.", "error");
    }
  };

  // 3. SALVAR (Com Lógica do WhatsApp)
  const handleSave = async (formData) => {
    try {
      const payload = {
        ...formData,
        services: formData.services?.map(s => s.serv_id || s) || []
      };

      let savedData = null;
      let isUpdate = false;

      if (selectedEvent) {
        isUpdate = true;
        const response = await updateAppointment(selectedEvent.agend_id, payload);
        savedData = { ...selectedEvent, ...response.data, ...formData };
      } else {
        await createAppointment(payload);
      }

      setIsModalOpen(false);
      fetchAppointments(filters, page, sortColumn, sortDirection);

      if (isUpdate && savedData && (formData.agend_situacao === "2" || formData.agend_situacao === "3")) {
        const result = await Swal.fire({
          title: 'Agendamento Salvo!',
          text: "Deseja notificar o cliente no WhatsApp sobre a mudança de status?",
          icon: 'success',
          showCancelButton: true,
          confirmButtonColor: '#25D366',
          cancelButtonColor: '#6b7280',
          confirmButtonText: 'Sim, enviar WhatsApp',
          cancelButtonText: 'Não, apenas fechar'
        });

        if (result.isConfirmed) {
          const telefoneRaw = savedData.usu_telefone || "";
          const telefone = telefoneRaw.replace(/\D/g, "");
          const nomeCliente = savedData.usu_nome?.split(" ")[0] || "Cliente";
          const baseUrl = "https://urban-front-2.vercel.app/";

          if (telefone && savedData.tracking_token) {
            const linkRastreio = `${baseUrl}/status/${savedData.tracking_token}`;

            let statusTexto = "";
            if (formData.agend_situacao === "2") {
              statusTexto = `*Em Andamento* \u{1F6BF}`; // 🚿
            }
            if (formData.agend_situacao === "3") {
              statusTexto = `*Concluído* \u{2728}`; // ✨
            }

            const mensagem =
              `Olá, ${nomeCliente}!\n\n` +
              `Seu serviço está ${statusTexto}!\n\n` +
              `Acompanhe aqui:\n` +
              `${linkRastreio}`;

            const mensagemCodificada = encodeURIComponent(mensagem);
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            const linkZap = isMobile
              ? `https://api.whatsapp.com/send?phone=55${telefone}&text=${mensagemCodificada}`
              : `https://web.whatsapp.com/send?phone=55${telefone}&text=${mensagemCodificada}`;

            window.open(linkZap, "_blank");
          } else {
            Swal.fire("Aviso", "Falta telefone ou token para abrir o WhatsApp.", "warning");
          }
        }
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Salvo!',
          text: 'Agendamento salvo com sucesso.',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Erro ao salvar.';
      Swal.fire({ icon: 'error', title: 'Erro', text: errorMsg });
    }
  };


  const handleCancel = async (id, cliente) => {
    const result = await Swal.fire({
      title: 'Cancelar Agendamento?',
      text: `Deseja cancelar o agendamento de ${cliente}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Sim, cancelar',
      cancelButtonText: 'Voltar'
    });

    if (result.isConfirmed) {
      try {
        await cancelAppointment(id);
        await Swal.fire('Cancelado!', 'O agendamento foi cancelado.', 'success');
        fetchAppointments(filters, page, sortColumn, sortDirection);
      } catch (error) {
        console.error(error);
        Swal.fire('Erro', 'Não foi possível cancelar.', 'error');
      }
    }
  };

  // --- FUNÇÃO PARA O BOTÃO AVULSO DO WHATSAPP ---
  // const handleSendWhatsAppDirect = (item) => {
  //   if (!item.tracking_token) return;
  //   const telefoneRaw = item.usu_telefone || ""; 
  //   const telefone = telefoneRaw.replace(/\D/g, "");
  //   if (!telefone) return Swal.fire("Erro", "Sem telefone.", "error");

  //   const nomeCliente = item.usu_nome?.split(" ")[0] || "Cliente";
  //   const baseUrl = window.location.origin; 
  //   const linkRastreio = `${baseUrl}/status/${item.tracking_token}`;

  //   let statusTexto = "";
  //   if (String(item.agend_situacao) === "1") statusTexto = "*Pendente* 🕒";
  //   if (String(item.agend_situacao) === "2") statusTexto = "*Em Andamento* 🚿";
  //   if (String(item.agend_situacao) === "3") statusTexto = "*Concluído* ✨";

  //   const mensagem = `Olá, ${nomeCliente}!\n\nSeu serviço está ${statusTexto}!\n\nAcompanhe aqui:\n ${linkRastreio}`;
  //   const linkZap = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
  //   window.open(linkZap, "_blank");
  // };

  const handleSendWhatsAppDirect = (item) => {
    if (!item.tracking_token) return;
    const telefoneRaw = item.usu_telefone || "";
    const telefone = telefoneRaw.replace(/\D/g, "");
    if (!telefone) return Swal.fire("Erro", "Sem telefone.", "error");

    const nomeCliente = item.usu_nome?.split(" ")[0] || "Cliente";
    const baseUrl = window.location.origin;
    const linkRastreio = `${baseUrl}/status/${item.tracking_token}`;

    let statusTexto = "";
    if (String(item.agend_situacao) === "1") statusTexto = "*Pendente* 🕒";
    if (String(item.agend_situacao) === "2") statusTexto = "*Em Andamento* 🚿";
    if (String(item.agend_situacao) === "3") statusTexto = "*Concluído* ✨";

    const mensagem = `Olá, ${nomeCliente}!\n\nSeu serviço está ${statusTexto}!\n\nObtenha mais informações através do link:\n ${linkRastreio}`;
    const mensagemCodificada = encodeURIComponent(mensagem);

    // --- LÓGICA AUTOMÁTICA (IF) ---

    // Detecta se é mobile (Android, iPhone, iPad, etc)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    let linkZap = "";

    if (isMobile) {
      // No celular, usa o link da API que abre o aplicativo direto
      linkZap = `https://api.whatsapp.com/send?phone=55${telefone}&text=${mensagemCodificada}`;
    } else {
      // No computador, força a abertura do WhatsApp WEB para pular a tela de escolha
      linkZap = `https://web.whatsapp.com/send?phone=55${telefone}&text=${mensagemCodificada}`;
    }

    window.open(linkZap, "_blank");
  };

  // --- COLUNAS DA TABELA ---
  const columns = [
    { header: "ID", accessor: "agend_id" },
    {
      header: "Placa",
      accessor: "veic_placa",
      render: (item) => (
        <span style={{ fontWeight: 'bold', fontFamily: 'monospace', fontSize: '0.9rem' }}>
          {item.veic_placa}
        </span>
      )
    },
    {
      header: "Data",
      accessor: "agend_data",
      render: (item) => {
        if (!item.agend_data) return "";

        // Garante yyyy-mm-dd sem timezone
        const [year, month, day] = item.agend_data.substring(0, 10).split("-");
        return `${day}/${month}/${year}`;
      }
    },
    {
      header: "Horário",
      accessor: "agend_horario",
      render: (item) => item.agend_horario ? item.agend_horario.substring(0, 5) : '--:--'
    },
    {
      header: "Serviço(s)",
      accessor: "lista_servicos",
      render: (item) => {
        const servicos = item.lista_servicos || "Nenhum";
        return (
          <span title={servicos} style={{ display: 'block', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {servicos}
          </span>
        );
      }
    },
    { header: "Cliente", accessor: "usu_nome" },
    {
      header: "Status",
      accessor: "agend_situacao",
      render: (item) => {
        const status = STATUS_MAP[item.agend_situacao] || { label: "Desconhecido", color: "#666", bg: "#eee" };
        return (
          <span style={{
            backgroundColor: status.bg,
            color: status.color,
            padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap'
          }}>
            {status.label}
          </span>
        );
      },
    },
    {
      header: "Ações",
      accessor: "actions",
      render: (item) => (
        <div style={{ display: 'flex', gap: '8px' }}>

          {/* 1. VISUALIZAR (Azul - Só Ícone) */}
          <button
            onClick={() => handleOpenEdit(item.agend_id, 'view')}
            title="Visualizar"
            style={{ display: 'flex', alignItems: 'center', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Eye size={18} />
          </button>

          {item.agend_situacao !== 0 && (
            <>
              {/* 2. EDITAR (Azul - Só Ícone) */}
              <button
                onClick={() => handleOpenEdit(item.agend_id, 'edit')}
                title="Editar"
                style={{ display: 'flex', alignItems: 'center', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Edit size={18} />
              </button>

              {/* 3. CANCELAR (Vermelho - Só Ícone) */}
              <button
                onClick={() => handleCancel(item.agend_id, item.usu_nome)}
                title="Cancelar"
                style={{ display: 'flex', alignItems: 'center', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <Ban size={18} />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.actionsBar}>

        {/* GRUPO DE FILTROS */}
        <div className={styles.filtersGroup}>
          <div className={styles.searchWrapper}>
            <Search size={20} className={styles.searchIcon} />
            <input name="search" type="text" placeholder="Pesquisar..." className={styles.searchInput} value={filters.search} onChange={handleFilterChange} />
          </div>
          <div className={styles.selectWrapper}>
            <Filter size={16} className={styles.filterIcon} />
            <select name="status" className={styles.filterSelect} value={filters.status} onChange={handleFilterChange}>
              <option value="">Todos</option>
              <option value="1">Pendente</option>
              <option value="2">Em Andamento</option>
              <option value="3">Concluído</option>
              <option value="0">Cancelado</option>
            </select>
          </div>
          <div className={styles.dateWrapper}>
            <Calendar size={16} className={styles.filterIcon} />
            <input name="date" type="date" className={styles.filterInput} value={filters.date} onChange={handleFilterChange} />
          </div>
        </div>

        <Link href="/admin/schedule" className={styles.newButton}>
          <Plus size={20} />
          <span>Novo Agendamento</span>
        </Link>

      </div>

      <div className={styles.tableContainer}>
        <Table columns={columns} data={appointments} isLoading={loading} onSort={handleSort} sortColumn={sortColumn} sortDirection={sortDirection} />
      </div>

      {!loading && appointments.length > 0 && (
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      )}

      <ModalCalendar
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEvent ? `Agendamento #${selectedEvent.agend_id}` : "Novo Agendamento"}
      >
        <AppointmentForm
          initialData={selectedEvent}
          mode={formMode}
          onCancel={() => setIsModalOpen(false)}
          saveFunction={handleSave}
          onCancelAppointment={() => handleCancel(selectedEvent?.agend_id, selectedEvent?.usu_nome)}
        />
      </ModalCalendar>

    </div>
  );
}