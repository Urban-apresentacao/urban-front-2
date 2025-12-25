"use client";
import { useState } from "react";
import { InputRegisterForm } from "../ui/inputRegisterForm/inputRegisterForm";
import { InputMaskRegister } from "../ui/inputMaskRegister/inputMaskRegister";
import { SelectRegister } from "../ui/selectRegister/selectRegister";
import styles from "./registerUserForm.module.css";

export default function RegisterUserForm({ onSuccess, onCancel, createUserFunction }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    usu_nome: "",
    usu_cpf: "",
    usu_data_nasc: "",
    usu_sexo: "0",
    usu_email: "",
    usu_senha: "",
    usu_acesso: "false",
    usu_observ: "",
    usu_telefone: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMaskChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Tratamento de dados
    const payload = {
      ...formData,
      usu_sexo: Number(formData.usu_sexo),
      usu_acesso: formData.usu_acesso === "true"
    };

    const result = await createUserFunction(payload);
    setLoading(false);

    if (result.success) {
      onSuccess();
    } else {
      alert("Erro ao cadastrar! Verifique os dados.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* O Grid vai organizar: Item 1 (Esq) | Item 2 (Dir) */}

      <InputRegisterForm name="usu_nome" label="Nome Completo" value={formData.usu_nome} onChange={handleChange} required />

      <InputMaskRegister
        name="usu_cpf"
        label="CPF"
        mask="000.000.000-00"
        value={formData.usu_cpf}
        onAccept={(value) => handleMaskChange(value, "usu_cpf")}
        required
      />

      <InputRegisterForm name="usu_data_nasc" label="Data Nascimento" type="date" value={formData.usu_data_nasc} onChange={handleChange} required />

      <SelectRegister
        name="usu_sexo"
        label="Sexo"
        value={formData.usu_sexo}
        onChange={handleChange}
        options={[
          { value: "0", label: "Masculino" },
          { value: "1", label: "Feminino" },
          { value: "2", label: "Outro" }
        ]}
      />

      <InputRegisterForm name="usu_email" label="E-mail" type="email" value={formData.usu_email} onChange={handleChange} required />

      <InputMaskRegister
        name="usu_telefone"
        label="Telefone"
        mask="(00) 00000-0000"
        value={formData.usu_telefone}
        onAccept={(value) => handleMaskChange(value, "usu_telefone")}
      />

      <InputRegisterForm name="usu_senha" label="Senha" type="password" value={formData.usu_senha} onChange={handleChange} required />

      <SelectRegister
        name="usu_acesso"
        label="Tipo de Acesso"
        value={formData.usu_acesso}
        onChange={handleChange}
        options={[
          { value: "false", label: "Usuário Comum" },
          { value: "true", label: "Administrador" }
        ]}
      />

      {/* Este item ficará na esquerda, e o lado direito ficará vazio (ou você pode adicionar mais um campo futuramente) */}
      <div className={styles.fullWidth}>
          <InputRegisterForm 
            name="usu_observ" 
            label="Observações" 
            value={formData.usu_observ} 
            onChange={handleChange} 
          />
      </div>

      <div className={styles.actions}>
        <button type="button" onClick={onCancel} className={styles.btnCancel} disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className={styles.btnSave} disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </div>
    </form>
  );
}