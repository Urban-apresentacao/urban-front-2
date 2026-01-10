"use client";
import { useState, useEffect } from "react";
import { Edit, UserPlus, History } from "lucide-react";

import { InputRegisterForm } from "../../../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../../../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../../../ui/selectRegister/selectRegister";

import { useCategories } from "@/hooks/useCategories";
import { useBrands } from "@/hooks/useBrands";
import { useModels } from "@/hooks/useModels";

import ModalUserLink from "../../../modals/modalUserLink/modalUserLink";
import { useVehicleUsers } from "@/hooks/useVehicleUsers";

import styles from "../vehicleForm.module.css"; 
import ModalVehicleHistory from "../../../modals/modalVehicleHistory/modalVehicleHistory";

export default function VehicleForm({ onSuccess, onCancel, saveFunction, initialData, mode = 'edit' }) {

  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(mode === 'edit');
  const [errors, setErrors] = useState({});
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const { linkUser, loading: linkLoading } = useVehicleUsers();

  // 1. STATE COM TODOS OS CAMPOS
  const getInitialState = () => {
    const defaults = {
      cat_id: '',
      mar_id: '',
      mod_id: '',
      veic_placa: '',
      veic_ano: '',
      veic_cor: '',
      veic_combustivel: '',
      veic_observacao: '',
      veic_situacao: 'true'
    };

    if (!initialData) return defaults;

    // Se tiver initialData (Edição), preenche
    return {
      cat_id: initialData.cat_id || '',
      mar_id: initialData.mar_id || '',
      mod_id: initialData.mod_id || '',
      veic_placa: initialData.veic_placa || '',
      veic_ano: initialData.veic_ano || '',
      veic_cor: initialData.veic_cor || '',
      veic_combustivel: initialData.veic_combustivel || '',
      veic_observacao: initialData.veic_observ || '',
      veic_situacao: String(initialData.veic_situacao ?? 'true')
    };
  };

  const [formData, setFormData] = useState(getInitialState());

  // Hooks para carregar os selects em cascata
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
      if (name === 'cat_id') { newData.mar_id = ""; newData.mod_id = ""; }
      if (name === 'mar_id') { newData.mod_id = ""; }
      return newData;
    });

    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleMaskChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const currentYear = new Date().getFullYear();
    const maxYear = currentYear + 1;
    const minYear = 1900;

    if (!formData.cat_id) newErrors.cat_id = "Selecione uma categoria";
    if (!formData.mar_id) newErrors.mar_id = "Selecione uma marca";
    if (!formData.mod_id) newErrors.mod_id = "Selecione um modelo";
    if (!formData.veic_placa) newErrors.veic_placa = "Informe a placa";
    if (!formData.veic_ano) newErrors.veic_ano = "Informe o ano";

    if (!formData.veic_ano) {
      newErrors.veic_ano = "Informe o ano";
    } else {
      const anoDigitado = Number(formData.veic_ano);

      if (anoDigitado > maxYear) {
        newErrors.veic_ano = `Máximo permitido: ${maxYear}`;
      } else if (anoDigitado < minYear) {
        newErrors.veic_ano = `Ano inválido`;
      }
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


  const handleLinkUserSave = async (modalData) => {
    const payload = {
      veic_id: initialData.veic_id,
      usu_id: modalData.usu_id,
      ehproprietario: modalData.is_owner,
      data_inicial: modalData.start_date
    };

    const success = await linkUser(payload);

    if (success) {
      console.log("Vínculo criado:", success);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form}>

        {initialData && (
          <div className={styles.inputGroup}>
            <InputRegisterForm label="ID" value={initialData.veic_id} disabled={true} />
          </div>
        )}

        <div className={styles.inputGroup}>
          <SelectRegister
            name="cat_id"
            label="Categoria"
            value={formData.cat_id}
            onChange={handleChange}
            disabled={!isEditable || !!initialData}
            options={categories?.data?.map(cat => ({ value: cat.cat_id, label: cat.cat_nome })) || []}
          />
          <ErrorMessage message={errors.categoryId} />
        </div>

        <div className={styles.inputGroup}>
          <SelectRegister
            name="mar_id"
            label={loadingBrands ? "Carregando..." : "Marca"}
            value={formData.mar_id}
            onChange={handleChange}
            disabled={!isEditable || !!initialData || !formData.cat_id}
            options={loadingBrands ? [{ value: "", label: "Carregando marcas..." }] : toOptions(brands, 'mar_id', 'mar_nome')}
          />
          <ErrorMessage message={errors.mar_id} />
        </div>

        <div className={styles.inputGroup}>
          <SelectRegister
            name="mod_id"
            label={loadingModels ? "Carregando..." : "Modelo"}
            value={formData.mod_id}
            onChange={handleChange}
            disabled={!isEditable || (!formData.mar_id && !initialData)}
            options={toOptions(models, 'mod_id', 'mod_nome')}
          />
          <ErrorMessage message={errors.mod_id} />
        </div>

        <div className={styles.inputGroup}>
          <InputMaskRegister
            name="veic_placa"
            label="Placa"
            mask={[
              { mask: 'aaa-0000' }, // Placa Antiga (ABC-1234)
              { mask: 'aaa-0a00' }  // Placa Mercosul (ABC-1D23)
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
            min="1900"
            max={new Date().getFullYear() + 1}
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

          {/* Botões de Ação Especiais (Vincular/Histórico) */}
          {!!initialData && (
            <div style={{ marginRight: 'auto', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                className={styles.btnLink}
                onClick={() => setShowLinkModal(true)}
              >
                <UserPlus size={16} style={{ marginRight: 5 }} />
                Vincular
              </button>

              <button
                type="button"
                className={styles.btnLink}
                onClick={() => setShowHistoryModal(true)}
                style={{ backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db' }}
              >
                <History size={16} style={{ marginRight: 5 }} />
                Histórico
              </button>
            </div>
          )}

          {/* Botões Padrão (Editar/Salvar/Cancelar) */}
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

      <ModalUserLink
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSave={handleLinkUserSave}
      />

      <ModalVehicleHistory
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        vehicleId={initialData?.veic_id}
      />
    </>
  );
}