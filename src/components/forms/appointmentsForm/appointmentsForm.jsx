"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
// 1. NOVOS ÍCONES ADICIONADOS AQUI (MessageCircle, Share2, Copy)
import { Edit, Ban, Save, ArrowLeft, Calendar, Clock, User, Car, MessageCircle, Share2, Copy } from "lucide-react";
import { getUsersList, getUserVehicles } from "@/services/users.service";
import { getServicesList } from "@/services/services.service";
import Swal from "sweetalert2"; // Certifique-se de ter instalado (npm install sweetalert2)
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

        // --- VALIDAÇÃO PREVENTIVA (FRONTEND) ---
        
        // 1. Verifica se selecionou o Cliente
        if (!formData.usu_id) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obrigatório',
                text: 'Por favor, selecione um Cliente.',
                confirmButtonColor: '#f59e0b'
            });
            return; // Para tudo aqui
        }

        // 2. Verifica se selecionou o Veículo (AQUI QUE ESTAVA O ERRO)
        if (!formData.veic_usu_id) {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Obrigatório',
                text: 'Por favor, selecione o Veículo do cliente.',
                confirmButtonColor: '#f59e0b'
            });
            return; // Para tudo aqui
        }

        // 3. (Opcional) Verifica se tem pelo menos 1 serviço
        if (!formData.services || formData.services.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Serviços Vazios',
                text: 'Selecione pelo menos um serviço para o agendamento.',
                confirmButtonColor: '#f59e0b'
            });
            return; 
        }

        // --- Se passou, envia pro servidor ---
        setLoading(true);
        try {
            await saveFunction(formData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // --- 2. NOVAS FUNÇÕES DE RASTREIO ---
    
    // Função para Enviar WhatsApp (Atualizada)
    const handleSendWhatsApp = () => {
        // Verifica se tem token
        if (!initialData || !initialData.tracking_token) {
            Swal.fire("Atenção", "Salve o agendamento primeiro para gerar o link de rastreio!", "warning");
            return;
        }

        // Limpa o telefone
        const telefoneRaw = initialData.usu_telefone || ""; 
        const telefone = telefoneRaw.replace(/\D/g, "");

        if (!telefone) {
            Swal.fire("Erro", "Cliente sem telefone cadastrado.", "error");
            return;
        }

        const nomeCliente = initialData.usu_nome?.split(" ")[0] || "Cliente";
        const baseUrl = window.location.origin; 
        const linkRastreio = `${baseUrl}/status/${initialData.tracking_token}`;

        // 1. Define o texto do status baseado no que está selecionado no formulário
        let statusTexto = "";
        switch (formData.agend_situacao) {
            case "1":
                statusTexto = "*Pendente* 🕒";
                break;
            case "2":
                statusTexto = "*Em Andamento* 🚿";
                break;
            case "3":
                statusTexto = "*Concluído* ✨";
                break;
            case "0":
                statusTexto = "*Cancelado* ❌";
                break;
            default:
                statusTexto = "atualizado";
        }

        // 2. Monta a mensagem personalizada
        const mensagem = `Olá, ${nomeCliente}! 👋\n\nSeu serviço está ${statusTexto}!\n\nPara mais informações do agendamento acesse:\n🔗 ${linkRastreio}`;

        // Abre o WhatsApp
        const linkZap = `https://wa.me/55${telefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(linkZap, "_blank");
    };

    // Função para Copiar Link
    const handleCopyLink = () => {
        if (!initialData?.tracking_token) return;
        const link = `${window.location.origin}/status/${initialData.tracking_token}`;
        navigator.clipboard.writeText(link);
        
        Swal.fire({
            icon: 'success',
            title: 'Link copiado!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
    };
    // ------------------------------------

    const getStatusStyle = (status) => {
        const s = String(status);
        if (s === "1") return { backgroundColor: '#fef3c7', color: '#b45309' };
        if (s === "2") return { backgroundColor: '#dbeafe', color: '#1e40af' };
        if (s === "3") return { backgroundColor: '#dcfce7', color: '#15803d' };
        if (s === "0") return { backgroundColor: '#fee2e2', color: '#b91c1c' };
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
                            <select className={styles.input} style={{ paddingLeft: '40px' }} value={formData.usu_id} onChange={handleClientChange} disabled={!isEditable}>
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
                            <select name="veic_usu_id" className={styles.input} style={{ paddingLeft: '40px' }} value={formData.veic_usu_id} onChange={handleChange} disabled={!formData.usu_id || vehiclesList.length === 0}>
                                <option value="">{vehiclesList.length === 0 ? "Selecione o Cliente primeiro" : "Selecione o Veículo..."}</option>
                                {Array.isArray(vehiclesList) && vehiclesList.map(v => (
                                    <option key={v.veic_usu_id} value={v.veic_usu_id}>{v.mod_nome} - {v.veic_placa}</option>
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
                        <input type="time" name="agend_horario" className={styles.input} style={{ paddingLeft: '40px' }} value={formData.agend_horario} onChange={handleChange} disabled={!isEditable} required min="07:00" max="18:00" />
                    </div>
                </div>
                {mode !== 'create' && (
                    <div className={styles.inputGroup}>
                        <label>Situação</label>
                        <select name="agend_situacao" className={styles.input} value={formData.agend_situacao} onChange={handleChange} disabled={!isEditable}>
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

            {/* --- 3. ÁREA DE RASTREIO E WHATSAPP (Aparece se já tiver token) --- */}
            {mode !== 'create' && initialData?.tracking_token && (
                <div style={{
                    marginTop: '20px',
                    padding: '16px',
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: '700', fontSize: '0.95rem' }}>
                        <Share2 size={18} />
                        <span>Link de Acompanhamento</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        {/* Botão WhatsApp */}
                        <button
                            type="button"
                            onClick={handleSendWhatsApp}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                backgroundColor: '#25D366', // Verde Zap
                                color: 'white',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'filter 0.2s',
                                fontSize: '0.9rem'
                            }}
                            onMouseOver={(e) => e.target.style.filter = 'brightness(0.9)'}
                            onMouseOut={(e) => e.target.style.filter = 'brightness(1)'}
                        >
                            <MessageCircle size={20} />
                            Enviar Status p/ Cliente
                        </button>

                        {/* Botão Copiar */}
                        <button
                            type="button"
                            onClick={handleCopyLink}
                            title="Copiar Link"
                            style={{
                                width: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'white',
                                border: '1px solid #bbf7d0',
                                color: '#166534',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}
                        >
                            <Copy size={20} />
                        </button>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#166534', opacity: 0.8, textAlign: 'center' }}>
                        Envie este link para o cliente acompanhar o serviço em tempo real.
                    </p>
                </div>
            )}
            {/* ----------------------------------------------------------------- */}

            {/* --- RODAPÉ DE AÇÕES --- */}
            <div className={styles.actionsFooter}>
                <div className={styles.leftAction}>
                    {isEditable && mode !== 'create' && onCancelAppointment && formData.agend_situacao != "0" && (
                        <button type="button" onClick={onCancelAppointment} className={`${styles.btnBase} ${styles.btnDanger}`} title="Cancelar este agendamento">
                            <Ban size={18} /> Cancelar Agendamento
                        </button>
                    )}
                </div>

                <div className={styles.rightActions}>
                    <button type="button"
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
                            <button type="button" onClick={(e) => { e.preventDefault(); setIsEditable(true); }} className={`${styles.btnBase} ${styles.btnEdit || styles.btnPrimary}`}>
                                <Edit size={18} /> Editar Agendamento
                            </button>
                        )
                    ) : (
                        <button type="submit" className={`${styles.btnBase} ${styles.btnPrimary}`} disabled={loading}>
                            <Save size={18} /> {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
}