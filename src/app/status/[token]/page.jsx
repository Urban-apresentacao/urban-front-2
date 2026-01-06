"use client";

import { useEffect, useState, use } from "react";
import { getTrackingStatus } from "@/services/tracking.service";
import { Car, Clock, Sparkles, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import styles from "./page.module.css";
import Image from 'next/image';

export default function TrackingPage({ params }) {
  // Desembrulhar params (Next.js 15+)
  const { token } = use(params);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const result = await getTrackingStatus(token);
        // O backend retorna { status: 'success', data: { ... } }
        setData(result.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchStatus();
  }, [token]);

  // Função para definir o visual baseado no status (agend_situacao)
  // 1 = Pendente, 2 = Em Andamento, 3 = Concluído, 0 = Cancelado (Ajuste conforme seus IDs)
  const getStatusConfig = (statusId) => {
    switch (String(statusId)) {
      case '1': // Pendente / Aguardando
        return {
          icon: <Clock size={40} />,
          text: "Aguardando Início",
          desc: "Seu veículo está na fila de atendimento.",
          style: styles.pending
        };
      case '2': // Em andamento (assumindo que você usa 2 para 'em lavagem')
        return {
          icon: <Sparkles size={40} />, // Brilho de limpeza
          text: "Em Lavagem",
          desc: "Nossa equipe está cuidando do seu veículo.",
          style: styles.active
        };
      case '3': // Concluído
        return {
          icon: <CheckCircle2 size={40} />,
          text: "Pronto para Retirada",
          desc: "Seu veículo já está limpo e te esperando!",
          style: styles.done
        };
      case '0': // Cancelado
        return {
          icon: <XCircle size={40} />,
          text: "Agendamento Cancelado",
          desc: "Entre em contato com a estética para mais detalhes.",
          style: styles.canceled
        };
      default:
        return {
          icon: <Car size={40} />,
          text: "Status Desconhecido",
          desc: "Consulte a estética.",
          style: styles.pending
        };
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <Loader2 className="animate-spin" size={32} />
          <p>Buscando informações do veículo...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.body}>
            <XCircle size={48} color="#ef4444" style={{ margin: '0 auto 10px' }} />
            <h2 className={styles.title}>Link Inválido ou Expirado</h2>
            <p style={{ color: '#666', marginTop: 10 }}>
              Não conseguimos encontrar este agendamento. Verifique o link enviado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(data.agend_situacao);

  const logoPath = "/images/logo_autolimp.jpeg";

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        
        {/* Header da Marca */}
        <div className={styles.header}>
          {/* Removi o texto "Estética Automotiva" já que vai ter o logo */}
          {/* <span className={styles.brand}>Estética Automotiva</span> */}
          <h1 className={styles.title}>Acompanhe seu Veículo</h1>
        </div>

        <div className={styles.sealWrapper}>
           {/* Usando Next Image para otimização. Se não quiser usar, pode usar <img> normal */}
           <Image 
            src={logoPath} 
            alt="Logo da Estética" 
            width={80} 
            height={80} 
            className={styles.sealImage}
           />
        </div>

        <div className={styles.body}>
          
          {/* Informações do Carro */}
          <div className={styles.vehicleInfo}>
            <h2 className={styles.model}>{data.mod_nome || data.veic_modelo}</h2>
            {/* Opcional: Mostrar marca */}
            <p style={{margin: '0 0 10px 0', color: '#6b7280'}}>{data.mar_nome}</p> 
            <span className={styles.plate}>
                {/* Ocultando parte da placa por privacidade se quiser: ***-5678 */}
                Placa: {data.veic_placa ? data.veic_placa : '---'} 
            </span>
          </div>

          {/* Status Visual */}
          <div className={styles.statusContainer}>
            <div className={`${styles.iconWrapper} ${statusConfig.style}`}>
              {statusConfig.icon}
            </div>
            <div>
              <div className={styles.statusText}>{statusConfig.text}</div>
              <p className={styles.statusDesc}>{statusConfig.desc}</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className={styles.footer}>
          Atualizado em: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}