"use client";
import { useState, useEffect } from "react";
import { Edit, Check, X, EyeOff, Eye, Car, Plus, History } from "lucide-react";
import { InputRegisterForm } from "../../../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../../../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../../../ui/selectRegister/selectRegister";
import styles from "../userForm.module.css";
import { validateCPF, validateEmail, getBirthDateError } from "@/utils/validators";
import ModalVehicleLink from "../../../modals/modalVehicleLink/modalVehicleLink";
import { useVehicleUsers } from "@/hooks/useVehicleUsers";

export default function UserFormAdmin({ onSuccess, onCancel, saveFunction, initialData, mode = 'edit' }) {
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(mode === 'edit');
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [showLinkModal, setShowLinkModal] = useState(false);
  const { linkUser } = useVehicleUsers();

  const getInitialState = () => {
    const defaults = {
      usu_nome: "", usu_cpf: "", usu_data_nasc: "", usu_sexo: "0",
      usu_email: "", usu_senha: "", usu_acesso: "false", usu_observ: "", usu_telefone: ""
    };

    if (!initialData) return defaults;

    return {
      usu_nome: initialData.usu_nome || "",
      usu_cpf: initialData.usu_cpf || "",
      usu_data_nasc: initialData.usu_data_nasc ? initialData.usu_data_nasc.split('T')[0] : "",
      usu_sexo: String(initialData.usu_sexo ?? "0"),
      usu_email: initialData.usu_email || "",
      usu_senha: "",
      usu_acesso: String(initialData.usu_acesso ?? "false"),
      usu_observ: initialData.usu_observ || "",
      usu_telefone: initialData.usu_telefone || ""
    };
  };

  const [formData, setFormData] = useState(getInitialState());

  const passwordRules = {
    length: formData.usu_senha.length >= 12,
    capital: /[A-Z]/.test(formData.usu_senha),
    lower: /[a-z]/.test(formData.usu_senha),
    number: /\d/.test(formData.usu_senha),
    special: /[\W_]/.test(formData.usu_senha),
  };
  
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  useEffect(() => {
    setIsEditable(mode === 'edit');
    setErrors({});
  }, [mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleMaskChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  // --- VALIDAÇÃO DO FORMULÁRIO ---
  const validateForm = () => {
    const newErrors = {};

    // 1. Validar CPF
    if (!initialData && !validateCPF(formData.usu_cpf)) {
        newErrors.usu_cpf = "CPF inválido.";
    }

    // 2. Validar Email
    if (!validateEmail(formData.usu_email)) {
        newErrors.usu_email = "E-mail inválido.";
    }

    // 3. Validar Senha
    const isTypingPassword = formData.usu_senha.length > 0;
    const isNewUser = !initialData;

    if (isNewUser || isTypingPassword) {
        if (!isPasswordValid) {
            newErrors.usu_senha = "A senha não atende aos requisitos.";
        }
    }

    // 4. VALIDAÇÃO: DATA DE NASCIMENTO
    if (formData.usu_data_nasc) {
        const dateError = getBirthDateError(formData.usu_data_nasc);
        if (dateError) {
            newErrors.usu_data_nasc = dateError;
        }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLinkVehicleSave = async (modalData) => {
    const payload = {
      usu_id: initialData.usu_id, // Usuário fixo (o que estamos editando)
      veic_id: modalData.veic_id, // Veículo escolhido no modal
      ehproprietario: modalData.is_owner,
      data_inicial: modalData.start_date
    };

    const success = await linkUser(payload);
    if (success) {
      console.log("Veículo vinculado!");
      // Opcional: Recarregar dados se você tiver uma lista de carros no form
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      usu_sexo: Number(formData.usu_sexo),
      usu_acesso: formData.usu_acesso === "true"
    };

    if (initialData && !payload.usu_senha) {
      delete payload.usu_senha;
    }

    try {
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

  const PasswordReqItem = ({ label, met }) => (
    <div className={`${styles.reqItem} ${met ? styles.success : styles.pending}`}>
        {met ? <Check size={12} /> : <X size={12} />}
        <span>{label}</span>
    </div>
  );

  return (
    <>
    <form onSubmit={handleSubmit} className={styles.form}>
      
      {initialData && (
        <div className={styles.inputGroup}>
            <InputRegisterForm label="ID" value={initialData.usu_id} disabled={true} />
        </div>
      )}

      {/* GRUPO 1: Nome */}
      <div className={styles.inputGroup}>
          <InputRegisterForm 
            name="usu_nome" 
            label="Nome Completo" 
            value={formData.usu_nome} 
            onChange={handleChange} 
            required 
            disabled={!isEditable}
          />
          <ErrorMessage message={errors.usu_nome} />
      </div>

      {/* GRUPO 2: CPF */}
      <div className={styles.inputGroup}>
        <InputMaskRegister
            name="usu_cpf"
            label="CPF"
            mask="000.000.000-00"
            value={formData.usu_cpf}
            onAccept={(value) => handleMaskChange(value, "usu_cpf")}
            required
            disabled={!isEditable || !!initialData}
        />
        <ErrorMessage message={errors.usu_cpf} />
      </div>

      {/* GRUPO 3: Data Nascimento */}
      <div className={styles.inputGroup}>
        <InputRegisterForm 
            name="usu_data_nasc" 
            label="Data Nascimento" 
            type="date" 
            value={formData.usu_data_nasc} 
            onChange={handleChange} 
            required 
            disabled={!isEditable}
        />
        <ErrorMessage message={errors.usu_data_nasc} />
      </div>

      {/* GRUPO 4: Sexo */}
      <div className={styles.inputGroup}>
        <SelectRegister
            name="usu_sexo"
            label="Sexo"
            value={formData.usu_sexo}
            onChange={handleChange}
            disabled={!isEditable}
            options={[
            { value: "0", label: "Masculino" },
            { value: "1", label: "Feminino" },
            { value: "2", label: "Outro" }
            ]}
        />
        <ErrorMessage message={errors.usu_sexo} />
      </div>

      {/* GRUPO 5: Email */}
      <div className={styles.inputGroup}>
        <InputRegisterForm 
            name="usu_email" 
            label="E-mail" 
            type="email" 
            value={formData.usu_email} 
            onChange={handleChange} 
            required 
            disabled={!isEditable}
        />
        <ErrorMessage message={errors.usu_email} />
      </div>

      {/* GRUPO 6: Telefone */}
      <div className={styles.inputGroup}>
        <InputMaskRegister
            name="usu_telefone"
            label="Telefone"
            mask="(00) 00000-0000"
            value={formData.usu_telefone}
            onAccept={(value) => handleMaskChange(value, "usu_telefone")}
            disabled={!isEditable}
        />
        <ErrorMessage message={errors.usu_telefone} />
      </div>

      {/* GRUPO 7: Senha */}
      <div className={styles.inputGroup}>
        <div style={{ position: 'relative' }}>
            <InputRegisterForm 
                name="usu_senha" 
                label={initialData ? "Nova Senha (deixe em branco para manter)" : "Senha"} 
                type={showPassword ? "text" : "password"} 
                value={formData.usu_senha} 
                onChange={handleChange} 
                required={!initialData} 
                disabled={!isEditable}
            />
            {isEditable && (
                <button 
                    type="button" 
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            )}
        </div>

        <ErrorMessage message={errors.usu_senha} />

        {/* Feedback visual da senha */}
            {isEditable && formData.usu_senha.length > 0 && !isPasswordValid && (
                <div className={styles.passwordRequirements}>
                    <PasswordReqItem label="Mínimo de 12 caracteres" met={passwordRules.length} />
                    <PasswordReqItem label="Letra Maiúscula" met={passwordRules.capital} />
                    <PasswordReqItem label="Letra Minúscula" met={passwordRules.lower} />
                    <PasswordReqItem label="Número" met={passwordRules.number} />
                    <PasswordReqItem label="Caractere Especial" met={passwordRules.special} />
                </div>
            )}
      </div>

      {/* GRUPO 8: Acesso */}
      <div className={styles.inputGroup}>
        <SelectRegister
            name="usu_acesso"
            label="Tipo de Acesso"
            value={formData.usu_acesso}
            onChange={handleChange}
            disabled={!isEditable}
            options={[
            { value: "false", label: "Usuário Comum" },
            { value: "true", label: "Administrador" }
            ]}
        />
         <ErrorMessage message={errors.usu_acesso} />
      </div>

      {/* GRUPO 9: Observações */}
      <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
          <InputRegisterForm 
            name="usu_observ" 
            label="Observações" 
            value={formData.usu_observ} 
            onChange={handleChange} 
            disabled={!isEditable}
          />
      </div>

      <div className={styles.actions}>
            
            {/* NOVO: BOTÃO DE VINCULAR VEÍCULO (Só aparece se o usuário já existir) */}
            {!!initialData && (
                <div style={{ marginRight: 'auto', width: "100%" }}>
                    <button
                        type="button"
                        className={styles.btnSave}
                        style={{ backgroundColor: '#fff', color: '#eb2525ff', border: '1px solid #eb2525ff', flex: 1 }}
                        onClick={() => setShowLinkModal(true)}
                    >
                        <Car size={16} style={{ marginRight: 5 }} />
                        Adicionar Veículo
                    </button>
                </div>
            )}

            {!isEditable ? (
                 <button 
                    type="button" 
                    className={styles.btnSave} 
                    onClick={() => setIsEditable(true)}
                 >
                    <Edit size={16} style={{marginRight: 5}}/> Editar Dados
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

      {/* MODAL DE VÍNCULO DE VEÍCULO */}
      <ModalVehicleLink
        isOpen={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        onSave={handleLinkVehicleSave}
      />
    </>
  )
}