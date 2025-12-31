"use client";
import { useState, useEffect } from "react";
import { X, Calendar, Save, SquareX, CheckCircle } from "lucide-react";
import Swal from "sweetalert2"; // Importante para os alertas de validação
import styles from "./modalEditLink.module.css";

export default function ModalEditLink({ 
    isOpen, 
    onClose, 
    onSave, 
    type = 'edit', // 'edit' ou 'finalize'
    initialData,   // { date, isOwner, userName }
}) {
    const [dateValue, setDateValue] = useState("");
    const [isOwner, setIsOwner] = useState(false);
    const [saving, setSaving] = useState(false);

    // --- FUNÇÃO AUXILIAR: DATA LOCAL ---
    // Pega a data de hoje baseada no computador do usuário (Brasil), 
    // e não UTC, para evitar bugs de fuso horário à noite.
    const getLocalToday = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        if (isOpen && initialData) {
            if (type === 'edit') {
                // Modo Edição: Carrega a data que já existe
                setDateValue(initialData.date ? initialData.date.split('T')[0] : "");
                setIsOwner(!!initialData.isOwner);
            } else {
                // Modo Finalizar: Sugere a data de hoje como padrão
                setDateValue(getLocalToday());
            }
        }
    }, [isOpen, initialData, type]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // --- VALIDAÇÕES DE DATA NO FRONTEND ---
        
        const todayString = getLocalToday(); // "2023-10-25"
        
        // 1. Validação de Data Futura
        // Comparação de string YYYY-MM-DD funciona perfeitamente
        if (dateValue > todayString) {
            Swal.fire("Data Inválida", "A data não pode ser futura (maior que hoje).", "warning");
            return;
        }

        // 2. Validação Cronológica (Final < Inicial)
        // Só valida se estiver finalizando e se tivermos a data inicial original
        if (type === 'finalize' && initialData?.date) {
            const startDateStr = initialData.date.split('T')[0];
            
            if (dateValue < startDateStr) {
                 Swal.fire(
                    "Data Inválida", 
                    `A data de encerramento não pode ser anterior à data de início (${new Date(startDateStr).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}).`, 
                    "warning"
                );
                return;
            }
        }

        setSaving(true);
        try {
            await onSave({
                date: dateValue,
                isOwner: type === 'edit' ? isOwner : undefined
            });
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    const isEdit = type === 'edit';
    const title = isEdit ? "Corrigir Dados Iniciais" : "Encerrar Vínculo";
    const icon = isEdit ? <Save size={18} /> : <SquareX size={18} />;
    
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                <div className={styles.header}>
                    <h3>{icon} {title}</h3>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.body}>
                    
                    <div className={styles.description}>
                        {isEdit 
                            ? `Editando vínculo de: ${initialData?.userName}`
                            : `Defina a data de término para: ${initialData?.userName}`
                        }
                    </div>

                    <div className={styles.inputGroup}>
                        <label>{isEdit ? "Data de Início" : "Data de Encerramento"}</label>
                        <div className={styles.inputIconWrapper}>
                            <Calendar size={18} className={styles.inputIcon} />
                            <input 
                                type="date" 
                                value={dateValue} 
                                onChange={(e) => setDateValue(e.target.value)} 
                                className={styles.input}
                                required 
                                // Bloqueia dias futuros no calendário visualmente
                                max={getLocalToday()} 
                            />
                        </div>
                    </div>

                    {isEdit && (
                        <label 
                            className={styles.checkboxContainer}
                            style={{ 
                                borderColor: isOwner ? '#2563eb' : '#d1d5db', 
                                backgroundColor: isOwner ? '#eff6ff' : '#fff' 
                            }}
                        >
                            <div className={styles.checkboxContent}>
                                <span className={styles.checkboxTitle}>É o Proprietário?</span>
                                <span className={styles.checkboxDesc}>Responsável legal pelo veículo.</span>
                            </div>
                            <input 
                                type="checkbox" 
                                checked={isOwner} 
                                onChange={(e) => setIsOwner(e.target.checked)}
                                className={styles.realCheckbox}
                            />
                            <div className={styles.checkIndicator}>
                                {isOwner ? <CheckCircle size={20} color="#2563eb" /> : <div className={styles.circleEmpty} />}
                            </div>
                        </label>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className={`${styles.btnSave} ${isEdit ? styles.edit : styles.finalize}`} 
                            disabled={saving}
                        >
                            {saving ? "Salvando..." : (
                                <>
                                    {isEdit ? <Save size={18} /> : <SquareX size={18} />}
                                    {isEdit ? "Salvar Alterações" : "Encerrar Vínculo"}
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}