"use client";
import { useState, useEffect } from "react";
import { X, Save, Search, Calendar, CheckCircle, User } from "lucide-react";
import { getAllUsers } from "@/services/users.service";

import styles from "./modalUserLink.module.css";

export default function ModalUserLink({ isOpen, onClose, onSave }) {
    const [users, setUsers] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);
    
    // Novo State para a busca
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        usu_id: "",
        is_owner: true,
        start_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
            setFormData({
                usu_id: "",
                is_owner: true,
                start_date: new Date().toISOString().split('T')[0]
            });
            setSearchTerm(""); // Limpa a busca ao abrir
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoadingList(true);
        try {
            const response = await getAllUsers();
            // Lógica de proteção que criamos antes
            let lista = [];
            if (Array.isArray(response)) lista = response;
            else if (response?.data && Array.isArray(response.data)) lista = response.data;
            else if (response?.dados && Array.isArray(response.dados)) lista = response.dados;
            
            setUsers(lista);
        } catch (error) {
            console.error("Erro ao buscar usuários", error);
            setUsers([]);
        } finally {
            setLoadingList(false);
        }
    };

    // Filtra os usuários baseado no termo de busca (Nome ou CPF/Documento se tiver)
    const filteredUsers = users.filter(user => 
        user.usu_nome.toLowerCase().includes(searchTerm.toLowerCase())
        // || user.usu_cpf.includes(searchTerm) // Descomente se quiser buscar por CPF também
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    // Função para selecionar usuário clicando na linha da tabela
    const handleSelectUser = (userId) => {
        setFormData(prev => ({ ...prev, usu_id: userId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.usu_id) {
            alert("Por favor, selecione um usuário na lista.");
            return;
        }

        setSaving(true);
        try {
            await onSave(formData); 
            onClose();
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                
                <div className={styles.header}>
                    <h3>Vincular Usuário</h3>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.body}>
                    
                    {/* --- ÁREA DE BUSCA --- */}
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input 
                            type="text" 
                            placeholder="Buscar usuário por nome..." 
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus // Foca na busca ao abrir
                        />
                    </div>

                    {/* --- TABELA DE USUÁRIOS (COM SCROLL) --- */}
                    <div className={styles.tableContainer}>
                        {loadingList ? (
                            <div className={styles.loadingState}>Carregando usuários...</div>
                        ) : filteredUsers.length === 0 ? (
                            <div className={styles.emptyState}>Nenhum usuário encontrado.</div>
                        ) : (
                            <table className={styles.userTable}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th style={{ width: '80px', textAlign: 'center' }}>ID</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => {
                                        const isSelected = formData.usu_id === user.usu_id;
                                        return (
                                            <tr 
                                                key={user.usu_id} 
                                                onClick={() => handleSelectUser(user.usu_id)}
                                                className={isSelected ? styles.selectedRow : ''}
                                            >
                                                <td>
                                                    <div className={styles.userName}>
                                                        <User size={16} /> {user.usu_nome}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center' }}>#{user.usu_id}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className={styles.divider} />

                    {/* --- DADOS COMPLEMENTARES (DATA E PROPRIETÁRIO) --- */}
                    <div className={styles.row}>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <label>Data de Início</label>
                            <div className={styles.inputIconWrapper}>
                                <Calendar size={18} className={styles.inputIcon} />
                                <input 
                                    type="date" 
                                    name="start_date" 
                                    value={formData.start_date} 
                                    onChange={handleChange} 
                                    className={styles.input}
                                    style={{ paddingLeft: '40px' }}
                                    required 
                                />
                            </div>
                        </div>
                    </div>

                    <label 
                        className={styles.checkboxContainer}
                        style={{ 
                            borderColor: formData.is_owner ? '#eb2525ff' : '#dbd1d1ff', 
                            backgroundColor: formData.is_owner ? '#ffefefff' : '#fff' 
                        }}
                    >
                        <div className={styles.checkboxContent}>
                            <span className={styles.checkboxTitle}>É o Proprietário atual?</span>
                            <span className={styles.checkboxDesc}>Define responsabilidade legal sobre o veículo.</span>
                        </div>
                        <input 
                            type="checkbox" 
                            name="is_owner" 
                            checked={formData.is_owner} 
                            onChange={handleChange}
                            className={styles.realCheckbox}
                        />
                        <div className={styles.checkIndicator}>
                            {formData.is_owner ? <CheckCircle size={20} color="#eb2525ff" /> : <div className={styles.circleEmpty} />}
                        </div>
                    </label>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>
                            Cancelar
                        </button>
                        <button type="submit" className={styles.btnSave} disabled={saving || !formData.usu_id}>
                            {saving ? "Salvando..." : <><Save size={18} /> Salvar Vínculo</>}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}