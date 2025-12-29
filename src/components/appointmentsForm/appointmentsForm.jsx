"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Edit, Ban, Save, ArrowLeft, Calendar, Clock, User, Car } from "lucide-react";
import Swal from "sweetalert2";

// Services
import { getUsersList, getUserVehicles } from "@/services/users.service";
import { getServicesList } from "@/services/services.service";

// Styles (Reutilizando o padrão do UserForm/ServiceForm)
import styles from "./appointmentsForm.module.css"; 

export default function AppointmentForm({ 
    initialData, 
    mode = 'view', // 'view', 'edit', 'create'
    onCancel, 
    saveFunction 
}) {
    const router = useRouter();
    const [isEditable, setIsEditable] = useState(mode !== 'view');
    const [loading, setLoading] = useState(false);
    
    // Listas para os Selects
    const [clientsList, setClientsList] = useState([]);
    const [vehiclesList, setVehiclesList] = useState([]);
    const [servicesList, setServicesList] = useState([]);

    // Estado do Formulário
    const [formData, setFormData] = useState({
        usu_id: "",        // ID do Cliente (apenas para controle visual)
        veic_usu_id: "",   // ID do Vínculo (que vai pro banco)
        agend_data: "",
        agend_horario: "",
        agend_observ: "",
        agend_situacao: "1",
        services: []       // Array de IDs dos serviços selecionados [1, 5, 9]
    });

    // --- CARGA INICIAL DE DADOS ---
    useEffect(() => {
        const loadDependencies = async () => {
            try {
                // 1. Carrega Clientes e Serviços disponiveis
                const [users, services] = await Promise.all([
                    getUsersList(),
                    getServicesList()
                ]);
                setClientsList(users);
                setServicesList(services);

                // 2. Se tiver dados iniciais (Edição/Visualização), popula o form
                if (initialData) {
                    // Formata Data (yyyy-MM-dd)
                    const dataFormatada = initialData.agend_data ? new Date(initialData.agend_data).toISOString().split('T')[0] : "";
                    
                    setFormData({
                        usu_id: initialData.veic_usu_id ? "loaded" : "", // Gambiarra para saber que já carregou
                        veic_usu_id: String(initialData.veic_usu_id),
                        agend_data: dataFormatada,
                        agend_horario: initialData.agend_horario || "",
                        agend_observ: initialData.agend_observ || "",
                        agend_situacao: String(initialData.agend_situacao),
                        // Mapeia os serviços que vieram do banco para um array de IDs
                        services: initialData.servicos ? initialData.servicos.map(s => s.serv_id || s.agend_serv_id) : []
                    });

                    // Busca o usuário dono deste agendamento para preencher o select de cliente
                    // (Aqui simplificamos: pegamos o nome do usuario que veio no initialData e achamos na lista)
                    // Num cenário real, o ideal seria ter o usu_id direto no initialData
                }
            } catch (error) {
                console.error("Erro ao carregar dependências", error);
            }
        };
        loadDependencies();
    }, [initialData]);

    // --- EFEITO: CARREGAR VEÍCULOS QUANDO MUDAR CLIENTE ---
    // (Lógica complexa: Se for edição, já vem preenchido. Se for novo, usuário escolhe)
    useEffect(() => {
        // Se estamos em modo de criação ou edição manual
        // Precisamos saber qual usuário está selecionado para buscar os carros
    }, [formData.usu_id]);

    // Handler genérico
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handler Especial: Seleção de Cliente -> Busca Veículos
    const handleClientChange = async (e) => {
        const userId = e.target.value;
        setFormData(prev => ({ ...prev, usu_id: userId, veic_usu_id: "" })); // Limpa veículo ao trocar cliente
        
        if (userId) {
            const vehicles = await getUserVehicles(userId);
            setVehiclesList(vehicles);
        } else {
            setVehiclesList([]);
        }
    };

    // Handler Especial: Checkbox de Serviços
    const handleServiceToggle = (servId) => {
        if (!isEditable) return;
        
        setFormData(prev => {
            const currentServices = prev.services || [];
            if (currentServices.includes(servId)) {
                // Remove se já existe
                return { ...prev, services: currentServices.filter(id => id !== servId) };
            } else {
                // Adiciona se não existe
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

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            
            <div className={styles.header}>
                <h3>{mode === 'create' ? 'Novo Agendamento' : `Agendamento #${initialData?.agend_id || ''}`}</h3>
                
                {/* Status Badge (Visual apenas) */}
                {mode !== 'create' && (
                    <span className={styles.badge} style={{ 
                        backgroundColor: formData.agend_situacao == 1 ? '#fef3c7' : 
                                         formData.agend_situacao == 2 ? '#dbeafe' : 
                                         formData.agend_situacao == 3 ? '#dcfce7' : '#fee2e2',
                        color: formData.agend_situacao == 1 ? '#b45309' : 
                               formData.agend_situacao == 2 ? '#1e40af' : 
                               formData.agend_situacao == 3 ? '#15803d' : '#b91c1c',
                        padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                        {formData.agend_situacao == 1 ? "Pendente" : 
                         formData.agend_situacao == 2 ? "Em Andamento" : 
                         formData.agend_situacao == 3 ? "Concluído" : "Cancelado"}
                    </span>
                )}
            </div>

            {/* --- SEÇÃO 1: CLIENTE E VEÍCULO --- */}
            <div className={styles.sectionTitle}>Dados do Cliente</div>
            <div className={styles.row}>
                {/* Cliente */}
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Cliente</label>
                    {/* Se estiver editando/criando, mostra select. Se visualizando, mostra texto fixo */}
                    {isEditable && mode === 'create' ? (
                        <div className={styles.inputIconWrapper}>
                            <User size={18} className={styles.inputIcon} />
                            <select 
                                className={styles.input} 
                                style={{ paddingLeft: '40px' }}
                                value={formData.usu_id} 
                                onChange={handleClientChange}
                                disabled={!isEditable}
                            >
                                <option value="">Selecione o Cliente...</option>
                                {clientsList.map(u => (
                                    <option key={u.usu_id} value={u.usu_id}>{u.usu_nome}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        // Modo Visualização/Edição (Cliente fica travado para não quebrar a lógica fácil)
                        <input 
                            type="text" 
                            className={styles.input} 
                            value={initialData?.usu_nome || "Carregando..."} 
                            disabled 
                        />
                    )}
                </div>

                {/* Veículo */}
                <div className={styles.inputGroup} style={{ flex: 1 }}>
                    <label>Veículo</label>
                    {isEditable && mode === 'create' ? (
                        <div className={styles.inputIconWrapper}>
                            <Car size={18} className={styles.inputIcon} />
                            <select 
                                name="veic_usu_id"
                                className={styles.input} 
                                style={{ paddingLeft: '40px' }}
                                value={formData.veic_usu_id} 
                                onChange={handleChange}
                                disabled={!formData.usu_id || vehiclesList.length === 0}
                            >
                                <option value="">{vehiclesList.length === 0 ? "Selecione o Cliente primeiro" : "Selecione o Veículo..."}</option>
                                {vehiclesList.map(v => (
                                    <option key={v.veic_usu_id} value={v.veic_usu_id}>
                                        {v.mod_nome} - {v.veic_placa}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <input 
                            type="text" 
                            className={styles.input} 
                            value={initialData ? `${initialData.veic_modelo} - ${initialData.veic_placa}` : ""} 
                            disabled 
                        />
                    )}
                </div>
            </div>

            {/* --- SEÇÃO 2: DATA E HORA --- */}
            <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label>Data</label>
                    <div className={styles.inputIconWrapper}>
                        <Calendar size={18} className={styles.inputIcon} />
                        <input 
                            type="date" name="agend_data"
                            className={styles.input} style={{ paddingLeft: '40px' }}
                            value={formData.agend_data} onChange={handleChange}
                            disabled={!isEditable} required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Horário</label>
                    <div className={styles.inputIconWrapper}>
                        <Clock size={18} className={styles.inputIcon} />
                        <input 
                            type="time" name="agend_horario"
                            className={styles.input} style={{ paddingLeft: '40px' }}
                            value={formData.agend_horario} onChange={handleChange}
                            disabled={!isEditable} required
                        />
                    </div>
                </div>

                <div className={styles.inputGroup}>
                    <label>Situação</label>
                    <select 
                        name="agend_situacao"
                        className={styles.input}
                        value={formData.agend_situacao} onChange={handleChange}
                        disabled={!isEditable}
                    >
                        <option value="1">Pendente</option>
                        <option value="2">Em Andamento</option>
                        <option value="3">Concluído</option>
                        <option value="0">Cancelado</option>
                    </select>
                </div>
            </div>

            {/* --- SEÇÃO 3: SERVIÇOS (CHECKLIST) --- */}
            <div className={styles.sectionTitle}>Serviços Solicitados</div>
            <div className={styles.servicesContainer} style={{ 
                border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem', 
                maxHeight: '200px', overflowY: 'auto', backgroundColor: isEditable ? '#fff' : '#f9fafb' 
            }}>
                {servicesList.map(service => {
                    const isSelected = formData.services.includes(service.serv_id);
                    return (
                        <label key={service.serv_id} style={{ 
                            display: 'flex', alignItems: 'center', gap: '10px', 
                            padding: '8px', borderBottom: '1px solid #f3f4f6', cursor: isEditable ? 'pointer' : 'default'
                        }}>
                            <input 
                                type="checkbox" 
                                checked={isSelected}
                                onChange={() => handleServiceToggle(service.serv_id)}
                                disabled={!isEditable}
                                style={{ transform: 'scale(1.2)', accentColor: '#2563eb' }}
                            />
                            <div style={{ flex: 1 }}>
                                <span style={{ fontWeight: '600', color: '#374151' }}>{service.serv_nome}</span>
                                <span style={{ float: 'right', color: '#6b7280', fontSize: '0.9rem' }}>
                                    {Number(service.serv_preco).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </span>
                            </div>
                        </label>
                    );
                })}
            </div>

            {/* --- SEÇÃO 4: OBSERVAÇÕES --- */}
            <div className={styles.inputGroup} style={{ marginTop: '1rem' }}>
                <label>Observações</label>
                <textarea 
                    name="agend_observ"
                    className={styles.input} 
                    style={{ height: '80px', paddingTop: '10px' }}
                    value={formData.agend_observ} 
                    onChange={handleChange}
                    disabled={!isEditable}
                    placeholder="Alguma observação especial sobre o serviço..."
                />
            </div>

            {/* --- AÇÕES --- */}
            <div className={styles.actions} style={{ marginTop: '2rem', borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                {mode === 'view' && !isEditable ? (
                    <>
                        <button type="button" onClick={onCancel} className={styles.btnCancel}>
                            <ArrowLeft size={18} /> Voltar
                        </button>
                        {formData.agend_situacao != 0 && (
                            <button type="button" onClick={() => setIsEditable(true)} className={styles.btnSave}>
                                <Edit size={18} /> Editar Agendamento
                            </button>
                        )}
                    </>
                ) : (
                    <>
                         <button type="button" onClick={onCancel} className={styles.btnCancel}>
                            Cancelar Edição
                        </button>
                        <button type="submit" className={styles.btnSave} disabled={loading}>
                            <Save size={18} /> {loading ? "Salvando..." : "Salvar Alterações"}
                        </button>
                    </>
                )}
            </div>
        </form>
    );
}