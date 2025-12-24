"use client";

import styles from "./inputLogin.module.css";

export default function InputLogin({
  label,
  icon: Icon,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  children, // Para o botão do olho
  ...props
}) {
  return (
    <div className={styles.field}>
      {Icon && <Icon size={18} className={styles.icon} />}

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder=" " /* Truque para o floating label */
        {...props}
      />

      <label className={value ? styles.filled : ""}>
        {label}
      </label>

      {children}
    </div>
  );
}