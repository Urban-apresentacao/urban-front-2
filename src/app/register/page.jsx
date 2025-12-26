'use client'

import {
  User, CreditCard, Calendar, Phone, Mail, Lock, Eye, EyeOff, FileText, Users,
  ChevronDown, Check, X
} from 'lucide-react'
import styles from './page.module.css'
import InputRegister from '@/components/ui/inputRegister/inputRegister'

import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";
import Swal from "sweetalert2";
import { validateCPF, validateEmail } from "@/utils/validators";

export default function Cadastro() {
  const { handleRegister, loading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    usu_nome: "",
    usu_cpf: "",
    usu_data_nasc: "",
    usu_sexo: "",
    usu_telefone: "",
    usu_email: "",
    usu_acesso: false,
    usu_senha: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- LÓGICA DE FORÇA DA SENHA EM TEMPO REAL ---
  const passwordRules = {
    length: formData.usu_senha.length >= 12,
    capital: /[A-Z]/.test(formData.usu_senha),
    lower: /[a-z]/.test(formData.usu_senha),
    number: /\d/.test(formData.usu_senha),
    special: /[\W_]/.test(formData.usu_senha),
  };

  // Verifica se TODAS as regras são verdadeiras
  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. CPF
    if (!validateCPF(formData.usu_cpf)) {
        Swal.fire({
            title: "CPF Inválido",
            text: "Por favor, verifique os números digitados.",
            icon: "warning",
            confirmButtonColor: "#f59e0b"
        });
        return; 
    }

    // 2. Email
    if (!validateEmail(formData.usu_email)) {
        Swal.fire({
            title: "E-mail Inválido",
            text: "Por favor, insira um endereço válido.",
            icon: "warning",
            confirmButtonColor: "#f59e0b"
        });
        return; 
    }

    // 3. SENHA (Validação simples, pois o usuário já está vendo o checklist)
    if (!isPasswordValid) {
        Swal.fire({
            title: "Senha Incompleta",
            text: "Por favor, atenda a todos os requisitos de senha exibidos na tela.",
            icon: "warning",
            confirmButtonColor: "#f59e0b"
        });
        return; 
    }

    // 4. Tenta Enviar
    try {
      await handleRegister(formData);
    } catch (err) {
      // Hook trata
    }
  };
  
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <span className={styles.logo}>ADM</span>
          <h1>Criar Conta</h1>
          <p>Preencha os dados para se cadastrar</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fullWidth}>
            <InputRegister
              label="Nome Completo"
              icon={User}
              name="usu_nome"
              value={formData.usu_nome}
              onChange={handleChange}
              required
            />
          </div>

          <InputRegister
            label="CPF"
            icon={CreditCard}
            name="usu_cpf"
            value={formData.usu_cpf}
            onChange={handleChange}
            mask="000.000.000-00"
            required
          />

          <InputRegister
            label="Data de Nascimento"
            icon={Calendar}
            type="date"
            name="usu_data_nasc"
            value={formData.usu_data_nasc}
            onChange={handleChange}
          />

          <div className={styles.selectContainer}>
            <Users size={18} className={styles.selectIcon} />
            <select
              name="usu_sexo"
              value={formData.usu_sexo}
              onChange={handleChange}
              required
              className={styles.selectInput}
            >
              <option value="" disabled hidden></option>
              <option value="0">Masculino</option>
              <option value="1">Feminino</option>
            </select>
            <label className={styles.selectLabel}>Sexo</label>
            <ChevronDown size={18} className={styles.selectArrow} />
          </div>

          <InputRegister
            label="Telefone"
            icon={Phone}
            name="usu_telefone"
            value={formData.usu_telefone}
            onChange={handleChange}
            mask="(00) 00000-0000"
          />

          <div className={styles.fullWidth}>
            <InputRegister
              label="Email"
              icon={Mail}
              type="email"
              name="usu_email"
              value={formData.usu_email}
              onChange={handleChange}
              required
            />
          </div>

          {/* --- BLOCO DE SENHA COM FEEDBACK VISUAL --- */}
          <div className={styles.fullWidth}>
            <InputRegister
              label="Senha"
              icon={Lock}
              type={showPassword ? 'text' : 'password'}
              name="usu_senha"
              value={formData.usu_senha}
              onChange={handleChange}
              required
            >
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </InputRegister>

            {/* Renderiza o box apenas se o usuário começou a digitar */}
            {formData.usu_senha.length > 0 && (
              <div className={styles.passwordRequirements}>
                <PasswordRequirement label="Mínimo de 12 caracteres" met={passwordRules.length} />
                <PasswordRequirement label="Pelo menos uma letra maiúscula" met={passwordRules.capital} />
                <PasswordRequirement label="Pelo menos uma letra minúscula" met={passwordRules.lower} />
                <PasswordRequirement label="Pelo menos um número" met={passwordRules.number} />
                <PasswordRequirement label="Pelo menos um caractere especial" met={passwordRules.special} />
              </div>
            )}
          </div>

          {/* <div className={styles.fullWidth}>
            <InputRegister
              label="Observação"
              icon={FileText}
              name="usu_observ"
              value={formData.usu_observ}
              onChange={handleChange}
            />
          </div> */}

          <button className={styles.button} disabled={loading}>
            {loading ? "Salvando..." : "Cadastrar"}
          </button>

          <button
            type="button"
            className={styles.backButton}
            onClick={() => window.history.back()}
          >
            Voltar para Login
          </button>
        </form>

        <footer className={styles.footer}>
          <span>© 2025 • Sistema Administrativo</span>
        </footer>
      </div>
    </div>
  )
}

// --- SUB-COMPONENTE AUXILIAR PARA O ITEM DA LISTA ---
function PasswordRequirement({ label, met }) {
  return (
    <div className={`${styles.reqItem} ${met ? styles.success : styles.pending}`}>
      {met ? <Check className={styles.reqIcon} /> : <X className={styles.reqIcon} />}
      <span>{label}</span>
    </div>
  );
}