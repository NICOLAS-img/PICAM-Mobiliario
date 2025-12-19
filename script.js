/* ============================================
   PICAM MOBILIARIOS - JavaScript
   Sistema de Carrito con Yape y Formulario
   ============================================ */

// Variables globales
let carrito = [];
let total = 0;

// Datos de contacto
const WHATSAPP_DUENO = '51924969442';
const EMAIL_DUENO = 'accama893@gmail.com';

/* ============================================
   NAVEGACIÓN ENTRE SECCIONES
   ============================================ */
function navegar(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.vista-seccion').forEach(sec => {
        sec.classList.add('d-none');
    });
    
    // Mostrar la sección seleccionada
    document.getElementById('seccion-' + seccion).classList.remove('d-none');
    
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.getElementById('link-' + seccion).classList.add('active');
    
    // Cerrar el menú hamburguesa en móviles
    const navbarCollapse = document.getElementById('navbarContent');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
            toggle: true
        });
    }
    
    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================
   FILTROS DE CATÁLOGO
   ============================================ */
function filtrar(categoria, btn) {
    // Remover activo de todos los botones
    document.querySelectorAll('.btn-filter').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Mostrar/ocultar items
    const items = document.querySelectorAll('.item-prod');
    
    items.forEach(item => {
        if (categoria === 'todos') {
            item.style.display = 'block';
        } else {
            item.style.display = (item.dataset.cat === categoria) ? 'block' : 'none';
        }
    });
}

/* ============================================
   CARRITO DE COMPRAS
   ============================================ */
function agregarAlCarrito(nombre, precio, img) {
    carrito.push({ 
        id: Date.now(), 
        nombre, 
        precio, 
        img 
    });
    total += precio;
    updateCart();
    
    // Mensaje de confirmación
    mostrarNotificacion('Producto agregado al carrito', 'success');
}

function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        total -= carrito[index].precio;
        carrito.splice(index, 1);
        updateCart();
        mostrarNotificacion('Producto eliminado', 'info');
    }
}

function updateCart() {
    // Actualizar contador
    document.getElementById('cart-count').textContent = carrito.length;
    document.getElementById('cart-total-price').textContent = 'S/ ' + total.toFixed(2);
    
    // Actualizar lista del carrito
    const lista = document.getElementById('lista-carrito');
    
    if (carrito.length === 0) {
        lista.innerHTML = '<p class="text-center text-muted py-4">El carrito está vacío.</p>';
        document.getElementById('botonPagar').style.display = 'none';
    } else {
        lista.innerHTML = carrito.map(item => `
            <div class="cart-item">
                <img src="${item.img}" alt="${item.nombre}">
                <div class="cart-item-info">
                    <h6 class="mb-1">${item.nombre}</h6>
                    <small>S/ ${item.precio.toFixed(2)}</small>
                </div>
                <button class="btn-eliminar-item" onclick="eliminarDelCarrito(${item.id})" title="Eliminar">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `).join('');
        document.getElementById('botonPagar').style.display = 'block';
    }
}

function abrirCarrito() {
    const modal = new bootstrap.Modal(document.getElementById('modalCarrito'));
    modal.show();
}

/* ============================================
   SISTEMA DE PAGO CON YAPE
   ============================================ */
function mostrarYape() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'warning');
        return;
    }
    
    document.getElementById('seccion-yape').classList.remove('d-none');
    document.getElementById('botonPagar').style.display = 'none';
}

function confirmarPagoYape() {
    if (carrito.length === 0) {
        mostrarNotificacion('El carrito está vacío', 'warning');
        return;
    }
    
    // Crear mensaje detallado para WhatsApp
    let mensaje = `🛒 *NUEVA COMPRA - PICAM MOBILIARIOS*%0A%0A`;
    mensaje += `📦 *PRODUCTOS:*%0A`;
    mensaje += `--------------------------------%0A`;
    
    carrito.forEach((item, index) => {
        mensaje += `${index + 1}. ${item.nombre}%0A`;
        mensaje += `   💰 S/ ${item.precio.toFixed(2)}%0A`;
    });
    
    mensaje += `--------------------------------%0A`;
    mensaje += `*TOTAL: S/ ${total.toFixed(2)}*%0A%0A`;
    mensaje += `✅ *Pago realizado por Yape*%0A`;
    mensaje += `📱 Por favor, confirme la recepción del pago.`;
    
    // Abrir WhatsApp con el mensaje
    const urlWhatsApp = `https://wa.me/${WHATSAPP_DUENO}?text=${mensaje}`;
    window.open(urlWhatsApp, '_blank');
    
    // Limpiar carrito
    setTimeout(() => {
        carrito = [];
        total = 0;
        updateCart();
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
        if (modal) modal.hide();
        
        // Ocultar sección Yape
        document.getElementById('seccion-yape').classList.add('d-none');
        document.getElementById('botonPagar').style.display = 'block';
        
        mostrarNotificacion('¡Pedido enviado! Confirma tu pago por WhatsApp', 'success');
    }, 1000);
}

