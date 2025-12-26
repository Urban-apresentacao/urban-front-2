"use client";

import { useState, useEffect, useRef } from "react"; // Adicionado useCallback
import { useVehicles } from "@/hooks/useVehicles";
import { Table } from "@/components/ui/table/table";
import Link from "next/link";
import { Edit, Search, Plus, Eye, ChevronDown } from "lucide-react";
import { Pagination } from "@/components/ui/pagination/pagination";

import styles from "./VehiclesClient.module.css";

export default function VehiclesClient() {
    const { vehicles, loading, fetchVehicles, page, totalPages } = useVehicles();
    const [inputValue, setInputValue] = useState("");

    // Ref para impedir que a busca da digitação rode na montagem inicial   
    const isMounted = useRef(false);

    // --- EFEITO 1: Roda APENAS UMA VEZ ao abrir a tela (Mount) ---
    useEffect(() => {
        fetchVehicles("", 1);
    }, [fetchVehicles]);

    // --- EFEITO 2: Roda APENAS quando o input muda (Update) ---
    useEffect(() => {
        // Se o componente ainda não montou completamente, não faz nada
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        // Debounce: Espera o usuário parar de digitar
        const delayDebounceFn = setTimeout(() => {
            fetchVehicles(inputValue, 1);
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [inputValue, fetchVehicles]);

    const handlePageChange = (newPage) => {
        fetchVehicles(inputValue, newPage);
    };

    const columns = [
        { header: "ID", accessor: "veic_id" },
        { header: "Modelo", accessor: "modelo" },
        { header: "Marca", accessor: "marca" },
        { header: "Placa", accessor: "veic_placa" },
        {
            header: "Proprietários",
            accessor: "proprietarios",
            render: (vehicle) => {
                // Caso 1: Sem proprietário
                if (!vehicle.proprietarios) {
                    return <span className={styles.emptyText}>-</span>;
                }

                const ownersList = vehicle.proprietarios.split(',').map(name => name.trim());

                // Caso 2: Apenas 1 proprietário (mostra texto normal)
                if (ownersList.length === 1) {
                    return <span className={styles.singleOwner}>{ownersList[0]}</span>;
                }

                // Caso 3: Múltiplos (Dropdown)
                return (
                    <div className={styles.selectContainer}>
                        <select className={styles.selectNative} defaultValue="">
                            <option value="" disabled>
                                {ownersList.length} Proprietários
                            </option>
                            {ownersList.map((owner, index) => (
                                <option key={index} value={owner}>
                                    {owner}
                                </option>
                            ))}
                        </select>
                        {/* Ícone da Lucide posicionado via CSS */}
                        <ChevronDown size={16} className={styles.selectIcon} />
                    </div>
                );
            },
        },
        {
            header: "Ações",
            accessor: "actions",
            render: (vehicle) => (
                <div style={{ display: 'flex', gap: '10px' }}>
					<Link
						href={`/admin/vehicles/${vehicle.veic_id}?mode=edit`}
						style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none', marginRight: '10px' }}
					>
						<Edit size={16} /> Editar
					</Link>
					<Link
						href={`/admin/vehicles/${vehicle.veic_id}?mode=view`}
						style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2563eb', textDecoration: 'none' }}
					>
						<Eye size={16} /> Visualizar
					</Link>
				</div>
            ),
        },
    ];

    return (
        <div className={styles.wrapper}>

            <div className={styles.actionsBar}>
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

                <Link href="/admin/vehicles/register" className={styles.newButton}>
                    <Plus size={20} />
                    <span>Novo</span>
                </Link>
            </div>


            <div className={styles.tableContainer}>
				<Table
					columns={columns}
					data={vehicles}
					isLoading={loading}
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
    )
}