"use client";
import { useState, useEffect } from "react";
import { Edit, Plus, Settings, List } from "lucide-react";
import { InputRegisterForm } from "../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../ui/selectRegister/selectRegister";
import styles from "../userForm/userForm.module.css";
import ManageCategoriesModal from "../modals/modalServicesCategories/ManageCategories";

import { useServiceCategories } from "@/hooks/useServicesCategories";
import CategoryModal from "../modals/modalServicesCategories/CategoryModal";

// --- FUNÇÕES AUXILIARES DE MOEDA ---

// 1. Converte Número do Banco (100.00) para String Visual (R$ 100,00)
const formatCurrency = (value) => {
    if (!value) return "";
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
};

// 2. Lógica de Digitação: Pega apenas números e formata
const maskCurrency = (value) => {
    const onlyDigits = value.replace(/\D/g, "");
    const numberValue = Number(onlyDigits) / 100;
    return formatCurrency(numberValue);
};

// 3. Converte String Visual (R$ 1.200,50) para Float do Banco (1200.50)
const parseCurrency = (value) => {
    if (!value) return 0;
    const cleanString = value.replace(/[R$\s.]/g, "").replace(",", ".");
    return parseFloat(cleanString);
};

export default function ServiceForm({ onSuccess, onCancel, saveFunction, initialData, mode = 'edit' }) {
    const [loading, setLoading] = useState(false);
    const [isEditable, setIsEditable] = useState(mode === 'edit');
    const [errors, setErrors] = useState({});

    // Estados para controlar o Modal de Categorias
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    // Hook de categorias (pegando lista e função de recarregar)
    const { categories, loading: loadingCategories, refetch } = useServiceCategories();

    const getInitialState = () => {
        const defaults = {
            cat_serv_id: "",
            serv_nome: "",
            serv_duracao: "",
            serv_preco: "",
            serv_descricao: "",
            serv_situacao: "true"
        };

        if (!initialData) return defaults;

        return {
            cat_serv_id: String(initialData.cat_serv_id || ""),
            serv_nome: initialData.serv_nome || "",
            serv_duracao: initialData.serv_duracao || "",
            serv_preco: initialData.serv_preco ? formatCurrency(initialData.serv_preco) : "",
            serv_descricao: initialData.serv_descricao || "",
            serv_situacao: String(initialData.serv_situacao ?? "true")
        };
    };

    const [formData, setFormData] = useState(getInitialState());

    useEffect(() => {
        setIsEditable(mode === 'edit');
        setErrors({});
    }, [mode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    // Handler de Preço
    const handlePriceChange = (e) => {
        const rawValue = e.target.value;
        const formatted = maskCurrency(rawValue);
        setFormData((prev) => ({ ...prev, serv_preco: formatted }));
        if (errors.serv_preco) setErrors(prev => ({ ...prev, serv_preco: null }));
    };

    // Handler de Máscara (Duração)
    const handleMaskChange = (value, name) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    // --- LÓGICA DO MODAL ---

    const handleNewCategory = () => {
        setCategoryToEdit(null); // Modo criação
        setIsModalOpen(true);
    };

    const handleEditCategory = () => {
        const catId = formData.cat_serv_id;
        if (!catId) return;

        // Acha o objeto { value, label, active } correspondente ao ID selecionado
        // Buscamos na lista completa 'categories', e não na filtrada, para garantir que ache mesmo se inativo
        const catObj = categories.find(c => c.value === String(catId));

        if (catObj) {
            setCategoryToEdit(catObj); // Modo edição com status correto
            setIsModalOpen(true);
        }
    };

    const handleModalSuccess = () => {
        // Recarrega o select de categorias após salvar no modal
        refetch();
    };

    const [isListModalOpen, setIsListModalOpen] = useState(false);

    // --- VALIDAÇÃO ---
    const validateForm = () => {
        const newErrors = {};
        if (!formData.serv_nome) newErrors.serv_nome = "Nome é obrigatório.";

        if (!formData.serv_preco || formData.serv_preco === "R$ 0,00") {
            newErrors.serv_preco = "Preço é obrigatório.";
        }

        if (!formData.cat_serv_id) newErrors.cat_serv_id = "Selecione uma categoria.";

        if (!formData.serv_duracao || formData.serv_duracao.includes("_") || formData.serv_duracao.length < 8) {
            newErrors.serv_duracao = "Informe a duração completa (HH:MM:SS).";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        const payload = {
            cat_serv_id: Number(formData.cat_serv_id),
            serv_nome: formData.serv_nome,
            serv_duracao: formData.serv_duracao,
            serv_preco: parseCurrency(formData.serv_preco),
            serv_descricao: formData.serv_descricao,
            serv_situacao: formData.serv_situacao === "true"
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

    const handleCancelClick = () => {
        if (mode === 'view' && isEditable) {
            setIsEditable(false);
            setFormData(getInitialState());
            setErrors({});
        } else {
            onCancel();
        }
    };

    // --- FILTRO DE CATEGORIAS ---
    // Filtra categorias inativas, a menos que seja a categoria atualmente selecionada neste serviço
    const filteredCategories = categories.filter(cat => {
        if (cat.active === true) return true; // Se ativa, mostra
        if (String(cat.value) === String(formData.cat_serv_id)) return true; // Se selecionada (mesmo inativa), mostra
        return false; // Senão, esconde
    });

    const ErrorMessage = ({ message }) => message ? <span className={styles.errorText}>{message}</span> : null;

    return (
        <>
            <form onSubmit={handleSubmit} className={styles.form}>

                {initialData && (
                    <div className={styles.inputGroup} style={{ maxWidth: '100px' }}>
                        <InputRegisterForm label="ID" value={initialData.serv_id} disabled={true} />
                    </div>
                )}

                {/* GRUPO 1: Categoria + Botões de Ação */}
                <div className={styles.inputGroup}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                        <div style={{ flex: 1 }}>
                            <SelectRegister
                                name="cat_serv_id"
                                label={loadingCategories ? "Carregando..." : "Categoria do Serviço"}
                                value={formData.cat_serv_id}
                                onChange={handleChange}
                                disabled={!isEditable || loadingCategories}
                                // Usamos a lista filtrada aqui
                                options={filteredCategories}
                                required
                            />
                        </div>

                        {isEditable && (
                            <div className={styles.categoryActions}>
                                <button
                                    type="button"
                                    className={`${styles.btnIcon} ${styles.btnAddCat}`}
                                    onClick={handleNewCategory}
                                    title="Nova Categoria"
                                >
                                    <Plus size={20} />
                                </button>
                                <button
                                    type="button"
                                    className={styles.btnIcon}
                                    style={{ backgroundColor: '#8b5cf6', color: 'white' }}
                                    onClick={() => setIsListModalOpen(true)}
                                    title="Ver todas as categorias (Gerenciar)"
                                >
                                    <List size={20} />
                                </button>
                                <button
                                    type="button"
                                    className={`${styles.btnIcon} ${styles.btnEditCat}`}
                                    onClick={handleEditCategory}
                                    title="Editar Categoria Selecionada"
                                    disabled={!formData.cat_serv_id}
                                >
                                    <Settings size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                    <ErrorMessage message={errors.cat_serv_id} />
                </div>

                {/* GRUPO 2: Nome */}
                <div className={styles.inputGroup}>
                    <InputRegisterForm
                        name="serv_nome"
                        label="Nome do Serviço"
                        value={formData.serv_nome}
                        onChange={handleChange}
                        required
                        disabled={!isEditable}
                    />
                    <ErrorMessage message={errors.serv_nome} />
                </div>

                {/* GRUPO 3: Preço e Duração */}
                <div className={styles.inputGroup}>
                    <InputRegisterForm
                        name="serv_preco"
                        label="Preço"
                        placeholder="R$ 0,00"
                        type="text"
                        value={formData.serv_preco}
                        onChange={handlePriceChange}
                        required
                        disabled={!isEditable}
                    />
                    <ErrorMessage message={errors.serv_preco} />
                </div>

                <div className={styles.inputGroup}>
                    <InputMaskRegister
                        name="serv_duracao"
                        label="Duração (HH:MM:SS)"
                        mask="00:00:00"
                        lazy={false} // Mostra o __:__:__
                        value={formData.serv_duracao}
                        onAccept={(value) => handleMaskChange(value, "serv_duracao")}
                        disabled={!isEditable}
                        required
                    />
                    <ErrorMessage message={errors.serv_duracao} />
                </div>

                {/* GRUPO 4: Situação */}
                <div className={styles.inputGroup}>
                    <SelectRegister
                        name="serv_situacao"
                        label="Situação"
                        value={formData.serv_situacao}
                        onChange={handleChange}
                        disabled={!isEditable}
                        options={[
                            { value: "true", label: "Ativo" },
                            { value: "false", label: "Inativo" }
                        ]}
                    />
                </div>

                {/* GRUPO 5: Descrição */}
                <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <InputRegisterForm
                        name="serv_descricao"
                        label="Descrição Detalhada"
                        value={formData.serv_descricao}
                        onChange={handleChange}
                        disabled={!isEditable}
                    />
                </div>

                {/* AÇÕES */}
                <div className={styles.actions}>
                    {!isEditable ? (
                        <button type="button" className={styles.btnSave} onClick={() => setIsEditable(true)}>
                            <Edit size={16} style={{ marginRight: 5 }} /> Editar
                        </button>
                    ) : (
                        <>
                            <button type="button" onClick={handleCancelClick} className={styles.btnCancel} disabled={loading}>
                                Cancelar
                            </button>
                            <button type="submit" className={styles.btnSave} disabled={loading}>
                                {loading ? "Salvando..." : "Salvar"}
                            </button>
                        </>
                    )}
                </div>
            </form>

            {/* MODAL DE CATEGORIAS (Fica fora do form) */}
            <CategoryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                categoryToEdit={categoryToEdit}
            />
            <ManageCategoriesModal
                isOpen={isListModalOpen}
                onClose={() => setIsListModalOpen(false)}
                categories={categories}
                onUpdate={refetch}      
            />
        </>
    )
}