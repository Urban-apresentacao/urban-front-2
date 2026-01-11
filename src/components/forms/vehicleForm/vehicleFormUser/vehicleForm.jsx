"use client";

import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

// Imports dos seus componentes de UI (ajuste os caminhos conforme sua pasta)
import { InputRegisterForm } from "@/components/ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "@/components/ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "@/components/ui/selectRegister/selectRegister";

// Hooks
import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useModels } from "@/hooks/useModels";

// CSS (Copie o css do admin e renomeie para vehicleFormUser.module.css ou use o mesmo)
import styles from "../vehicleForm.module.css";

export default function VehicleFormUser({
  onSuccess,
  onCancel,
  saveFunction,
  initialData,
  mode = 'edit'
}) {

  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(mode === 'edit');
  const [errors, setErrors] = useState({});

  // STATE INICIAL (Simplificado para o User)
  const getInitialState = () => {
    const defaults = {
      cat_id: '', mar_id: '', mod_id: '', veic_placa: '',
      veic_ano: '', veic_cor: '', veic_combustivel: '',
      veic_observacao: ''
      // Removemos veic_situacao daqui, pois o user não edita isso no form
    };

    if (!initialData) return defaults;

    return {
      cat_id: initialData.cat_id || '',
      mar_id: initialData.mar_id || '',
      mod_id: initialData.mod_id || '',
      veic_placa: initialData.veic_placa || '',
      veic_ano: initialData.veic_ano || '',
      veic_cor: initialData.veic_cor || '',
      veic_combustivel: initialData.veic_combustivel || '',
      veic_observacao: initialData.veic_observ || ''
    };
  };

  const [formData, setFormData] = useState(getInitialState());

  // HOOKS DE CARREGAMENTO (Cascata)
  const { categories } = useCategories();
  const { brands, loading: loadingBrands } = useBrands(formData.cat_id);
  const { models, loading: loadingModels } = useModels(formData.cat_id, formData.mar_id);

  useEffect(() => {
    setIsEditable(mode === 'edit');
    setErrors({});
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Limpa filhos ao mudar pai
      if (name === 'cat_id') { newData.mar_id = ""; newData.mod_id = ""; }
      if (name === 'mar_id') { newData.mod_id = ""; }
      return newData;
    });
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleMaskChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  // VALIDAÇÃO
  const validateForm = () => {
    const newErrors = {};
    const currentYear = new Date().getFullYear();

    if (!formData.cat_id) newErrors.cat_id = "Selecione uma categoria";
    if (!formData.mar_id) newErrors.mar_id = "Selecione uma marca";
    if (!formData.mod_id) newErrors.mod_id = "Selecione um modelo";
    if (!formData.veic_placa) newErrors.veic_placa = "Informe a placa";

    if (!formData.veic_ano) {
      newErrors.veic_ano = "Informe o ano";
    } else {
      const anoDigitado = Number(formData.veic_ano);
      if (anoDigitado > currentYear + 1) newErrors.veic_ano = "Ano inválido";
      if (anoDigitado < 1900) newErrors.veic_ano = "Ano inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        mod_id: formData.mod_id,
        veic_placa: formData.veic_placa,
        veic_ano: Number(formData.veic_ano),
        veic_cor: formData.veic_cor,
        veic_combustivel: formData.veic_combustivel,
        veic_observ: formData.veic_observacao,
        // Mantemos a situação original do veículo (para não reativar um carro excluído sem querer)
        // Ou enviamos undefined se o backend não exigir no update
        veic_situacao: initialData ? initialData.veic_situacao : true
      };

      const result = await saveFunction(payload);
      if (result && result.success) onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helpers de Options
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

  const ErrorMessage = ({ message }) => message ? <span className={styles.errorText}>{message}</span> : null;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {/* NOTA: Removi o campo de ID visível. O usuário não precisa ver ID de banco de dados. 
      */}

      {/* --- CAMPOS DO VEÍCULO --- */}
      <div className={styles.inputGroup}>
        <SelectRegister
          name="cat_id" label="Categoria" value={formData.cat_id} onChange={handleChange}
          disabled={!isEditable || !!initialData} // Geralmente não deixamos mudar categoria depois de criado, mas se quiser pode liberar
          options={categories?.data?.map(cat => ({ value: cat.cat_id, label: cat.cat_nome })) || []}
        />
        <ErrorMessage message={errors.cat_id} />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="mar_id" label={loadingBrands ? "Carregando..." : "Marca"}
          value={formData.mar_id} onChange={handleChange}
          disabled={!isEditable || !!initialData || !formData.cat_id}
          options={loadingBrands ? [{ value: "", label: "Carregando..." }] : toOptions(brands, 'mar_id', 'mar_nome')}
        />
        <ErrorMessage message={errors.mar_id} />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="mod_id" label={loadingModels ? "Carregando..." : "Modelo"}
          value={formData.mod_id} onChange={handleChange}
          disabled={!isEditable || (!formData.mar_id && !initialData)}
          options={toOptions(models, 'mod_id', 'mod_nome')}
        />
        <ErrorMessage message={errors.mod_id} />
      </div>

      <div className={styles.inputGroup}>
        <InputMaskRegister
          name="veic_placa" label="Placa"
          mask={[{ mask: 'aaa-0000' }, { mask: 'aaa-0a00' }]}
          prepare={(str) => str.toUpperCase()}
          value={formData.veic_placa} onAccept={(value) => handleMaskChange(value, "veic_placa")}
          required disabled={!isEditable || (!!initialData && mode !== 'create')}
        />
        <ErrorMessage message={errors.veic_placa} />
      </div>

      <div className={styles.inputGroup}>
        <InputRegisterForm
          name="veic_ano" label="Ano" type="number"
          value={formData.veic_ano} onChange={handleChange} disabled={!isEditable}
          min="1900" max={new Date().getFullYear() + 1}
        />
        <ErrorMessage message={errors.veic_ano} />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="veic_cor" label="Cor" value={formData.veic_cor} onChange={handleChange}
          disabled={!isEditable} options={colorsOptions}
        />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
          name="veic_combustivel" label="Combustível" value={formData.veic_combustivel} onChange={handleChange}
          disabled={!isEditable} options={combustivelOptions}
        />
      </div>

      <div className={`${styles.inputGroup} ${styles.fullWidth}`} style={{ marginTop: '10px' }}>
        <InputRegisterForm
          name="veic_observacao" label="Observação (Opcional)" value={formData.veic_observacao}
          onChange={handleChange} disabled={!isEditable}
        />
      </div>

      {/* --- BOTÕES DE AÇÃO (SIMPLIFICADOS) --- */}
      <div className={styles.actions}>
        {!isEditable ? (
          <button type="button" className={styles.btnSave} onClick={() => setIsEditable(true)}>
            <Edit size={16} style={{ marginRight: 5 }} /> Editar Veículo
          </button>
        ) : (
          <>
            <button type="button" onClick={onCancel} className={styles.btnCancel} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className={styles.btnSave} disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>
          </>
        )}
      </div>
    </form>
  );
}