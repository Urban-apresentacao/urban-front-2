import { useState, useEffect, useCallback } from "react";
import { getServiceCategories } from "@/services/servicesCategories.service";
import Swal from "sweetalert2";

export function useServiceCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Envolvemos no useCallback para poder chamar de fora
    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true); // Opcional: mostrar loading no reload
            const response = await getServiceCategories();
            const listaReal = response.data || response;

            const formattedOptions = listaReal.map(cat => ({
                value: String(cat.cat_serv_id),
                label: cat.cat_serv_nome,

                // 👇 ALTERAÇÃO DE SEGURANÇA:
                // Se cat_serv_situacao for undefined ou null, assume TRUE.
                // Assim as categorias aparecem mesmo se o backend esquecer o campo.
                active: cat.cat_serv_situacao !== false
            }));

            setCategories(formattedOptions);

            setCategories(formattedOptions);
        } catch (error) {
            console.error("Erro categorias:", error);
            // Swal.fire("Erro", "Falha ao carregar categorias.", "error");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // 👇 EXPORTAMOS O REFETCH
    return { categories, loading, refetch: fetchCategories };
}