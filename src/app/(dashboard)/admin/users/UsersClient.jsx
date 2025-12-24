"use client";

import { useUsers } from "@/hooks/useUsers";

import styles from "./UsersClient.module.css";

export default function UsersClient() {
  const { users, loading } = useUsers();

  if (loading) {
    return <div>Carregando usuários...</div>;
  }

  return (
    <ul>
      {users.map((user) => (
        <li 
        key={user.usu_id}
        className={styles.li}>{user.usu_nome}</li>
      ))}
    </ul>
  );
}
