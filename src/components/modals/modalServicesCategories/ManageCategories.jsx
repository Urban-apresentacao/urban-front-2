"use client";
import { useState } from "react";
import styles from "./CategoryModal.module.css";
import { X, CheckCircle, XCircle } from "lucide-react";
import { updateServiceCategory } from "@/services/servicesCategories.service";
import Swal from "sweetalert2";

export default function ManageCategoriesModal({ isOpen, onClose, categories, onUpdate }) {
    // Estado para controlar qual ID está carregando (para não clicar 2x)
    const [updatingId, setUpdatingId] = useState(null);

    if (!isOpen) return null;

    const handleToggleStatus = async (category) => {
        setUpdatingId(category.value);
        try {
            // Inverte o status atual
            const newStatus = !category.active;
            
            await updateServiceCategory(category.value, { 
                cat_serv_nome: category.label, // Mantém o nome
                cat_serv_situacao: newStatus   // Muda o status
            });

            // Avisa o pai para recarregar a lista
            onUpdate();
        } catch (error) {
            console.error(error);
            Swal.fire({
                toast: true, position: 'top-end', icon: 'error', 
                title: 'Erro ao alterar status', showConfirmButton: false, timer: 1500
            });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal} style={{ maxWidth: '500px' }}>
                <div className={styles.header}>
                    <h3>Gerenciar Categorias</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>
                
                <div className={styles.body} style={{ maxHeight: '60vh', overflowY: 'auto', padding: '0' }}>
                    {categories.length === 0 ? (
                        <p style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Nenhuma categoria cadastrada.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                            {categories.map((cat) => (
                                <li key={cat.value} style={{ 
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '12px 24px', borderBottom: '1px solid #f3f4f6'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ 
                                            fontSize: '0.9rem', 
                                            color: cat.active ? '#111827' : '#9ca3af',
                                            textDecoration: cat.active ? 'none' : 'line-through'
                                        }}>
                                            {cat.label}
                                        </span>
                                    </div>

                                    {/* Toggle Switch Pequeno */}
                                    <label className={styles.switch} style={{ transform: 'scale(0.8)' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={cat.active} 
                                            onChange={() => handleToggleStatus(cat)}
                                            disabled={updatingId === cat.value}
                                        />
                                        <span className={`${styles.slider} ${updatingId === cat.value ? styles.loading : ''}`}></span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className={styles.footer}>
                    <button type="button" onClick={onClose} className={styles.cancelBtn}>Fechar</button>
                </div>
            </div>
        </div>
    );
}