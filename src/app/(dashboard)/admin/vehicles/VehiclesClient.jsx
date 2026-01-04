"use client";

import { useState, useEffect, useRef } from "react";
import { useVehicles } from "@/hooks/useVehicles";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Search, Plus, Eye, ChevronDown, Filter, Trash2, RotateCcw } from "lucide-react";
import { Pagination } from "@/components/ui/pagination/pagination";
import { toggleVehicleStatus } from "@/services/vehicles.service";
import Swal from "sweetalert2";

import styles from "./VehiclesClient.module.css";

export default function VehiclesClient() {
    const {
        vehicles,
        loading,
        fetchVehicles,
        page,
        totalPages,
        sortColumn,
        sortDirection,
        handleSort
    } = useVehicles();

    const [inputValue, setInputValue] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const isMounted = useRef(false);

    // 1. BUSCA INICIAL (Roda apenas 1 vez na montagem da tela)
    // O array vazio [] garante que não repita desnecessariamente
    useEffect(() => {
        fetchVehicles("", 1, "all", "veic_id", "DESC");
    }, []);

    // 2. EFEITO INSTANTÂNEO (Filtro de Status e Ordenação)
    // Quando você clica no header ou muda o select, atualiza na hora sem delay
    useEffect(() => {
        if (!isMounted.current) return;

        // Passamos o inputValue atual para não perder a busca se houver
        fetchVehicles(inputValue, 1, statusFilter, sortColumn, sortDirection);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, sortColumn, sortDirection]); // Removido inputValue daqui para não conflitar

    // 3. EFEITO DEBOUNCE (Apenas para Digitação no Input)
    // Só espera 500ms se for texto sendo digitado, para não travar a UI
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchVehicles(inputValue, 1, statusFilter, sortColumn, sortDirection);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue]); // Só monitora o input

    // --- HANDLERS ---

    const handlePageChange = (newPage) => {
        fetchVehicles(inputValue, newPage, statusFilter, sortColumn, sortDirection);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    // --- FUNÇÕES DE STATUS (Inativar/Reativar) ---
    const handleArchiveVehicle = async (id, nome) => {
        const result = await Swal.fire({
            title: 'Ocultar Veículo?',
            text: `O veículo "${nome}" ficará inativo.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, ocultar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await toggleVehicleStatus(id, false);
                await Swal.fire({
                    title: 'Ocultado!',
                    text: 'Veículo desativado.',
                    icon: 'success',
                    confirmButtonColor: '#16a34a'
                });
                fetchVehicles(inputValue, page, statusFilter, sortColumn, sortDirection);
            } catch (error) {
                console.error(error);
                Swal.fire('Erro', 'Erro ao ocultar.', 'error');
            }
        }
    };

    const handleReactivateVehicle = async (id, nome) => {
        const result = await Swal.fire({
            title: 'Reativar Veículo?',
            text: `O veículo "${nome}" voltará a ficar visível.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sim, reativar!',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await toggleVehicleStatus(id, true);
                await Swal.fire({
                    title: 'Ativado!',
                    text: 'Veículo reativado.',
                    icon: 'success',
                    confirmButtonColor: '#16a34a'
                });
                fetchVehicles(inputValue, page, statusFilter, sortColumn, sortDirection);
            } catch (error) {
                console.error(error);
                Swal.fire('Erro', 'Erro ao reativar.', 'error');
            }
        }
    };

    // --- DEFINIÇÃO DAS COLUNAS ---
    const columns = [
        { header: "ID", accessor: "veic_id" },
        { header: "Modelo", accessor: "modelo" }, // Backend mapeia para 'mo.mod_nome'
        { header: "Marca", accessor: "marca" },   // Backend mapeia para 'm.mar_nome'
        { header: "Placa", accessor: "veic_placa" },
        {
            header: "Proprietários",
            accessor: "proprietarios", // Não ordenável via backend (complexo)
            render: (vehicle) => {
                if (!vehicle.proprietarios) return <span className={styles.emptyText}>-</span>;

                const ownersList = vehicle.proprietarios.split(',').map(name => name.trim());

                if (ownersList.length === 1) {
                    return <span style={{ fontSize: '0.875rem', color: '#374151' }}>{ownersList[0]}</span>;
                }

                return (
                    <div className={styles.selectContainer}>
                        <select className={styles.selectNative} defaultValue="">
                            <option value="" disabled style={{ color: '#9ca3af' }}>
                                {ownersList.length} Proprietários
                            </option>
                            {ownersList.map((owner, index) => (
                                <option key={index} value={owner}>{owner}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className={styles.selectIcon} />
                    </div>
                );
            },
        },
        {
            header: "Status",
            accessor: "veic_situacao",
            render: (vehicle) => (
                <span style={{
                    backgroundColor: vehicle.veic_situacao ? '#dcfce7' : '#fee2e2',
                    color: vehicle.veic_situacao ? '#166534' : '#991b1b',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    border: vehicle.veic_situacao ? '1px solid #bbf7d0' : '1px solid #fecaca'
                }}>
                    {vehicle.veic_situacao ? "Ativo" : "Inativo"}
                </span>
            ),
        },
        {
            header: "Ações",
            accessor: "actions",
            render: (vehicle) => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Link
                        href={`/admin/vehicles/${vehicle.veic_id}?mode=view`}
                        style={{ display: 'flex', alignItems: 'center', color: '#2563eb' }}
                        title="Visualizar"
                    >
                        <Eye size={16} />
                    </Link>
                    <Link
                        href={`/admin/vehicles/${vehicle.veic_id}?mode=edit`}
                        style={{ display: 'flex', alignItems: 'center', color: '#2563eb' }}
                        title="Editar"
                    >
                        <Edit size={16} />
                    </Link>
                    {vehicle.veic_situacao ? (
                        <button
                            onClick={() => handleArchiveVehicle(vehicle.veic_id, vehicle.veic_placa)}
                            style={{ display: 'flex', alignItems: 'center', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Ocultar"
                        >
                            <Trash2 size={16} />
                        </button>
                    ) : (
                        <button
                            onClick={() => handleReactivateVehicle(vehicle.veic_id, vehicle.veic_placa)}
                            style={{ display: 'flex', alignItems: 'center', color: '#16a34a', background: 'none', border: 'none', cursor: 'pointer' }}
                            title="Reativar"
                        >
                            <RotateCcw size={16} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className={styles.wrapper}>
            <div className={styles.actionsBar}>
                <div className={styles.filtersGroup}>
                    <div className={styles.searchWrapper}>
                        <Search size={20} className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Pesquisar veículo..."
                            className={styles.searchInput}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <div className={styles.selectWrapper}>
                        <Filter size={16} className={styles.filterIcon} />
                        <select
                            className={styles.statusSelect}
                            value={statusFilter}
                            onChange={handleStatusChange}
                        >
                            <option value="all">Todos</option>
                            <option value="active">Ativos</option>
                            <option value="inactive">Inativos</option>
                        </select>
                    </div>
                </div>
                <Link href="/admin/vehicles/register" className={styles.newButton}>
                    <Plus size={20} />
                    <span>Novo Veículo</span>
                </Link>
            </div>

            <div className={styles.tableContainer}>
                <Table
                    columns={columns}
                    data={vehicles}
                    isLoading={loading}
                    onSort={handleSort}
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                />
            </div>

            {!loading && vehicles.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}