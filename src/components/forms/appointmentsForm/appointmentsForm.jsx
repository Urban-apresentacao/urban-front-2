"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Ban, Save, ArrowLeft, Calendar, Clock, User, Car } from "lucide-react";
import { getUsersList, getUserVehicles } from "@/services/users.service";
import { getServicesList } from "@/services/services.service";
import styles from "./appointmentsForm.module.css";

export default function AppointmentForm({
    initialData,
    mode = 'view',
    onCancel,
    saveFunction,
    onCancelAppointment
}) {
    const router = useRouter();
    const [isEditable, setIsEditable] = useState(mode !== 'view');
    const [loading, setLoading] = useState(false);

    const [clientsList, setClientsList] = useState([]);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [servicesList, setServicesList] = useState([]);

    const [formData, setFormData] = useState({
        usu_id: "",
        veic_usu_id: "",
        agend_data: "",
        agend_horario: "",
        agend_observ: "",
        agend_situacao: "1",
        services: []
    });

    // --- CARGA INICIAL ---
    useEffect(() => {
        const loadDependencies = async () => {
            try {
                // 1. Carrega listas
                const [users, services] = await Promise.all([
                    getUsersList(),
                    getServicesList()
                ]);
                setClientsList(users);
                setServicesList(services);

                // 2. Popula o formulário se houver initialData
                if (initialData) {
                    const dataFormatada = initialData.agend_data ? new Date(initialData.agend_data).toISOString().split('T')[0] : "";

                    setFormData({
                        usu_id: initialData.veic_usu_id ? "loaded" : "",
                        veic_usu_id: String(initialData.veic_usu_id || ""),
                        agend_data: dataFormatada,
                        agend_horario: initialData.agend_horario || "",
                        agend_observ: initialData.agend_observ || "",

                        // --- CORREÇÃO AQUI ---
                        // Usamos '??' para que o zero (Cancelado) seja respeitado e não trocado por '1'
                        agend_situacao: String(initialData.agend_situacao ?? "1"),

                        services: initialData.servicos ? initialData.servicos.map(s => s.serv_id || s.agend_serv_id) : []
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            }
        };
        loadDependencies();
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleClientChange = async (e) => {
        const userId = e.target.value;
        setFormData(prev => ({ ...prev, usu_id: userId, veic_usu_id: "" }));

        if (userId) {
            try {
                const response = await getUserVehicles(userId);

                console.log("Resposta da API de Veículos:", response); // Debug: Veja isso no console do navegador (F12)

                // Lógica Inteligente para achar a lista:
                // 1. É um array direto? Use ele.
                // 2. Tem uma propriedade .data que é array? Use ela. (Padrão Axios/Laravel)
                // 3. Tem uma propriedade .vehicles? Use ela.
                // 4. Se não achar nada, retorna lista vazia para não quebrar.
                const realList = Array.isArray(response) ? response
                    : (response.data && Array.isArray(response.data)) ? response.data
                        : (response.vehicles && Array.isArray(response.vehicles)) ? response.vehicles
                            : [];

                setVehiclesList(realList);
            } catch (error) {
                console.error("Erro ao buscar veículos:", error);
                setVehiclesList([]);
            }
        } else {
            setVehiclesList([]);
        }
    };

    const handleServiceToggle = (servId) => {
        if (!isEditable) return;
        setFormData(prev => {
            const currentServices = prev.services || [];
            if (currentServices.includes(servId)) {
                return { ...prev, services: currentServices.filter(id => id !== servId) };
            } else {
                return { ...prev, services: [...currentServices, servId] };
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await saveFunction(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Helper para cor do Badge e Select
    const getStatusStyle = (status) => {
        // Garante comparação como String
        const s = String(status);
        if (s === "1") return { backgroundColor: '#fef3c7', color: '#b45309' }; // Pendente
        if (s === "2") return { backgroundColor: '#dbeafe', color: '#1e40af' }; // Em Andamento
        if (s === "3") return { backgroundColor: '#dcfce7', color: '#15803d' }; // Concluído
        if (s === "0") return { backgroundColor: '#fee2e2', color: '#b91c1c' }; // Cancelado
        return { backgroundColor: '#f3f4f6', color: '#374151' };
    };

    const getStatusLabel = (status) => {
        const s = String(status);
        if (s === "1") return "Pendente";
        if (s === "2") return "Em Andamento";
        if (s === "3") return "Concluído";
        if (s === "0") return "Cancelado";
        return "Desconhecido";
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.header}>
                <h3>{mode === 'create' ? 'Novo Agendamento' : `Agendamento #${initialData?.agend_id || ''}`}</h3>

                {/* Status Badge */}
                {mode !== 'create' && (
                    <span className={styles.badge} style={getStatusStyle(formData.agend_situacao)}>
                        {getStatusLabel(formData.agend_situacao)}
                    </span>
                )}
            </div>

            {/* --- SEÇÃO 1: DADOS CLIENTE --- */}
            <div className={styles.sectionTitle}>Dados do Cliente</div>
            <div className={styles.row}>
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Cliente</label>
                    {isEditable && mode === 'create' ? (
                        <div className={styles.inputIconWrapper}>
                            <User size={18} className={styles.inputIcon} />
                            <select
                                className={styles.input} style={{ paddingLeft: '40px' }}
                                value={formData.usu_id} onChange={handleClientChange}
                                disabled={!isEditable}
                            >
                                <option value="">Selecione o Cliente...</option>
                                {clientsList.map(u => (<option key={u.usu_id} value={u.usu_id}>{u.usu_nome}</option>))}
                            </select>
                        </div>
                    ) : (
                        <input type="text" className={styles.input} value={initialData?.usu_nome || "Carregando..."} disabled />
                    )}
                </div>

                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Veículo</label>
                    {isEditable && mode === 'create' ? (
                        <div className={styles.inputIconWrapper}>
                            <Car size={18} className={styles.inputIcon} />
                            <select
                                name="veic_usu_id"
                                className={styles.input} style={{ paddingLeft: '40px' }}
                                value={formData.veic_usu_id} onChange={handleChange}
                                disabled={!formData.usu_id || vehiclesList.length === 0}
                            >
                                <option value="">{vehiclesList.length === 0 ? "Selecione o Cliente primeiro" : "Selecione o Veículo..."}</option>
                                {Array.isArray(vehiclesList) && vehiclesList.map(v => (
                                    <option key={v.veic_usu_id} value={v.veic_usu_id}>
                                        {v.mod_nome} - {v.veic_placa}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <input type="text" className={styles.input} value={initialData ? `${initialData.veic_modelo || ''} - ${initialData.veic_placa || ''}` : ""} disabled />
                    )}
                </div>
            </div>

            {/* --- SEÇÃO 2: DATA E HORA --- */}
            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label>Data</label>
                    <div className={styles.inputIconWrapper}>
                        <Calendar size={18} className={styles.inputIcon} />
                        <input type="date" name="agend_data" className={styles.input} style={{ paddingLeft: '40px' }} value={formData.agend_data} onChange={handleChange} disabled={!isEditable} required />
                    </div>
                </div>
                <div className={styles.inputGroup}>
                    <label>Horário</label>
                    <div className={styles.inputIconWrapper}>
                        <Clock size={18} className={styles.inputIcon} />
                        <input
                            type="time"
                            name="agend_horario"
                            className={styles.input}
                            style={{ paddingLeft: '40px' }}
                            value={formData.agend_horario}
                            onChange={handleChange}
                            disabled={!isEditable}
                            required
                            min="07:00"
                            max="18:00"
                        />
                    </div>
                </div>
                {mode !== 'create' && (
                    <div className={styles.inputGroup}>
                        <label>Situação</label>
                        <select
                            name="agend_situacao"
                            className={styles.input}
                            value={formData.agend_situacao}
                            onChange={handleChange}
                            disabled={!isEditable}
                        >
                            <option value="1">Pendente</option>
                            <option value="2">Em Andamento</option>
                            <option value="3">Concluído</option>
                            <option value="0">Cancelado</option>
                        </select>
                    </div>
                )}
            </div>

            {/* --- SEÇÃO 3: SERVIÇOS --- */}
            <div className={styles.sectionTitle}>
                {!isEditable ? "Extrato de Serviços Realizados" : "Selecione os Serviços"}
            </div>

            {!isEditable ? (
                <div className={styles.servicesReadOnly}>
                    {formData.services && formData.services.length > 0 ? (
                        <>
                            {servicesList.filter(s => formData.services.includes(s.serv_id)).map(service => (
                                <div key={service.serv_id} className={styles.serviceRow}>
                                    <span className={styles.serviceNameRO}>{service.serv_nome}</span>
                                    <span className={styles.servicePriceRO}>{Number(service.serv_preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            ))}
                            <div className={styles.totalRow}>
                                <span>TOTAL ESTIMADO</span>
                                <span>{servicesList.filter(s => formData.services.includes(s.serv_id)).reduce((acc, curr) => acc + Number(curr.serv_preco), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </>
                    ) : (<div className={styles.noServices}>Nenhum serviço lançado.</div>)}
                </div>
            ) : (
                <div className={styles.servicesContainer}>
                    {servicesList.map(service => {
                        const isSelected = formData.services.includes(service.serv_id);
                        return (
                            <label key={service.serv_id} className={styles.serviceItem} style={{ backgroundColor: isSelected ? '#eff6ff' : 'transparent' }}>
                                <input type="checkbox" className={styles.serviceCheckbox} checked={isSelected} onChange={() => handleServiceToggle(service.serv_id)} />
                                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span className={styles.serviceName} style={{ fontWeight: isSelected ? '600' : '400' }}>{service.serv_nome}</span>
                                    <span className={styles.servicePrice}>{Number(service.serv_preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                                </div>
                            </label>
                        );
                    })}
                </div>
            )}

            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                <label>Observações</label>
                <textarea name="agend_observ" className={styles.input} style={{ height: '80px', paddingTop: '10px' }} value={formData.agend_observ} onChange={handleChange} disabled={!isEditable} placeholder="Observações..." />
            </div>

            {/* --- RODAPÉ DE AÇÕES --- */}
            <div className={styles.actionsFooter}>

                {/* LADO ESQUERDO: Botão Cancelar (Vermelho) */}
                <div className={styles.leftAction}>
                    {isEditable && mode !== 'create' && onCancelAppointment && formData.agend_situacao != "0" && (
                        <button
                            type="button"
                            onClick={onCancelAppointment}
                            className={`${styles.btnBase} ${styles.btnDanger}`}
                            title="Cancelar este agendamento"
                        >
                            <Ban size={18} /> Cancelar Agendamento
                        </button>
                    )}
                </div>

                {/* LADO DIREITO: Voltar e Salvar */}
                <div className={styles.rightActions}>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            if (mode === 'create') onCancel();
                            else if (isEditable && mode !== 'create') setIsEditable(false);
                            else onCancel();
                        }}
                        className={`${styles.btnBase} ${styles.btnSecondary}`}
                    >
                        <ArrowLeft size={18} /> {isEditable && mode !== 'create' ? "Cancelar Edição" : "Voltar"}
                    </button>

                    {!isEditable ? (
                        formData.agend_situacao != "0" && (
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); setIsEditable(true); }}
                                className={`${styles.btnBase} ${styles.btnEdit || styles.btnPrimary}`}
                            >
                                <Edit size={18} /> Editar Agendamento
                            </button>
                        )
                    ) : (
                        <button
                            type="submit"
                            className={`${styles.btnBase} ${styles.btnPrimary}`}
                            disabled={loading}
                        >
                            <Save size={18} /> {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    )}
                </div>

            </div>
        </form>
    );
}