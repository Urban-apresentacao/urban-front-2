"use client";
import { useState, useEffect } from "react";
import { Users, CalendarCheck, Clock, DollarSign, Activity, CalendarDays, TrendingUp, Eye, EyeOff } from "lucide-react";
import { getDashboardStats } from "@/services/dashboard.service";

import StatCard from "@/components/dashboard/statCard/StatCard";
import SectionCard from "@/components/dashboard/sectionCard/SectionCard";
import ServiceChart from "@/components/dashboard/serviceChart/ServiceChart";

import styles from "./page.module.css";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [showRevenue, setShowRevenue] = useState(false);

    const todayFormatted = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });

    useEffect(() => {
        async function loadData() {
            try {
                const stats = await getDashboardStats();
                setData(stats);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    if (loading) return <div className={styles.loadingContainer}>Carregando painel...</div>;
    if (!data) return <div className={styles.loadingContainer}>Erro ao carregar dados.</div>;

    const formatMoney = (value) => Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Dashboard Administrativo</h1>
                <span className={styles.dateBadge}>{todayFormatted}</span>
            </header>

            {/* 1. GRID DE ESTATÍSTICAS (Usando StatCard) */}
            <div className={styles.statsGrid}>
                <StatCard title="Clientes Totais" value={data.cards.clientes_totais} icon={<Users size={24} />} />
                <StatCard title="Veículos Hoje" value={data.cards.veiculos_hoje} icon={<CalendarDays size={24} />} />

                {/* StatCard com Ação (Olhinho) */}
                <StatCard
                    title="Faturamento (Mês)"
                    value={showRevenue ? formatMoney(data.cards.faturamento_mes) : "R$ ****"}
                    icon={<DollarSign size={24} />}
                    action={
                        <button onClick={() => setShowRevenue(!showRevenue)} className={styles.eyeBtn}>
                            {showRevenue ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />

                <StatCard title="Serviços Concluídos" value={data.cards.concluidos_mes} icon={<Activity size={24} />} />
            </div>

            {/* 2. GRID OPERACIONAL (Usando SectionCard) */}
            <div className={styles.contentGrid}>

                {/* Coluna 1: Em Andamento */}
                <SectionCard
                    title="Em Andamento (Prioritário)"
                    icon={<Clock size={20} />}
                >
                    {data.em_andamento ? (
                        <div className={styles.activeService}>
                            <div className={styles.pulseContainer}>
                                <div className={styles.pulseDot}></div>
                                <div className={styles.pulseRing}></div>
                            </div>

                            {(() => {
                                const servicos =
                                    data.em_andamento.lista_servicos?.split(
                                        "+"
                                    ) || [];

                                const servicoPrincipal = servicos[0];
                                const extras = servicos.length - 1;

                                return (
                                    <h3 className={styles.serviceName}>
                                        {servicoPrincipal}
                                        {extras > 0 && (
                                            <span
                                                className={
                                                    styles.extraServices
                                                }
                                            >
                                                {" "}
                                                +{extras}
                                            </span>
                                        )}
                                    </h3>
                                );
                            })()}

                            <p className={styles.clientName}>
                                {data.em_andamento.usu_nome} (
                                {data.em_andamento.mod_nome} -{" "}
                                {data.em_andamento.veic_placa})
                            </p>

                            <div className={styles.metaData}>
                                <span>
                                    Início:{" "}
                                    {data.em_andamento.agend_horario.substring(
                                        0,
                                        5
                                    )}
                                </span>
                                <span className={styles.divider}>•</span>
                                <span>
                                    Tel:{" "}
                                    {data.em_andamento.usu_telefone}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.emptyState}>
                            <p>Nenhum serviço em andamento.</p>
                        </div>
                    )}
                </SectionCard>

                {/* Coluna 2: Próximas Entradas */}
                <SectionCard title="Próximas Entradas" icon={<CalendarCheck size={20} />}>
                    <div className={styles.appointmentList}>
                        {data.proximas_entradas.map((app, index) => (
                            <div key={index} className={styles.appointmentItem}>
                                <div className={styles.apptInfo}>
                                    <span className={styles.apptService}>{app.servico_principal}</span>
                                    <span className={styles.apptClient}>{app.usu_nome} ({app.mod_nome})</span>
                                </div>
                                <div className={styles.timeBadge}>{app.agend_horario.substring(0, 5)}</div>
                            </div>
                        ))}
                        {data.proximas_entradas.length === 0 && <p className={styles.emptyState}>Agenda livre!</p>}
                    </div>
                </SectionCard>
            </div>

            {/* 3. GRID ANALÍTICO (Usando SectionCard + ServiceChart) */}
            <div className={styles.analyticsSection}>
                <SectionCard title="Serviços Mais Procurados (Mês)" icon={<TrendingUp size={20} />}>
                    <ServiceChart data={data.grafico_servicos} />
                </SectionCard>
            </div>
        </div>
    );
}