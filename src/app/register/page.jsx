'use client'

import {
  User, CreditCard, Calendar, Phone, Mail, Lock, Eye, EyeOff, FileText, Users,
  ChevronDown
} from 'lucide-react'
import styles from './page.module.css'
import InputRegister from '@/components/ui/inputRegister/inputRegister'

import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";

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
    usu_observ: "",
    usu_senha: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await handleRegister(formData);
    } catch (err) {
      // Erro tratado
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

          {/* NOME (Ocupa largura total) */}
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

          {/* CPF (1 Coluna) */}
          <InputRegister
            label="CPF"
            icon={CreditCard}
            name="usu_cpf"
            value={formData.usu_cpf}
            onChange={handleChange}
            mask="000.000.000-00"
            required
          />

          {/* DATA NASCIMENTO (Corrigido pelo CSS) */}
          <InputRegister
            label="Data de Nascimento"
            icon={Calendar}
            type="date"
            name="usu_data_nasc"
            value={formData.usu_data_nasc}
            onChange={handleChange}
          />

          {/* SEXO (Corrigido com CSS e novo ícone) */}
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
            
            {/* <--- 2. ADICIONE O ÍCONE DA SETA AQUI */}
            <ChevronDown size={18} className={styles.selectArrow} />
          </div>

          {/* TELEFONE (1 Coluna) */}
          <InputRegister
            label="Telefone"
            icon={Phone}
            name="usu_telefone"
            value={formData.usu_telefone}
            onChange={handleChange}
            mask="(00) 00000-0000"
          />

          {/* EMAIL (Largura total) */}
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

          {/* SENHA (Largura total) */}
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
          </div>

          {/* OBSERVAÇÃO (Largura total) */}
          <div className={styles.fullWidth}>
            <InputRegister
              label="Observação"
              icon={FileText}
              name="usu_observ"
              value={formData.usu_observ}
              onChange={handleChange}
            />
          </div>

          {/* BOTÕES */}
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