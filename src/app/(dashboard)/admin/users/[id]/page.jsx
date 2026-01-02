"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import UserFormAdmin from "@/components/userForm/userFormAdmin/userFormAdmin";
import { getUserById, updateUser } from "@/services/users.service";
import Swal from "sweetalert2";
import styles from "../register/page.module.css";

export default function EditUserPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const { id } = params;

    const mode = searchParams.get("mode") || "view";

    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            if (!id) return;

            try {
                setLoading(true);
                const response = await getUserById(id);

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
                    router.push("/admin/users");
                });
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id, router]);

    const handleUpdateUser = async (formData) => {
        try {
            await updateUser(id, formData);
            return { success: true };
        } catch (error) {
            console.error("Erro ao atualizar:", error);
            return { success: false };
        }
    };

    const handleSuccess = () => {
        Swal.fire({
            title: "Sucesso!",
            text: "Dados atualizados com sucesso.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            router.push("/admin/users");
        });
    };

    const handleCancel = () => {
        router.push("/admin/users");
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px', color: '#666' }}>
                Carregando dados do usuário...
            </div>
        );
    }

    return (
        <div className={styles?.container || ""}>
            <h2 style={{ marginBottom: '20px', color: '#333' }}>
                {mode === 'view' ? 'Visualizar Usuário' : 'Editar Usuário'}
            </h2>

            {userData && (
                <UserFormAdmin
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