"use client";
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

import { InputRegisterForm } from "../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../ui/selectRegister/selectRegister";

import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useModels } from "@/hooks/useModels";

import styles from "./vehicleForm.module.css";

export default function VehicleForm({ onSuccess, onCancel, saveFunction, initialData, mode = 'edit' }) {

  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(mode === 'edit');
  const [errors, setErrors] = useState({});

  // 1. STATE COM TODOS OS CAMPOS
  const getInitialState = () => {
    // Valores padrão
    const defaults = {
      categoryId: '',
      brandId: '',
      modelId: '',        
      veic_placa: '',       
      veic_ano: '',         
      veic_cor: '',         
      veic_combustivel: 'FLEX', 
      veic_observacao: '',  
      veic_situacao: 'true' // String para select
    };

    if (!initialData) return defaults;

    // Se tiver initialData (Edição), preenche
    return {
      categoryId: initialData.categoryId || '', // Se o back não mandar isso direto, talvez precise buscar a partir do modelo
      brandId: initialData.brandId || '',
      modelId: initialData.mod_id || initialData.modelId || '',
      veic_placa: initialData.veic_placa || '',
      veic_ano: initialData.veic_ano || '',
      veic_cor: initialData.veic_cor || '',
      veic_combustivel: initialData.veic_combustivel || 'FLEX',
      veic_observacao: initialData.veic_observ || '',
      veic_situacao: String(initialData.veic_situacao ?? 'true')
    };
  };

  const [formData, setFormData] = useState(getInitialState());

  // Hooks para carregar os selects em cascata
  const { categories } = useCategories();
  const { brands, loading: loadingBrands } = useBrands(formData.categoryId);
  const { models, loading: loadingModels } = useModels(formData.categoryId, formData.brandId);

  console.log("Retorno do useModels:", models);

  useEffect(() => {
    setIsEditable(mode === 'edit');
    setErrors({});
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Limpa os filhos se o pai mudar
      if (name === 'categoryId') { newData.brandId = ""; newData.modelId = ""; }
      if (name === 'brandId') { newData.modelId = ""; }
      return newData;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // 👇 FUNÇÃO QUE FALTAVA
  const handleMaskChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.categoryId) newErrors.categoryId = "Selecione uma categoria";
    if (!formData.brandId) newErrors.brandId = "Selecione uma marca";
    if (!formData.modelId) newErrors.modelId = "Selecione um modelo";
    if (!formData.veic_placa) newErrors.veic_placa = "Informe a placa"; // Corrigido nome da chave
    if (!formData.veic_ano) newErrors.veic_ano = "Informe o ano";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Prepara payload para o Backend
      const payload = {
        mod_id: formData.modelId,
        veic_placa: formData.veic_placa,
        veic_ano: Number(formData.veic_ano),
        veic_cor: formData.veic_cor,
        veic_combustivel: formData.veic_combustivel,
        veic_observ: formData.veic_observacao,
        veic_situacao: formData.veic_situacao === 'true'
      };
      
      console.log("Enviando Veículo:", payload);

      const result = await saveFunction(payload);

      if (result && result.success) {
        onSuccess();
      }
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

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <span className={styles.errorText}>{message}</span>;
  };

  const toOptions = (source, idKey, labelKey) => {
    const list = source?.dados || source?.data || source || [];
    if (!Array.isArray(list)) return [];
    return list.map(item => ({ value: item[idKey], label: item[labelKey] }));
  };

  const combustivelOptions = [
    { value: 'GASOLINA', label: 'Gasolina' },
    { value: 'ETANOL', label: 'Etanol' },
    { value: 'DIESEL', label: 'Diesel' },
    { value: 'FLEX', label: 'Flex' },
    { value: 'ELETRICO', label: 'Elétrico' },
    { value: 'HIBRIDO', label: 'Híbrido' },
    { value: 'GNV', label: 'GNV' }
  ];

  const situacaoOptions = [
    { value: 'true', label: 'Ativo' },
    { value: 'false', label: 'Inativo' }
  ];

  const colorsOptions = [
    { value: 'Branco', label: 'Branco' },
    { value: 'Preto', label: 'Preto' },
    { value: 'Prata', label: 'Prata' },
    { value: 'Cinza', label: 'Cinza' },
    { value: 'Vermelho', label: 'Vermelho' },
    { value: 'Azul', label: 'Azul' },
    { value: 'Verde', label: 'Verde' },
    { value: 'Amarelo', label: 'Amarelo' },
    { value: 'Marrom', label: 'Marrom' },
    { value: 'Bege', label: 'Bege' },
    { value: 'Personalizado', label: 'Personalizado' }
  ];

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="categoryId"
          label="Categoria"
          value={formData.categoryId}
          onChange={handleChange}
          disabled={!isEditable}
          options={categories?.data?.map(cat => ({ value: cat.cat_id, label: cat.cat_nome })) || []}
        />
        <ErrorMessage message={errors.categoryId} />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="brandId"
          label={loadingBrands ? "Carregando..." : "Marca"}
          value={formData.brandId}
          onChange={handleChange}
          disabled={!isEditable || !formData.categoryId}
          options={toOptions(brands, 'mar_id', 'mar_nome')}
        />
        <ErrorMessage message={errors.brandId} />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="modelId"
          label={loadingModels ? "Carregando..." : "Modelo"}
          value={formData.modelId}
          onChange={handleChange}
          disabled={!isEditable || !formData.brandId}
          options={toOptions(models, 'mod_id', 'mod_nome')}
        />
        <ErrorMessage message={errors.modelId} />
      </div>

      <div className={styles.inputGroup}>
        <InputMaskRegister
          name="veic_placa"
          label="Placa"
          mask={[
            { mask: 'AAA-0000' }, 
            { mask: 'AAA-0A00' }
          ]}
          prepare={(str) => str.toUpperCase()}
          value={formData.veic_placa}
          onAccept={(value) => handleMaskChange(value, "veic_placa")}
          required
          disabled={!isEditable || (!!initialData && mode !== 'create')}
        />
        <ErrorMessage message={errors.veic_placa} />
      </div>

      <div className={styles.inputGroup}>
        <InputRegisterForm
          name="veic_ano"
          label="Ano"
          type="number"
          value={formData.veic_ano}
          onChange={handleChange}
          disabled={!isEditable}
        />
        <ErrorMessage message={errors.veic_ano} />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="veic_cor"
          label="Cor"
          value={formData.veic_cor}
          onChange={handleChange}
          disabled={!isEditable}
          options={colorsOptions}
        />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="veic_combustivel"
          label="Combustível"
          value={formData.veic_combustivel}
          onChange={handleChange}
          disabled={!isEditable}
          options={combustivelOptions}
        />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="veic_situacao"
          label="Situação"
          value={formData.veic_situacao}
          onChange={handleChange}
          disabled={!isEditable}
          options={situacaoOptions}
        />
      </div>

      <div className={`${styles.inputGroup} ${styles.fullWidth}`} style={{ marginTop: '10px' }}>
        <InputRegisterForm
          name="veic_observacao"
          label="Observação"
          value={formData.veic_observacao}
          onChange={handleChange}
          disabled={!isEditable}
        />
      </div>

      <div className={styles.actions}>
        {!isEditable ? (
          <button type="button" className={styles.btnSave} onClick={() => setIsEditable(true)}>
            <Edit size={16} style={{ marginRight: 5 }} /> Editar Dados
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
  );
}