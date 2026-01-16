"use client";
import { useState, useEffect } from "react";
import { InputRegisterForm } from "../../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../../ui/selectRegister/selectRegister";
import styles from "../servicesForm2/servicesForm.module.css";

// --- HOOKS ---
import { useServiceCategories } from "@/hooks/useServicesCategories";
import { useCategoriesVehiclesForServices } from "@/hooks/useCategoriesVehiclesForServices";

// --- FUNÇÕES AUXILIARES DE MOEDA ---
const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const maskCurrency = (value) => {
    const onlyDigits = value.replace(/\D/g, "");
    const numberValue = Number(onlyDigits) / 100;
    return formatCurrency(numberValue);
};

const parseCurrency = (value) => {
    if (!value) return 0;
    const cleanString = value.replace(/[R$\s.]/g, "").replace(",", ".");
    return parseFloat(cleanString);
};

export default function ServiceForm({ onSuccess, onCancel, saveFunction, initialData, mode = 'edit' }) {
    const [loading, setLoading] = useState(false);
    
    // 1. USO DO SEU HOOK EXISTENTE (Já retorna formattedOptions com value/label)
    // Renomeei para 'serviceOptions' para ficar claro que já são opções prontas
    const { categories: serviceOptions, loading: loadingCategories } = useServiceCategories();

    // 2. Hook para Categorias de Veículo (Checkboxes)
    const { vehicleCategories, loading: loadingVehicles } = useCategoriesVehiclesForServices();

    const [formData, setFormData] = useState({
        category_id: "",
        serv_nome: "",
        serv_descricao: "",
    });

    const [vehicleConfig, setVehicleConfig] = useState({});

    // Inicializa a configuração de preços quando as categorias de VEÍCULOS carregarem
    useEffect(() => {
        if (vehicleCategories && vehicleCategories.length > 0) {
            const initialConfig = {};
            
            vehicleCategories.forEach((cat) => {
                // Ajuste se necessário (tps_id ou id)
                const uniqueId = cat.tps_id || cat.id; 

                initialConfig[uniqueId] = vehicleConfig[uniqueId] || {
                    checked: false,
                    price: "",
                    duration: ""
                };
            });
            
            setVehicleConfig(prev => ({ ...prev, ...initialConfig }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vehicleCategories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // --- HANDLERS PARA A TABELA DE VEÍCULOS ---
    const handleCheckVehicle = (catVehId) => {
        setVehicleConfig(prev => {
            const currentConfig = prev[catVehId] || { checked: false, price: "", duration: "" };
            return {
                ...prev,
                [catVehId]: {
                    ...currentConfig,
                    checked: !currentConfig.checked
                }
            };
        });
    };

    const handleVehiclePriceChange = (e, catVehId) => {
        const rawValue = e.target.value;
        const formatted = maskCurrency(rawValue);
        setVehicleConfig(prev => ({
            ...prev,
            [catVehId]: { ...prev[catVehId], price: formatted }
        }));
    };

    const handleVehicleDurationChange = (value, catVehId) => {
        setVehicleConfig(prev => ({
            ...prev,
            [catVehId]: { ...prev[catVehId], duration: value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const selectedVehicles = Object.entries(vehicleConfig)
            .filter(([_, config]) => config.checked)
            .map(([catVehId, config]) => {
                return {
                    cat_veic_id: Number(catVehId),
                    preco: parseCurrency(config.price),
                    duracao: config.duration
                };
            });

        if (selectedVehicles.length === 0) {
            alert("Selecione pelo menos um tipo de veículo e configure o preço.");
            setLoading(false);
            return;
        }

        const payload = {
            serv_nome: formData.serv_nome,
            serv_descricao: formData.serv_descricao,
            cat_serv_id: formData.category_id,
            prices: selectedVehicles
        };

        try {
            const result = await saveFunction(payload);
            if (result && result.success) onSuccess();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.sectionTitle}>Cadastrar Serviço</div>

            <div className={styles.inputGroup}>
                {/* CORREÇÃO AQUI: 
                    Usamos 'serviceOptions' direto. 
                    Seu hook já retorna [{value: '1', label: 'Nome'}, ...].
                    Não precisamos fazer .map() aqui novamente.
                */}
                <SelectRegister
                    name="category_id"
                    label="Categoria do Serviço"
                    value={formData.category_id}
                    onChange={handleChange}
                    disabled={loadingCategories}
                    options={serviceOptions} 
                    placeholder={loadingCategories ? "Carregando..." : "Selecione uma categoria"}
                />
            </div>

            <div className={styles.inputGroup}>
                <InputRegisterForm
                    name="serv_nome"
                    label="Nome do Serviço"
                    placeholder="Ex: Lavagem Completa"
                    value={formData.serv_nome}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <InputRegisterForm
                    name="serv_descricao"
                    label="Descrição"
                    placeholder="Descrição detalhada do serviço..."
                    value={formData.serv_descricao}
                    onChange={handleChange}
                    textarea
                />
            </div>

            {/* Configuração por Tipo de Veículo */}
            <div className={styles.sectionTitle} style={{ marginTop: '20px' }}>
                Configuração por Tipo de Veículo
            </div>

            {loadingVehicles ? (
                <p>Carregando categorias de veículos...</p>
            ) : (
                <div className={styles.vehicleList}>
                    {vehicleCategories.map((item) => {
                        const catVehId = item.tps_id || item.id; 
                        const catVehName = item.tps_nome || item.nome || "Veículo"; 
                        const config = vehicleConfig[catVehId] || { checked: false, price: "", duration: "" };

                        return (
                            <div key={catVehId} className={styles.vehicleRow}>
                                <div className={styles.vehicleCheck}>
                                    <input
                                        type="checkbox"
                                        id={`veh-${catVehId}`}
                                        checked={!!config.checked}
                                        onChange={() => handleCheckVehicle(catVehId)}
                                    />
                                    <label htmlFor={`veh-${catVehId}`}>
                                        {catVehName}
                                    </label>
                                </div>

                                <div className={styles.vehicleInputs}>
                                    <div style={{ flex: 1 }}>
                                        <InputRegisterForm
                                            name={`price-${catVehId}`}
                                            placeholder="Preço (R$)"
                                            value={config.price || ""}
                                            onChange={(e) => handleVehiclePriceChange(e, catVehId)}
                                            disabled={!config.checked}
                                            small
                                        />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <InputMaskRegister
                                            name={`duration-${catVehId}`}
                                            placeholder="Duração"
                                            mask="00:00"
                                            value={config.duration || ""}
                                            onAccept={(val) => handleVehicleDurationChange(val, catVehId)}
                                            disabled={!config.checked}
                                            small
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div className={styles.actions}>
                <button type="button" onClick={onCancel} className={styles.btnCancel}>
                    Cancelar
                </button>
                <button type="submit" className={styles.btnSave} disabled={loading}>
                    {loading ? "Salvando..." : "Salvar Serviço"}
                </button>
            </div>
        </form>
    );
}