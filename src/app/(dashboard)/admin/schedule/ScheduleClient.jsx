"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { 
    getAppointments, 
    createAppointment, 
    updateAppointment,
    getAppointmentById,
    cancelAppointment 
} from "@/services/appointments.service";

import AppointmentForm from "@/components/forms/appointmentsForm/appointmentsForm";
import ModalCalendar from "@/components/modals/modalCalendar/ModalCalendar";
import Swal from "sweetalert2";
import styles from "./ScheduleClient.module.css";

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({
  format, parse, startOfWeek, getDay, locales,
});

const messages = {
    allDay: 'Dia Inteiro',
    previous: '<',
    next: '>',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    agenda: 'Agenda',
    date: 'Data',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'Não há agendamentos neste período.',
    showMore: (total) => `mais ${total} `,
};

export default function ScheduleClient() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); 

    // 1. Buscar Agendamentos (Fetch Schedule)
    const fetchSchedule = useCallback(async () => {
        try {
            const { data } = await getAppointments({ limit: 1000 });
            
            const mappedEvents = data.map(item => {
                const startDateTime = new Date(`${item.agend_data.split('T')[0]}T${item.agend_horario}`);
                const endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000)); 

                return {
                    id: item.agend_id,
                    title: `${item.veic_placa} - ${item.usu_nome}`,
                    start: startDateTime,
                    end: endDateTime,
                    resource: item,
                    status: item.agend_situacao 
                };
            });

            setEvents(mappedEvents);
        } catch (error) {
            console.error("Erro ao carregar agenda (schedule):", error);
        }
    }, []);

    useEffect(() => {
        fetchSchedule();
    }, [fetchSchedule]);

    // 2. Estilização dos Eventos (Cores por Status)
    const eventPropGetter = (event) => {
        let backgroundColor = '#3b82f6'; 
        if (event.status === 1) backgroundColor = '#f59e0b'; // Pendente
        if (event.status === 3) backgroundColor = '#16a34a'; // Concluído
        if (event.status === 0) backgroundColor = '#ef4444'; // Cancelado

        return { style: { backgroundColor, border: 'none' } };
    };

    // 3. Ações do Calendário

    // Clicar em um slot vazio (Criar Novo)
    const handleSelectSlot = ({ start }) => {
        setSelectedEvent(null); 
        setSelectedDate(start); 
        setIsModalOpen(true);
    };

    // Clicar em um evento existente (Editar)
    const handleSelectEvent = async (event) => {
        try {
            // Busca os dados COMPLETOS pelo ID (corrige veículo undefined e serviços vazios)
            const response = await getAppointmentById(event.id);
            const fullData = response.data;
            
            // Tratamento para montar o nome do veículo corretamente se necessário
            if (fullData.veic_modelo && fullData.veic_placa) {
                 fullData.veiculoLabel = `${fullData.veic_modelo} - ${fullData.veic_placa}`;
            }
            
            setSelectedEvent(fullData); 
            setIsModalOpen(true);

        } catch (error) {
            console.error("Erro ao buscar detalhes:", error);
            Swal.fire("Erro", "Não foi possível carregar os detalhes do agendamento.", "error");
        }
    };

    // 4. Salvar Formulário (Create/Update) com Lógica de WhatsApp e Tratamento de Erro Silencioso
    const handleSave = async (formData) => {
        try {
            // Converte lista de objetos de serviços para lista de IDs
            const payload = {
                ...formData,
                services: formData.services?.map(s => s.serv_id || s) || []
            };

            let savedData = null;
            let isUpdate = false;

            if (selectedEvent) {
                // --- ATUALIZAÇÃO ---
                isUpdate = true;
                const response = await updateAppointment(selectedEvent.agend_id, payload);
                savedData = { ...selectedEvent, ...response.data, ...formData }; 
            } else {
                // --- CRIAÇÃO ---
                await createAppointment(payload);
            }

            // Fecha o modal e recarrega a agenda
            setIsModalOpen(false);
            fetchSchedule();

            // --- LÓGICA DE NOTIFICAÇÃO (WHATSAPP) ---
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
                    const baseUrl = window.location.origin;
                    
                    if (telefone && savedData.tracking_token) {
                        const linkRastreio = `${baseUrl}/status/${savedData.tracking_token}`;
                        let statusTexto = "";
                        if (formData.agend_situacao === "2") statusTexto = "*Em Andamento* 🚿";
                        if (formData.agend_situacao === "3") statusTexto = "*Concluído* ✨";

                        const mensagem = `Olá, ${nomeCliente}! 👋\n\nSeu serviço está ${statusTexto}!\n\nAcompanhe aqui:\n🔗 ${linkRastreio}`;
                        const linkZap = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
                        window.open(linkZap, "_blank");
                    } else {
                        Swal.fire("Aviso", "Não foi possível abrir o WhatsApp (falta telefone ou token).", "warning");
                    }
                }
            } else {
                Swal.fire({
                    icon: 'success',
                    title: isUpdate ? 'Atualizado!' : 'Agendado!',
                    text: isUpdate ? 'Agendamento atualizado com sucesso.' : 'Novo agendamento criado com sucesso.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }

        } catch (error) {
            // --- TRATAMENTO DE ERROS (CORRIGIDO) ---
            const status = error.response?.status;
            const errorMsg = error.response?.data?.message || 'Ocorreu um erro inesperado.';
            const isBusinessRule = status === 400; // Erro 400 = Conflito de Horário, Validação, etc.

            if (isBusinessRule) {
                // SE FOR REGRA DE NEGÓCIO: Apenas Swal Amarelo. NÃO logamos no console para evitar o overlay do Next.
                Swal.fire({
                    icon: 'warning',
                    title: 'Atenção!',
                    text: errorMsg,
                    confirmButtonColor: '#f59e0b',
                });
                return; // Para a execução aqui.
            }

            // SE FOR OUTRO ERRO (500, Rede, etc): Logamos e mostramos Swal Vermelho.
            console.error(error); 
            Swal.fire({
                icon: 'error',
                title: 'Erro no Servidor',
                text: errorMsg,
                confirmButtonColor: '#ef4444',
            });
        }
    };

    // 5. Cancelar Agendamento (Botão Vermelho)
    const handleCancelEvent = async () => {
        if (!selectedEvent) return;

        const result = await Swal.fire({
            title: 'Cancelar Agendamento?',
            text: `Tem certeza que deseja cancelar este agendamento?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, cancelar',
            cancelButtonText: 'Não, manter'
        });

        if (result.isConfirmed) {
            try {
                await cancelAppointment(selectedEvent.agend_id);
                await Swal.fire({
                    icon: 'success', title: 'Cancelado!', text: 'Agendamento cancelado com sucesso.',
                    timer: 1500, showConfirmButton: false
                });
                setIsModalOpen(false);
                fetchSchedule();
            } catch (error) {
                console.error(error);
                Swal.fire('Erro', 'Não foi possível cancelar o agendamento.', 'error');
            }
        }
    };

    const getFormMode = () => {
        if (!selectedEvent) return 'create'; // Se não tem evento, é criação

        // Se estiver Concluído (3) ou Cancelado (0), força o modo visualização
        const status = String(selectedEvent.agend_situacao);
        if (status === '3' || status === '0') {
            return 'view';
        }

        // Se for Pendente (1) ou Em Andamento (2), mantém edição direta (ou mude para 'view' se preferir)
        return 'edit';
    };

    // Preparar dados iniciais para o Form
    const getInitialData = () => {
        if (selectedEvent) {
            return selectedEvent;
        }
        if (selectedDate) {
            return {
                agend_data: format(selectedDate, 'yyyy-MM-dd'),
                agend_horario: format(selectedDate, 'HH:mm'),
                agend_situacao: 1
            };
        }
        return null;
    };

    const { minTime, maxTime } = useMemo(() => {
        const base = new Date();
        // Define o início da visualização: 07:00
        const min = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 7, 0, 0);
        
        // Define o fim da visualização: 18:00 (O calendário mostra até o final dessa hora)
        const max = new Date(base.getFullYear(), base.getMonth(), base.getDate(), 18, 0, 0);

        return { minTime: min, maxTime: max };
    }, []);

    return (
        <div className={styles.wrapper}>
            <div className={styles.calendarContainer}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: '100%' }}
                    culture="pt-BR"
                    messages={messages}
                    eventPropGetter={eventPropGetter}
                    onSelectEvent={handleSelectEvent}
                    onSelectSlot={handleSelectSlot}
                    selectable
                    longPressThreshold={0}
                    defaultView="month"
                    views={['month', 'week', 'day', 'agenda']}
                    min={minTime} // Começa a mostrar as 07:00
                    max={maxTime} // Termina de mostrar as 18:00
                />
            </div>

            <ModalCalendar 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                title={selectedEvent ? `Agendamento #${selectedEvent.agend_id}` : "Novo Agendamento"}
            >
                <AppointmentForm 
                    initialData={getInitialData()} 
                    mode={getFormMode()}
                    onCancel={() => setIsModalOpen(false)}
                    saveFunction={handleSave}
                    onCancelAppointment={handleCancelEvent}
                />
            </ModalCalendar>
        </div>
    );
}