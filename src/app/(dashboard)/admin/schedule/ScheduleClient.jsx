"use client";
import { useState, useEffect, useCallback } from "react";
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import ptBR from 'date-fns/locale/pt-BR';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { getAppointments, createAppointment, updateAppointment } from "@/services/appointments.service";
import AppointmentForm from "@/components/appointmentsForm/appointmentsForm";
import ModalCalendar from "@/components/modals/modalCalendar/ModalCalendar";
import Swal from "sweetalert2";
import styles from "./ScheduleClient.module.css";

// Configuração de localização
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
    const [selectedEvent, setSelectedEvent] = useState(null); // Se null = Criar, Se obj = Editar
    const [selectedDate, setSelectedDate] = useState(null); // Data clicada para criar novo

    // 1. Buscar Agendamentos (Fetch Schedule)
    const fetchSchedule = useCallback(async () => {
        try {
            // Buscamos 1000 itens para garantir que preencha o mês/ano
            const { data } = await getAppointments({ limit: 1000 });
            
            // Mapear dados do banco para o formato do React Big Calendar
            const mappedEvents = data.map(item => {
                const startDateTime = new Date(`${item.agend_data.split('T')[0]}T${item.agend_horario}`);
                
                // Calculamos o fim baseando na duração real se tivermos essa info no futuro,
                // por enquanto usamos 1h padrão para visualização no calendário
                const endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000)); 

                return {
                    id: item.agend_id,
                    title: `${item.veic_placa} - ${item.usu_nome}`,
                    start: startDateTime,
                    end: endDateTime,
                    resource: item, // Guardamos o objeto original completo aqui
                    status: item.agend_situacao // Para usar na cor
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
        let backgroundColor = '#3b82f6'; // Azul (Padrão/Em andamento)
        
        if (event.status === 1) backgroundColor = '#f59e0b'; // Amarelo (Pendente)
        if (event.status === 3) backgroundColor = '#16a34a'; // Verde (Concluído)
        if (event.status === 0) backgroundColor = '#ef4444'; // Vermelho (Cancelado)

        return { style: { backgroundColor, border: 'none' } };
    };

    // 3. Ações do Calendário

    // Clicar em um slot vazio (Criar Novo)
    const handleSelectSlot = ({ start }) => {
        setSelectedEvent(null); // Modo Criação
        setSelectedDate(start); // Guarda a data clicada
        setIsModalOpen(true);
    };

    // Clicar em um evento existente (Editar/Ver)
    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource); 
        setIsModalOpen(true);
    };

    // 4. Salvar Formulário (Com tratamento de erro inteligente)
    const handleSave = async (formData) => {
        try {
            if (selectedEvent) {
                // Atualizar
                await updateAppointment(selectedEvent.agend_id, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Atualizado!',
                    text: 'Agendamento atualizado com sucesso.',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
                // Criar
                await createAppointment(formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Agendado!',
                    text: 'Novo agendamento criado com sucesso.',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
            setIsModalOpen(false);
            fetchSchedule(); // Recarrega calendário
        } catch (error) {
            console.error(error);
            
            // Tratamento específico para mensagem do Backend
            const errorMsg = error.response?.data?.message || 'Ocorreu um erro inesperado.';
            
            // Se for Status 400 (Bad Request), é Regra de Negócio -> Aviso Amarelo
            // Se for 500 ou outro, é Erro Técnico -> Erro Vermelho
            const isBusinessRule = error.response?.status === 400;

            Swal.fire({
                icon: isBusinessRule ? 'warning' : 'error',
                title: isBusinessRule ? 'Atenção!' : 'Erro no Servidor',
                text: errorMsg,
                confirmButtonColor: isBusinessRule ? '#f59e0b' : '#ef4444',
                confirmButtonText: isBusinessRule ? 'Entendi, vou corrigir' : 'Fechar'
            });
        }
    };

    // Preparar dados iniciais para o Form
    const getInitialData = () => {
        if (selectedEvent) {
            return selectedEvent; // Dados do evento clicado
        }
        if (selectedDate) {
            // Se clicou numa data vazia, pré-preenche a data
            return {
                agend_data: format(selectedDate, 'yyyy-MM-dd'),
                agend_horario: format(selectedDate, 'HH:mm'),
                agend_situacao: 1
            };
        }
        return null;
    };

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
                    defaultView="month"
                    views={['month', 'week', 'day', 'agenda']}
                />
            </div>

            {/* Modal com o Formulário */}
            <ModalCalendar 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={selectedEvent ? `Editar Agendamento #${selectedEvent.agend_id}` : "Novo Agendamento"}
            >
                <AppointmentForm 
                    initialData={getInitialData()} 
                    mode={selectedEvent ? 'edit' : 'create'}
                    onCancel={() => setIsModalOpen(false)}
                    saveFunction={handleSave}
                />
            </ModalCalendar>
        </div>
    );
}