/* ============================================
   FORMULARIO DE CONTACTO
   ============================================ */
function enviarFormularioContacto(e) {
    e.preventDefault();
    
    const nombres = document.getElementById('nombres').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    
    // Validación
    if (!nombres || !apellidos || !telefono || !correo || !descripcion) {
        mostrarNotificacion('Por favor, completa todos los campos', 'warning');
        return;
    }
    
    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        mostrarNotificacion('Por favor, ingresa un correo válido', 'warning');
        return;
    }
    
    // Crear mensaje para WhatsApp
    let mensajeWA = `📋 *NUEVA COTIZACIÓN - PICAM MOBILIARIOS*%0A%0A`;
    mensajeWA += `👤 *Cliente:* ${nombres} ${apellidos}%0A`;
    mensajeWA += `📱 *Teléfono:* ${telefono}%0A`;
    mensajeWA += `📧 *Email:* ${correo}%0A%0A`;
    mensajeWA += `📝 *Descripción del Proyecto:*%0A`;
    mensajeWA += `${descripcion}`;
    
    // Enviar por WhatsApp
    const urlWhatsApp = `https://wa.me/${WHATSAPP_DUENO}?text=${mensajeWA}`;
    window.open(urlWhatsApp, '_blank');
    
    // Simular envío de email (en producción usar backend)
    enviarEmailCotizacion(nombres, apellidos, telefono, correo, descripcion);
    
    // Mostrar mensaje de éxito
    document.getElementById('mensajeExito').classList.remove('d-none');
    document.getElementById('contactForm').reset();
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        document.getElementById('mensajeExito').classList.add('d-none');
    }, 5000);
}

// Función para simular envío de email
function enviarEmailCotizacion(nombres, apellidos, telefono, correo, descripcion) {
    // En producción, aquí iría la llamada a tu backend/API
    // Por ahora, solo mostramos en consola
    console.log('📧 EMAIL ENVIADO A:', EMAIL_DUENO);
    console.log({
        para: EMAIL_DUENO,
        asunto: `Nueva Cotización de ${nombres} ${apellidos}`,
        mensaje: `
Cliente: ${nombres} ${apellidos}
Teléfono: ${telefono}
Email: ${correo}

Descripción del Proyecto:
${descripcion}
        `
    });
    
    // Nota: Para envío real de emails, necesitarías:
    // 1. Backend (PHP, Node.js, etc.)
    // 2. Servicio de email (SendGrid, Mailgun, etc.)
    // 3. O usar servicios como EmailJS, Formspree, etc.
}

/* ============================================
   NOTIFICACIONES
   ============================================ */
function mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear elemento de notificación
    const notif = document.createElement('div');
    notif.className = `alert alert-${tipo} position-fixed shadow-lg`;
    notif.style.cssText = `
        top: 80px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease-out;
    `;
    
    const iconos = {
        success: 'check-circle-fill',
        warning: 'exclamation-triangle-fill',
        danger: 'x-circle-fill',
        info: 'info-circle-fill'
    };
    
    notif.innerHTML = `
        <i class="bi bi-${iconos[tipo]} me-2"></i>${mensaje}
    `;
    
    document.body.appendChild(notif);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notif.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notif.remove(), 300);
    }, 3000);
}

// Agregar animaciones CSS para notificaciones
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* ============================================
   INICIALIZACIÓN
   ============================================ */
window.onload = () => {
    // Navegar a inicio
    navegar('inicio');
    
    // Actualizar carrito
    updateCart();
    
    // Configurar formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', enviarFormularioContacto);
    }
    
    // Mensaje de bienvenida en consola
    console.log('%c🪑 PICAM MOBILIARIOS', 'color: #2d5f3f; font-size: 20px; font-weight: bold;');
    console.log('%cSistema de carrito y cotización activo ✅', 'color: #4a9d5f; font-size: 14px;');
};

/* ============================================
   EFECTOS DE SCROLL EN NAVBAR
   ============================================ */
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        navbar.style.background = 'linear-gradient(to bottom, rgba(25, 50, 35, 0.96) 0%, rgba(20, 40, 30, 0.98) 100%)';
        navbar.style.boxShadow = '0 4px 35px rgba(20, 40, 30, 0.5)';
    } else {
        navbar.style.background = 'linear-gradient(to bottom, rgba(30, 61, 43, 0.92) 0%, rgba(30, 61, 43, 0.95) 100%)';
        navbar.style.boxShadow = '0 2px 25px rgba(20, 40, 30, 0.4)';
    }
});