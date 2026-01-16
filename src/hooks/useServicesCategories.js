import { useState, useEffect, useCallback } from "react";
import { getServiceCategories } from "@/services/servicesCategories.service";

export function useServiceCategories() {
    // Inicializa com array vazio
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const response = await getServiceCategories();
            
            // Tratamento para garantir array
            const listaReal = Array.isArray(response) 
                ? response 
                : (response.data || []);

            // O HOOK JÁ FORMATA PARA O SELECT (value/label)
            const formattedOptions = listaReal.map(cat => ({
                value: String(cat.cat_serv_id),
                label: cat.cat_serv_nome,
                active: cat.cat_serv_situacao !== false
            }));

            setCategories(formattedOptions);

        } catch (error) {
            console.error("Erro categorias:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading, refetch: fetchCategories };
}