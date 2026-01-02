"use client";

import { useState, useEffect } from "react";
import { Edit, Save, X, EyeOff, Eye, User, Mail, Phone, Calendar } from "lucide-react";
import { InputRegisterForm } from "@/components/ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "@/components/ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "@/components/ui/selectRegister/selectRegister";
import styles from "./userFormUser.module.css"; // Reutilizando o mesmo CSS
import { validateEmail, getBirthDateError } from "@/utils/validators";

export default function UserFormUser({ user, onUpdate }) {
  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Inicializa com os dados do usuário logado
  const [formData, setFormData] = useState({
    usu_nome: user?.usu_nome || "",
    usu_cpf: user?.usu_cpf || "",
    usu_data_nasc: user?.usu_data_nasc ? user.usu_data_nasc.split('T')[0] : "",
    usu_sexo: String(user?.usu_sexo ?? "0"),
    usu_email: user?.usu_email || "",
    usu_telefone: user?.usu_telefone || "",
    usu_senha: "", // Senha começa vazia
  });

  // Regras de validação de senha (visual)
  const passwordRules = {
    length: formData.usu_senha.length >= 8, // Relaxei um pouco para usuário comum, ou mantenha 12
    capital: /[A-Z]/.test(formData.usu_senha),
    number: /\d/.test(formData.usu_senha),
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

    // Se estiver tentando mudar a senha
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

    // Prepara payload (remove senha se estiver vazia)
    const payload = {
      ...formData,
      usu_sexo: Number(formData.usu_sexo),
    };
    
    if (!payload.usu_senha) delete payload.usu_senha;
    // Removemos CPF do envio se a API não permitir update de CPF, ou enviamos apenas para confirmação

    try {
      await onUpdate(payload);
      setIsEditable(false);
      setFormData(prev => ({ ...prev, usu_senha: "" })); // Limpa campo de senha após salvar
    } catch (error) {
      console.error("Erro ao atualizar perfil", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    setErrors({});
    // Reseta para os dados originais do user
    setFormData({
        usu_nome: user?.usu_nome || "",
        usu_cpf: user?.usu_cpf || "",
        usu_data_nasc: user?.usu_data_nasc ? user.usu_data_nasc.split('T')[0] : "",
        usu_sexo: String(user?.usu_sexo ?? "0"),
        usu_email: user?.usu_email || "",
        usu_telefone: user?.usu_telefone || "",
        usu_senha: "",
    });
  };

  const PasswordReqItem = ({ label, met }) => (
    <div className={`${styles.reqItem} ${met ? styles.success : styles.pending}`}>
        {met ? <span style={{color: 'green'}}>✔</span> : <span style={{color: '#ccc'}}>•</span>}
        <span style={{marginLeft: 5, fontSize: '0.85rem'}}>{label}</span>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      
      {/* CABEÇALHO DO FORMULÁRIO */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', width: '100%' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}>
             <User size={24} /> Meus Dados
          </h2>
          {!isEditable ? (
              <button 
                type="button" 
                className={styles.btnSave} // Reutilizando estilo
                onClick={() => setIsEditable(true)}
              >
                <Edit size={16} style={{marginRight: 5}}/> Editar Perfil
              </button>
          ) : (
            <div style={{ display: 'flex', gap: '10px'}}>
               <button type="button" onClick={handleCancel} className={styles.btnCancel} disabled={loading}>
                 <X size={16} /> Cancelar
               </button>
               <button type="submit" className={styles.btnSave} disabled={loading}>
                 {loading ? "Salvando..." : <><Save size={16} style={{marginRight:5}}/> Salvar</>}
               </button>
            </div>
          )}
      </div>

      {/* --- CAMPOS --- */}

      {/* Nome */}
      <div className={styles.inputGroup}>
          <InputRegisterForm 
            name="usu_nome" 
            label="Nome Completo" 
            value={formData.usu_nome} 
            onChange={handleChange} 
            disabled={!isEditable}
            icon={User} // Se o seu componente suportar ícone
          />
      </div>

      {/* CPF (Sempre Desabilitado para User Comum) */}
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

      {/* Email */}
      <div className={styles.inputGroup}>
        <InputRegisterForm 
            name="usu_email" 
            label="E-mail" 
            type="email" 
            value={formData.usu_email} 
            onChange={handleChange} 
            disabled={!isEditable}
        />
        {errors.usu_email && <span className={styles.errorText}>{errors.usu_email}</span>}
      </div>

      {/* Telefone */}
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

      {/* Data Nascimento */}
      <div className={styles.inputGroup}>
        <InputRegisterForm 
            name="usu_data_nasc" 
            label="Data de Nascimento" 
            type="date" 
            value={formData.usu_data_nasc} 
            onChange={handleChange} 
            disabled={!isEditable}
        />
        {errors.usu_data_nasc && <span className={styles.errorText}>{errors.usu_data_nasc}</span>}
      </div>

      {/* Sexo */}
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

      {/* Senha (Só aparece em modo edição para não poluir) */}
      {isEditable && (
          <div className={`${styles.inputGroup} ${styles.fullWidth}`} style={{ marginTop: '20px', padding: '15px', border: '1px dashed #ccc', borderRadius: '8px' }}>
            <h4 style={{marginBottom: '10px', fontSize: '0.9rem', color: '#666'}}>Alterar Senha</h4>
            
            <div style={{ position: 'relative' }}>
                <InputRegisterForm 
                    name="usu_senha" 
                    label="Nova Senha" 
                    type={showPassword ? "text" : "password"} 
                    value={formData.usu_senha} 
                    onChange={handleChange} 
                    placeholder="Deixe em branco para manter a atual"
                />
                <button 
                    type="button" 
                    className={styles.eyeButton}
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ top: '35px' }} // Ajuste fino dependendo do seu CSS
                >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
            </div>

            {/* Feedback Visual de Senha */}
            {formData.usu_senha.length > 0 && (
                <div style={{ display: 'flex', gap: '15px', marginTop: '10px', flexWrap: 'wrap' }}>
                    <PasswordReqItem label="8+ Caracteres" met={passwordRules.length} />
                    <PasswordReqItem label="Letra Maiúscula" met={passwordRules.capital} />
                    <PasswordReqItem label="Número" met={passwordRules.number} />
                </div>
            )}
             {errors.usu_senha && <span className={styles.errorText}>{errors.usu_senha}</span>}
          </div>
      )}

    </form>
  );
}