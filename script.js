document.addEventListener('DOMContentLoaded', function() {
    
    // === NAVEGACIÓN SPA (SINGLE PAGE APPLICATION) ===
    window.navegar = function(vista) {
        // 1. Ocultar todas las secciones
        document.querySelectorAll('.vista-seccion').forEach(el => el.classList.add('d-none'));
        
        // 2. Mostrar la deseada
        const target = document.getElementById('seccion-' + vista);
        if(target) target.classList.remove('d-none');
        
        // 3. Scroll arriba suave
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // 4. Actualizar menú activo
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const link = document.getElementById('link-' + vista);
        if(link) link.classList.add('active');

        // 5. Cerrar menú móvil si está abierto
        const nav = document.getElementById('navbarContent');
        if(nav.classList.contains('show')) new bootstrap.Collapse(nav).hide();
    };

    // === FILTRADO CATÁLOGO SIN HUECOS ===
    window.filtrar = function(cat, btn) {
        // Estilo botones
        document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Lógica filtro
        document.querySelectorAll('.item-prod').forEach(item => {
            if(cat === 'todos' || item.getAttribute('data-cat') === cat) {
                item.classList.remove('d-none'); // Mostrar
                // Pequeña animación
                item.style.opacity = '0';
                setTimeout(() => item.style.opacity = '1', 50);
            } else {
                item.classList.add('d-none'); // Ocultar por completo
            }
        });
    };

    // === MODAL DINÁMICO ===
    const modalEl = document.getElementById('modalProducto');
    const modal = new bootstrap.Modal(modalEl);

    window.verModal = function(titulo, precio, img) {
        document.getElementById('modalTitulo').textContent = titulo;
        document.getElementById('modalPrecio').textContent = 'S/ ' + precio;
        document.getElementById('modalImg').src = img;
        
        const text = `Hola PICAM, me interesa: ${titulo} - S/ ${precio}`;
        document.getElementById('modalWsp').href = `https://wa.me/51924969442?text=${encodeURIComponent(text)}`;
        
        modal.show();
    };

    // Iniciar en portada
    navegar('inicio');
});