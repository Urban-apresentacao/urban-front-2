"use client";
import { useState, useEffect } from "react";
import styles from "./CategoryModal.module.css";
import { X } from "lucide-react";
import { createServiceCategory, updateServiceCategory } from "@/services/servicesCategories.service";
import Swal from "sweetalert2";

export default function CategoryModal({ isOpen, onClose, onSuccess, categoryToEdit = null }) {
    const [name, setName] = useState("");
    // Começa true por padrão, mas será sobrescrito pelo useEffect
    const [isActive, setIsActive] = useState(true); 
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                setName(categoryToEdit.label);
        
                // Verificamos explicitamente se 'active' existe no objeto.
                // Se o banco retornou false, ele entra aqui corretamente.
                if (categoryToEdit.active !== undefined) {
                    setIsActive(categoryToEdit.active);
                } else {
                    setIsActive(true); // Fallback de segurança
                }
            } else {
                // Modo CRIAÇÃO
                setName("");
                setIsActive(true); // Nova categoria nasce ativa
            }
        }
    }, [isOpen, categoryToEdit]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            if (categoryToEdit) {
                // EDITAR: Envia nome E situação
                await updateServiceCategory(categoryToEdit.value, { 
                    cat_serv_nome: name,
                    cat_serv_situacao: isActive 
                });
                
                Swal.fire({
                    icon: 'success', title: 'Atualizado!', text: 'Categoria alterada com sucesso.',
                    timer: 1500, showConfirmButton: false
                });
            } else {
                // CRIAR: Envia nome (e situação default true se quiser, ou deixa banco decidir)
                await createServiceCategory({ 
                    cat_serv_nome: name,
                    cat_serv_situacao: true 
                });
                
                Swal.fire({
                    icon: 'success', title: 'Criado!', text: 'Nova categoria adicionada.',
                    timer: 1500, showConfirmButton: false
                });
            }
            onSuccess(); 
            onClose();
        } catch (error) {
            console.error(error);
            Swal.fire('Erro', 'Falha ao salvar categoria.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>{categoryToEdit ? "Editar Categoria" : "Nova Categoria"}</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.body}>
                        {/* Campo Nome */}
                        <div className={styles.fieldGroup}>
                            <label>Nome da Categoria</label>
                            <input 
                                type="text" 
                                className={styles.input} 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Manutenção..."
                                autoFocus
                            />
                        </div>

                        {/* Campo Toggle (Só mostra ao editar, ou sempre se quiser) */}
                        {categoryToEdit && (
                            <div className={styles.fieldGroup}>
                                <label>Situação</label>
                                <div className={styles.toggleWrapper}>
                                    <label className={styles.switch}>
                                        <input 
                                            type="checkbox" 
                                            checked={isActive} 
                                            onChange={(e) => setIsActive(e.target.checked)} 
                                        />
                                        <span className={styles.slider}></span>
                                    </label>
                                    <span className={styles.statusLabel}>
                                        {isActive ? "Ativo" : "Inativo"}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <div className={styles.footer}>
                        <button type="button" onClick={onClose} className={styles.cancelBtn}>Cancelar</button>
                        <button type="submit" className={styles.saveBtn} disabled={loading}>
                            {loading ? "Salvando..." : "Salvar"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}