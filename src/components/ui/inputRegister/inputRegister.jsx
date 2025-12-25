"use client";

import styles from "./inputRegister.module.css";

export function InputRegister({
  label,
  type = "text",
  className,
  children,
  ...props
}) {
  return (
    <div className={styles.container}>
      {label && (
        <label
          htmlFor={props.id || props.name}
          className={styles.label}
        >
          {label}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          type={type}
          className={`${styles.input} ${className || ""}`}
          {...props}
        />

        {/* Elementos adicionais (ex: botão olho) */}
        {children && (
          <div className={styles.rightElement}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
