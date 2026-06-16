document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. LÓGICA DEL MENÚ HAMBURGUESA (Móviles)
    // ==========================================
    const menuBtn = document.querySelector('.menu-btn');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                menuBtn.style.transform = 'scale(1)';
                console.log("Abrir menú de navegación");
                // Aquí puedes hacer toggle a una clase 'open' en un <nav> oculto
            }, 150);
        });
    }

    // ==========================================
    // 2. LÓGICA DE LA TARJETA BONTEN (Leer manifiesto)
    // ==========================================
    const readMoreBtn = document.getElementById('read-more-btn');
    const heroCard = document.getElementById('hero-card');

    if (readMoreBtn && heroCard) {
        readMoreBtn.addEventListener('click', () => {
            // Alterna la clase 'expanded' que despliega la tarjeta
            heroCard.classList.toggle('expanded');
            
            // Cambia el texto del botón dependiendo si está abierto o cerrado
            const spanBtn = readMoreBtn.querySelector('span');
            if (heroCard.classList.contains('expanded')) {
                spanBtn.textContent = 'Ocultar manifiesto';
            } else {
                spanBtn.textContent = 'Leer manifiesto completo';
            }
        });
    }

    // ==========================================
    // 3. LÓGICA DEL SISTEMA DE PESTAÑAS (Tabs en Integrantes/Debates)
    // ==========================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Eliminar la clase 'active' de todos los botones y contenidos
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Añadir la clase 'active' al botón clicado
                btn.classList.add('active');

                // Encontrar el contenido correspondiente usando data-target
                const targetId = btn.getAttribute('data-target');
                const targetContent = document.getElementById(targetId);
                
                // Mostrar el contenido objetivo
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

    // ==========================================
    // 4. DETALLE DE NEUROVENTAS: Hover en Biblioteca
    // ==========================================
    const libraryCards = document.querySelectorAll('.library-card');
    
    if (libraryCards.length > 0) {
        libraryCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                // Prepara la tarjeta visualmente para el clic
                card.style.borderColor = 'var(--accent-blue)';
            });
            card.addEventListener('mouseleave', () => {
                // Regresa a su estado natural
                card.style.borderColor = 'var(--border-color)';
            });
        });
    }

});