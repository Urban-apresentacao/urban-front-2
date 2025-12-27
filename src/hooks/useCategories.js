import { useState, useEffect, useCallback } from "react";

import { getAllCategories } from "@/services/categories.service";

// --- Hook de Categorias ---
export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetch() {
            setLoading(true);
            try {
                const data = await getAllCategories();
                setCategories(data);
            } catch (error) {
                console.error("Erro categorias:", error);
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    return { categories, loading };
}