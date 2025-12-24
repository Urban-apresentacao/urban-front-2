'use client'

import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import styles from './page.module.css'
import InputLogin from '@/components/ui/inputLogin/inputLogin' // Ajuste o caminho conforme criou

import { useState } from "react";
import { useLogin } from "./useLogin";

export default function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { handleLogin } = useLogin();

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <span className={styles.logo}>ADM</span>
                    <h1>Acesso ao Sistema</h1>
                    <p>Entre com suas credenciais</p>
                </div>

                <form
                    className={styles.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin(email, senha);
                    }}>
                    
                    {/* INPUT EMAIL */}
                    <InputLogin
                        label="Email"
                        icon={Mail}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    {/* INPUT SENHA */}
                    <InputLogin
                        label="Senha"
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    >
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </InputLogin>

                    <button className={styles.button}>
                        Entrar
                    </button>

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => window.history.back()}
                    >
                        Voltar
                    </button>
                </form>

                <footer className={styles.footer}>
                    <span>© 2025 • Sistema Administrativo</span>
                </footer>
            </div>
        </div>
    )
}