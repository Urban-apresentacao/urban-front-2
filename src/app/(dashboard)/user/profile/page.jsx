"use client"

import styles from './page.module.css'

import { useProfile} from '@/hooks/useProfile'
import UserFormUser from '@/components/userForm/userFormUser/userFormUser'
import { Loader2 } from "lucide-react";

export default function Profile() {

const { user, loading, handleUpdate } = useProfile();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <Loader2 className="animate-spin" size={48} color="#2563eb" />
      </div>
    );
  }


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Perfil do Usuário</h1>
            {/* Conteúdo do perfil do usuário */}
            <UserFormUser 
            user={user}
            onUpdate={handleUpdate}
            />
        </div>
    )
}