import { useState, useEffect } from "react";
import { getAllCategoriesVehiclesForServices } from "@/services/categoriesVehiclesForServices.service";

export function useCategoriesVehiclesForServices() {
    // Renomeei para vehicleCategories para ficar mais claro
    const [vehicleCategories, setVehicleCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const data = await getAllCategoriesVehiclesForServices();
            setVehicleCategories(data);
        } catch (error) {
            console.error("Erro ao buscar categorias de veículos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Retorna a lista correta e a função de recarregar (refetch) se precisar
    return { vehicleCategories, loading, refetch: fetchCategories };
}