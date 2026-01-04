"use client";
import { useState, useEffect } from "react";
import { X, Save, Search, Car, CheckCircle } from "lucide-react";
import { getAllVehicles } from "@/services/vehicles.service"; // Importe o service de veículos

import styles from "./modalVehicleLink.module.css"; // Use o mesmo CSS ou uma cópia

export default function ModalVehicleLink({ isOpen, onClose, onSave }) {
    const [vehicles, setVehicles] = useState([]);
    const [loadingList, setLoadingList] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        veic_id: "",
        is_owner: true,
        start_date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        if (isOpen) {
            fetchVehicles();
            setFormData({
                veic_id: "",
                is_owner: true,
                start_date: new Date().toISOString().split('T')[0]
            });
            setSearchTerm("");
        }
    }, [isOpen]);

    const fetchVehicles = async () => {
        setLoadingList(true);
        try {
            // Busca todos os veículos (pode passar filtros se quiser otimizar)
            const response = await getAllVehicles("", 1, "active"); // Busca apenas ativos

            let lista = [];
            if (Array.isArray(response)) lista = response;
            else if (response?.data && Array.isArray(response.data)) lista = response.data;

            setVehicles(lista);
        } catch (error) {
            console.error("Erro ao buscar veículos", error);
            setVehicles([]);
        } finally {
            setLoadingList(false);
        }
    };

    // Filtra veículos por PLACA ou MODELO
    const filteredVehicles = vehicles.filter(v =>
        v.veic_placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (v.modelo && v.modelo.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            // Se for checkbox usa 'checked', se não usa 'value'
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSelectVehicle = (veicId) => {
        setFormData(prev => ({ ...prev, veic_id: veicId }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.veic_id) {
            alert("Por favor, selecione um veículo na lista.");
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
                    <h3>Vincular Veículo</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.body}>
                    <div className={styles.searchWrapper}>
                        <Search size={18} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Buscar por placa ou modelo..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <div className={styles.tableContainer}>
                        {loadingList ? (
                            <div className={styles.loadingState}>Carregando veículos...</div>
                        ) : filteredVehicles.length === 0 ? (
                            <div className={styles.emptyState}>Nenhum veículo encontrado.</div>
                        ) : (
                            <table className={styles.userTable}>
                                <thead>
                                    <tr>
                                        <th>Veículo</th>
                                        <th style={{ width: '100px', textAlign: 'center' }}>Placa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredVehicles.map(v => {
                                        const isSelected = formData.veic_id === v.veic_id;
                                        return (
                                            <tr
                                                key={v.veic_id}
                                                onClick={() => handleSelectVehicle(v.veic_id)}
                                                className={isSelected ? styles.selectedRow : ''}
                                            >
                                                <td>
                                                    <div className={styles.userName}>
                                                        <Car size={16} />
                                                        {v.modelo || "Veículo"} - {v.marca || ""}
                                                    </div>
                                                </td>
                                                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{v.veic_placa}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.row}>
                        <div className={styles.inputGroup} style={{ flex: 1 }}>
                            <label>Data de Início</label>
                            <input
                                type="date"
                                name="start_date"
                                value={formData.start_date}
                                onChange={handleChange}
                                className={styles.input}
                                required
                            />
                        </div>
                    </div>

                    <label
                        className={styles.checkboxContainer}
                        style={{
                            borderColor: formData.is_owner ? '#ef4444' : '#d1d5db',
                            backgroundColor: formData.is_owner ? '#fef2f2' : '#ffffff',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div className={styles.checkboxContent}>
                            <span className={styles.checkboxTitle} style={{ color: '#371f1f' }}>É proprietário deste veículo?</span>
                            <span className={styles.checkboxDesc} style={{ color: '#806b6b' }}>Define responsabilidade legal.</span>
                        </div>

                        <input
                            type="checkbox"
                            name="is_owner"
                            checked={formData.is_owner || false}
                            onChange={handleChange}
                            className={styles.realCheckbox}
                        />

                        <div className={styles.checkIndicator}>
                            {formData.is_owner ? (
                                <CheckCircle size={24} color="#ef4444" weight="fill" />
                            ) : (
                                <div className={styles.circleEmpty} />
                            )}
                        </div>
                    </label>

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.btnCancel}>Cancelar</button>
                        <button type="submit" className={styles.btnSave} disabled={saving || !formData.veic_id}>
                            {saving ? "Salvando..." : <><Save size={18} /> Salvar Vínculo</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}