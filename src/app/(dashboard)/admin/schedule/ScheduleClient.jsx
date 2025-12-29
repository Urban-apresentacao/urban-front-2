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
};

export default function ScheduleClient() {
    const [events, setEvents] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null); 
    const [selectedDate, setSelectedDate] = useState(null); 

    // Buscar Agendamentos (Fetch Schedule)
    const fetchSchedule = useCallback(async () => {
        try {
            const { data } = await getAppointments({ limit: 1000 });
            
            const mappedEvents = data.map(item => {
                const startDateTime = new Date(`${item.agend_data.split('T')[0]}T${item.agend_horario}`);
                const endDateTime = new Date(startDateTime.getTime() + (60 * 60 * 1000)); // +1h duration

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

    const eventPropGetter = (event) => {
        let backgroundColor = '#3b82f6'; 
        if (event.status === 1) backgroundColor = '#f59e0b'; // Pendente
        if (event.status === 3) backgroundColor = '#16a34a'; // Concluído
        if (event.status === 0) backgroundColor = '#ef4444'; // Cancelado
        return { style: { backgroundColor, border: 'none' } };
    };

    const handleSelectSlot = ({ start }) => {
        setSelectedEvent(null);
        setSelectedDate(start);
        setIsModalOpen(true);
    };

    const handleSelectEvent = (event) => {
        setSelectedEvent(event.resource); 
        setIsModalOpen(true);
    };

    const handleSave = async (formData) => {
        try {
            if (selectedEvent) {
                await updateAppointment(selectedEvent.agend_id, formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Atualizado!',
                    text: 'Agendamento atualizado com sucesso.',
                    timer: 1500,
                    showConfirmButton: false
                });
            } else {
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
            fetchSchedule(); 
        } catch (error) {
            console.error(error);
            
            // Tratamento específico para mensagem do Backend
            const errorMsg = error.response?.data?.message || 'Ocorreu um erro inesperado.';
            const isConflict = error.response?.status === 400 || errorMsg.includes("Conflito");

            Swal.fire({
                icon: isConflict ? 'warning' : 'error', // Amarelo se for conflito, Vermelho se for erro
                title: isConflict ? 'Atenção!' : 'Erro',
                text: errorMsg,
                confirmButtonColor: isConflict ? '#f59e0b' : '#ef4444', // Botão combina com o ícone
                confirmButtonText: 'Entendi'
            });
        }
    };

    const getInitialData = () => {
        if (selectedEvent) return selectedEvent;
        if (selectedDate) {
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