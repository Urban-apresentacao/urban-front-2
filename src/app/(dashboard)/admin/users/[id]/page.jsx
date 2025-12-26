"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import UserForm from "@/components/userForm/userForm";
import { getUserById, updateUser } from "@/services/users.service";
import Swal from "sweetalert2";

// Podemos reutilizar o CSS do registro para manter a consistência visual
// Se não tiver esse arquivo, pode remover o import e a className={styles.container}
import styles from "../register/page.module.css";

export default function EditUserPage() {
    const params = useParams(); // Hook do Next.js para pegar o ID da URL
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = params;

    const mode = searchParams.get("mode") || "view"; // Pega o modo da URL, padrão "edit"

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Busca os dados do usuário assim que a tela abre
    useEffect(() => {
        async function loadData() {
            if (!id) return;

            try {
                setLoading(true);
                // Chama o GET do service
                const response = await getUserById(id);

                // Pega o response.data (que é onde está o usuário)
                if (response && response.data) {
                    setUserData(response.data);
                } else {
                    throw new Error("Usuário não encontrado");
                }
            } catch (error) {
                console.error("Erro ao carregar usuário:", error);
                Swal.fire({
                    title: "Erro",
                    text: "Não foi possível carregar os dados do usuário.",
                    icon: "error"
                }).then(() => {
                    router.push("/admin/users"); // Volta pra lista se der erro
                });
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, router]);

    // 2. Função de salvar (passada para o formulário)
    const handleUpdateUser = async (formData) => {
        try {
            // Chama o PUT do service
            await updateUser(id, formData);
            return { success: true };
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            return { success: false };
        }
    };

    // 3. O que acontece após salvar com sucesso
    const handleSuccess = () => {
        Swal.fire({
            title: "Sucesso!",
            text: "Dados atualizados com sucesso.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            router.push("/admin/users"); // Redireciona para a tabela
        });
    };

    // 4. Botão cancelar
    const handleCancel = () => {
        router.push("/admin/users");
    };

    // Enquanto carrega os dados do banco, mostra msg de carregando
    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: '#666' }}>
                Carregando dados do usuário...
            </div>
        );
    }

    return (
        // Usa a mesma classe do register para ficar igual, ou uma div simples
        <div className={styles?.container || ""}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
                {mode === 'view' ? 'Visualizar Usuário' : 'Editar Usuário'}
            </h2>

            {/* IMPORTANTE: O UserForm só é renderizado se userData existir.
          Isso garante que o "initialData" não seja null na montagem do form.
      */}
            {userData && (
                <UserForm
                    initialData={userData}
                    mode={mode}
                    saveFunction={handleUpdateUser}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
}