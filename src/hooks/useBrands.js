import { useState, useEffect } from "react";
// Importe a função que criamos acima
import { getBrandsByCategoryId } from "@/services/brands.service";

export function useBrands(categoryId) {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Se o usuário limpou a categoria ou ainda não selecionou
        if (!categoryId) {
            setBrands([]);
            return;
        }

        async function fetch() {
            setLoading(true);
            try {
                const data = await getBrandsByCategoryId(categoryId);
                setBrands(data);
            } catch (error) {
                console.error("Erro ao buscar marcas:", error);
                setBrands([]);
            } finally {
                setLoading(false);
            }
        }

        fetch();
        
    // O useEffect dispara sempre que o categoryId mudar
    }, [categoryId, ]); 

    return { brands, loading };
}