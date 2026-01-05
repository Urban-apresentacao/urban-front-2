"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, EyeOff, Eye, User, Mail, Phone, Calendar, Car } from "lucide-react";
import { InputRegisterForm } from "@/components/ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "@/components/ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "@/components/ui/selectRegister/selectRegister";
import styles from "../userForm.module.css"; 
import { validateEmail, getBirthDateError } from "@/utils/validators";

export default function UserFormUser({ user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Função para mapear os dados do objeto user para o estado do formulário
  const mapUserDataToForm = (u) => ({
    usu_nome: u?.usu_nome || "",
    usu_cpf: u?.usu_cpf || "",
    usu_data_nasc: u?.usu_data_nasc ? u.usu_data_nasc.split('T')[0] : "",
    usu_sexo: String(u?.usu_sexo ?? "0"),
    usu_email: u?.usu_email || "",
    usu_telefone: u?.usu_telefone || "",
    usu_senha: "", // Senha sempre começa vazia por segurança
  });

  const [formData, setFormData] = useState(mapUserDataToForm(user));

  // Sincroniza o formulário caso os dados do usuário mudem externamente (ex: após o save)
  useEffect(() => {
    if (user) {
      setFormData(mapUserDataToForm(user));
    }
  }, [user]);

  // Regras de validação de senha
  const passwordRules = {
    length: formData.usu_senha.length >= 12,
    capital: /[A-Z]/.test(formData.usu_senha),
    lower: /[a-z]/.test(formData.usu_senha),
    number: /\d/.test(formData.usu_senha),
    special: /[\W_]/.test(formData.usu_senha),
  };
  
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleMaskChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(formData.usu_email)) {
        newErrors.usu_email = "E-mail inválido.";
    }

    if (formData.usu_senha.length > 0 && !isPasswordValid) {
        newErrors.usu_senha = "A senha não atende aos requisitos mínimos.";
    }

    if (formData.usu_data_nasc) {
        const dateError = getBirthDateError(formData.usu_data_nasc);
        if (dateError) newErrors.usu_data_nasc = dateError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const payload = {
      ...formData,
      usu_sexo: Number(formData.usu_sexo),
    };
    
    // Se a senha estiver vazia, removemos do payload para não sobrescrever com vazio
    if (!payload.usu_senha) delete payload.usu_senha;

    try {
      await onUpdate(payload);
      setIsEditable(false);
      setErrors({});
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setFormData(mapUserDataToForm(user)); // Restaura dados originais
    setErrors({});
    setIsEditable(false);
    setShowPassword(false);
  };

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    return <span className={styles.errorText}>{message}</span>;
  };

  const PasswordReqItem = ({ label, met }) => (
    <div className={`${styles.reqItem} ${met ? styles.success : styles.pending}`}>
        {met ? <span style={{color: 'green'}}>✔</span> : <span style={{color: '#ccc'}}>•</span>}
        <span style={{marginLeft: 5, fontSize: '0.85rem'}}>{label}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {user && (
        <div className={styles.inputGroup} >
            <InputRegisterForm label="ID" value={user.usu_id} disabled={true} />
        </div>
      )}

      <div className={styles.inputGroup}>
          <InputRegisterForm 
            name="usu_nome" 
            label="Nome Completo" 
            value={formData.usu_nome} 
            onChange={handleChange} 
            disabled={!isEditable}
            icon={User}
          />
      </div>

      <div className={styles.inputGroup}>
        <InputMaskRegister
            name="usu_cpf"
            label="CPF (Fixo)"
            mask="000.000.000-00"
            value={formData.usu_cpf}
            disabled={true} 
            style={{ backgroundColor: '#f3f4f6', opacity: 0.8 }}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputRegisterForm 
            name="usu_email" 
            label="E-mail" 
            type="email" 
            value={formData.usu_email} 
            onChange={handleChange} 
            disabled={!isEditable}
        />
        <ErrorMessage message={errors.usu_email} />
      </div>

      <div className={styles.inputGroup}>
        <InputMaskRegister
            name="usu_telefone"
            label="Celular / WhatsApp"
            mask="(00) 00000-0000"
            value={formData.usu_telefone}
            onAccept={(value) => handleMaskChange(value, "usu_telefone")}
            disabled={!isEditable}
        />
      </div>

      <div className={styles.inputGroup}>
        <InputRegisterForm 
            name="usu_data_nasc" 
            label="Data de Nascimento" 
            type="date" 
            value={formData.usu_data_nasc} 
            onChange={handleChange} 
            disabled={!isEditable}
        />
        <ErrorMessage message={errors.usu_data_nasc} />
      </div>

      <div className={styles.inputGroup}>
        <SelectRegister
            name="usu_sexo"
            label="Gênero"
            value={formData.usu_sexo}
            onChange={handleChange}
            disabled={!isEditable}
            options={[
              { value: "0", label: "Masculino" },
              { value: "1", label: "Feminino" },
              { value: "2", label: "Outro" }
            ]}
        />
      </div>

      {isEditable && (
          <div className={styles.inputGroup}>
            <div style={{ position: 'relative' }}>
                <InputRegisterForm 
                    name="usu_senha" 
                    label="Nova Senha (deixe em branco para manter)" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.usu_senha} 
                    onChange={handleChange} 
                    disabled={!isEditable}
                />
                <button 
                    type="button" 
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '10px', top: '35px', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            <ErrorMessage message={errors.usu_senha} />

            {formData.usu_senha.length > 0 && !isPasswordValid && (
                <div className={styles.passwordRequirements} style={{ marginTop: '10px' }}>
                    <PasswordReqItem label="Mínimo de 12 caracteres" met={passwordRules.length} />
                    <PasswordReqItem label="Letra Maiúscula" met={passwordRules.capital} />
                    <PasswordReqItem label="Letra Minúscula" met={passwordRules.lower} />
                    <PasswordReqItem label="Número" met={passwordRules.number} />
                    <PasswordReqItem label="Caractere Especial" met={passwordRules.special} />
                </div>
            )}
          </div>
      )}

      <div className={styles.actions} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            {!!user && (
                <div style={{ marginRight: 'auto' }}>
                    <button
                        type="button"
                        className={styles.btnSave}
                        style={{ backgroundColor: '#fff', color: '#2563eb', border: '1px solid #2563eb', display: 'flex', alignItems: 'center' }}
                        onClick={() => {/* Lógica do modal de veículo aqui */}}
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
                    style={{ display: 'flex', alignItems: 'center' }}
                 >
                    <Edit size={16} style={{marginRight: 5}}/> Editar Dados
                 </button>
            ) : (
                 <>
                    <button 
                        type="button" 
                        onClick={handleCancelClick} 
                        className={styles.btnCancel} 
                        disabled={loading}
                    >
                      Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className={styles.btnSave} 
                        disabled={loading}
                    >
                      {loading ? "Salvando..." : "Salvar Alterações"}
                    </button>
                 </>
            )}
      </div>
    </form> 
  );
}