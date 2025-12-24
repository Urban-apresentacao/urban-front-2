"use client";

import { useUsers } from "@/hooks/useUsers";

import styles from "./UsersClient.module.css";
import UsersLoading from "./loading"

export default function UsersClient() {
  const { users, loading } = useUsers();

  if (loading) {
    // return <div>Carregando usuários...</div>;
    return UsersLoading();
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
