"use client";

import styles from "./inputRegisterForm.module.css";

export function InputRegisterForm({
  label,
  type = "text",
  className,
  children,
  textarea, // 1. Desestruturamos aqui para NÃO passar para o HTML se for falso
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
        {/* 2. Lógica Condicional: Se for textarea, renderiza a tag apropriada */}
        {textarea ? (
          <textarea
            className={`${styles.input} ${className || ""}`}
            style={{ 
                minHeight: "100px", 
                paddingTop: "10px", 
                resize: "vertical",
                fontFamily: "inherit" 
            }}
            {...props}
          />
        ) : (
          <input
            type={type}
            className={`${styles.input} ${className || ""}`}
            {...props}
          />
        )}

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