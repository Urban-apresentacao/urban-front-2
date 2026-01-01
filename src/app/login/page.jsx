'use client'

import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import styles from './page.module.css'
import InputLogin from '@/components/ui/inputLogin/inputLogin' 
import Link from 'next/link' // Importante: Use Link do Next.js para navegação rápida

import { useState } from "react";
import { useLogin } from "./useLogin";

export default function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { handleLogin, loading } = useLogin();

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
                        disabled={loading}
                    />

                    {/* INPUT SENHA */}
                    <InputLogin
                        label="Senha"
                        icon={Lock}
                        type={showPassword ? 'text' : 'password'}
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        disabled={loading}
                    >
                        <button
                            type="button"
                            className={styles.eyeButton}
                            onClick={() => setShowPassword(prev => !prev)}
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </InputLogin>

                    {/* BOTÃO DE ENTRAR */}
                    <button 
                        className={styles.button} 
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
                    >
                        {loading ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <Loader2 size={20} className={styles.spin} /> 
                                <span>Entrando...</span>
                            </div>
                        ) : (
                            "Entrar"
                        )}
                    </button>

                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => window.history.back()}
                        disabled={loading}
                    >
                        Voltar
                    </button>
                </form>

                {/* --- NOVO: Link para Cadastro --- */}
                <div className={styles.signupContainer}>
                    <span>Não tem uma conta?</span>
                    {/* Ajuste o href conforme a rota do seu cadastro (ex: /cadastro, /register) */}
                    <Link href="/register" className={styles.signupLink}>
                        Cadastre-se agora
                    </Link>
                </div>

                <footer className={styles.footer}>
                    <span>© 2025 • Sistema Administrativo</span>
                </footer>
            </div>
        </div>
    )
}