"use client";

import { IMaskInput } from "react-imask";
import styles from "./inputRegister.module.css";

export default function InputRegister({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  mask,
  required = false,
  children,
  ...props
}) {
  const InputComponent = mask ? IMaskInput : "input";

  // Verifica se tem valor para aplicar classe de visibilidade
  const hasValue = value && String(value).length > 0;

  return (
    <div className={styles.field}>
      {Icon && <Icon size={18} className={styles.icon} />}

      <InputComponent
        mask={mask}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" "
        // ADICIONE ESTA CLASSE CONDICIONAL 👇
        className={hasValue ? styles.hasValue : ""}
        {...props}
      />

      <label className={value ? styles.filled : ""}>
        {label}
      </label>

      {children}
    </div>
  );
}