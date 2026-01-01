"use client";
import React, { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import styles from './servicesModal.module.css';
import { categories, servicesList } from '../data/serviceDb';

// Ícone do WhatsApp
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" style={{ marginRight: '8px' }}>
    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
  </svg>
);

export default function ServicesModal({ isOpen, onClose, selectedCategoryId }) {
  const whatsappNumber = "5511999999999"; 

  const openWhatsApp = (serviceName = null) => {
    let message = "";
    if (serviceName) {
      message = `Olá! Vi no site sobre *${serviceName}* e gostaria de mais detalhes.`;
    } else {
      message = "Olá! Gostaria de agendar um serviço para meu carro.";
    }
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  // LÓGICA DE FILTRO: 
  // Se veio um ID, pega só aquela categoria. Se é null, pega todas.
  const categoriesToShow = selectedCategoryId 
    ? { [selectedCategoryId]: categories[selectedCategoryId] } 
    : categories;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        
        <div className={styles.header}>
          <div>
            <h3 className={styles.title}>
              {/* Título dinâmico: mostra o nome da categoria ou "Nossos Serviços" */}
              {selectedCategoryId ? categories[selectedCategoryId].name : "Nossos Serviços"}
            </h3>
            <p className={styles.subtitle}>
              {selectedCategoryId ? "Confira as opções exclusivas desta categoria" : "Escolha o tratamento ideal para seu carro"}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.body}>
          {/* Loop pelas categorias filtradas */}
          {Object.entries(categoriesToShow).map(([catId, catData]) => {
             // Busca na lista de serviços apenas os que tem esse ID de categoria
             const categoryServices = servicesList.filter(s => s.catId === parseInt(catId));
             
             // Se não tiver serviço, não renderiza nada
             if (categoryServices.length === 0) return null;

             return (
               <div key={catId} className={styles.categorySection}>
                 {/* Só mostra o título da seção se estiver vendo TUDO. Se já filtrou, o título tá no header. */}
                 {!selectedCategoryId && <h4 className={styles.categoryTitle}>{catData.name}</h4>}
                 
                 <div className={styles.grid}>
                   {categoryServices.map((service) => (
                      <div key={service.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                          <h4 className={styles.serviceName}>{service.title}</h4>
                          <span className={styles.price}>{service.price}</span>
                        </div>
                        <p className={styles.desc}>{service.desc}</p>
                        <button 
                          className={styles.detailsBtn}
                          onClick={() => openWhatsApp(service.title)}
                        >
                          Saiba mais <ArrowRight size={16} />
                        </button>
                      </div>
                   ))}
                 </div>
               </div>
             );
          })}
        </div>

        <div className={styles.footer}>
          <button className={styles.ctaButton} onClick={() => openWhatsApp()}>
            <WhatsAppIcon />
            Entrar em contato via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}