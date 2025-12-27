import { useState, useEffect } from "react";
// Importe a nova função do serviço criada acima
import { getModelsByCategoryAndBrand } from "@/services/models.service";

// --- Hook de Modelos (Reativo a Categoria e Marca) ---
export function useModels(categoryId, brandId) {
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Se não tiver categoria OU não tiver marca, limpa a lista e não busca
        if (!categoryId || !brandId) {
            setModels([]);
            return;
        }

        async function fetch() {
            setLoading(true);
            try {
                // Chama a nova função passando os dois IDs
                const data = await getModelsByCategoryAndBrand(categoryId, brandId);
                setModels(data);
            } catch (error) {
                console.error("Erro ao buscar modelos:", error);
                setModels([]); // Garante lista vazia em caso de erro
            } finally {
                setLoading(false);
            }
        }

        fetch();
        
    // O array de dependências agora monitora categoryId E brandId
    }, [categoryId, brandId]); 

    return { models, loading };
}