/* ============================================
   PICAM MOBILIARIOS - JavaScript Optimizado
   ✅ Carrito mejorado
   ✅ Validaciones completas
   ✅ Filtros de catálogo corregidos
   ============================================ */

// Estado Global
let carrito = [];
let total = 0;
let metodoPagoSeleccionado = 'yape';
const WHATSAPP_DUENO = '51916694651'; 

/* ============================================
   1. NAVEGACIÓN SPA
   ============================================ */
function navegar(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.vista-seccion').forEach(sec => {
        sec.classList.add('d-none');
    });
    
    // Mostrar sección actual
    const target = document.getElementById('seccion-' + seccion);
    if (target) target.classList.remove('d-none');
    
    // Actualizar links del Navbar
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    const linkActivo = document.getElementById('link-' + seccion);
    if (linkActivo) linkActivo.classList.add('active');
    
    // Cerrar menú hamburguesa en móviles
    const navbarCollapse = document.getElementById('navbarContent');
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
    if (bsCollapse) bsCollapse.hide();
    
    // Scroll suave al inicio
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Activar animaciones si es sección nosotros
    if (seccion === 'nosotros') {
        setTimeout(activarContadores, 300);
    }
}

/* ============================================
   2. CONTADOR ANIMADO (+500 PROYECTOS)
   ============================================ */
function activarContadores() {
    const contadores = document.querySelectorAll('.counter');
    
    contadores.forEach(contador => {
        const target = parseInt(contador.getAttribute('data-target'));
        const incremento = target / 80;
        let actual = 0;
        
        const actualizar = () => {
            actual += incremento;
            if (actual < target) {
                contador.textContent = Math.ceil(actual);
                requestAnimationFrame(actualizar);
            } else {
                contador.textContent = target + (target === 100 ? '%' : '+');
            }
        };
        
        actualizar();
    });
}

/* ============================================
   3. FILTROS DE CATÁLOGO CON ANIMACIÓN (CORREGIDO)
   ============================================ */
function filtrar(categoria, btn) {
    // Actualizar botones
    document.querySelectorAll('.btn-filter').forEach(b => {
        b.classList.remove('active');
    });
    btn.classList.add('active');
    
    // Filtrar productos con animación suave
    const productos = document.querySelectorAll('.producto-item');
    
    productos.forEach((producto, index) => {
        const categoriaProducto = producto.getAttribute('data-cat');
        
        // Primero hacer fade out de todos
        producto.style.opacity = '0';
        producto.style.transform = 'translateY(20px)';
        producto.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            if (categoria === 'todos' || categoriaProducto === categoria) {
                producto.style.display = 'block';
                
                // Fade in con delay progresivo
                setTimeout(() => {
                    producto.style.opacity = '1';
                    producto.style.transform = 'translateY(0)';
                }, index * 50);
            } else {
                producto.style.display = 'none';
            }
        }, 300);
    });
}

/* ============================================
   4. LÓGICA DEL CARRITO
   ============================================ */
function agregarAlCarrito(nombre, precio, img) {
    const item = { id: Date.now(), nombre, precio, img };
    carrito.push(item);
    total += precio; 
    
    actualizarInterfaz();
    mostrarNotificacion(`✨ ${nombre} añadido al carrito`, 'success');
    
    // Efecto visual en el botón del carrito
    const cartBtn = document.getElementById('cart-float');
    if (cartBtn) {
        cartBtn.style.transform = 'scale(1.3)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
    }
}

function eliminarDelCarrito(id) {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
        total -= carrito[index].precio;
        carrito.splice(index, 1);
        actualizarInterfaz();
        mostrarNotificacion('Producto eliminado', 'info');
    }
}

function actualizarInterfaz() {
    const totalFormateado = `S/ ${total.toFixed(2)}`;
    
    // Contador flotante
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = carrito.length;
        if (carrito.length > 0) {
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => cartCount.style.transform = 'scale(1)', 200);
        }
    }
    
    // Totales en el modal
    const cartTotal = document.getElementById('cart-total-price');
    const pagoTotal = document.getElementById('pago-total-display');
    
    if (cartTotal) cartTotal.innerText = totalFormateado;
    if (pagoTotal) pagoTotal.innerText = totalFormateado;
    
    renderizarListaCarrito();
}

function renderizarListaCarrito() {
    const lista = document.getElementById('lista-carrito');
    const resumenPago = document.getElementById('resumen-pago');
    
    if (carrito.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart-x display-1 text-muted opacity-25"></i>
                <p class="mt-3 text-muted">Tu carrito está vacío.</p>
            </div>`;
        if (resumenPago) resumenPago.classList.add('d-none');
        return;
    }

    lista.innerHTML = carrito.map(item => `
        <div class="cart-item shadow-sm border-0 mb-3 p-2 rounded-3 bg-white">
            <img src="${item.img}" alt="${item.nombre}">
            <div class="cart-item-info">
                <h6 class="mb-0 fw-bold text-verde">${item.nombre}</h6>
                <small class="text-dark fw-bold">S/ ${item.precio.toFixed(2)}</small>
            </div>
            <button class="btn btn-sm text-danger border-0" onclick="eliminarDelCarrito(${item.id})" title="Eliminar">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
    `).join('');
    
    if (resumenPago) resumenPago.classList.remove('d-none');
}

/* ============================================
   5. SISTEMA DE PAGO (YAPE + BCP)
   ============================================ */
function abrirCarrito() {
    // Resetear vistas
    const seccionPago = document.getElementById('seccion-pago');
    const listaCarrito = document.getElementById('lista-carrito');
    const resumenPago = document.getElementById('resumen-pago');

    if (seccionPago) seccionPago.classList.add('d-none');
    if (listaCarrito) listaCarrito.classList.remove('d-none');
    
    if (resumenPago) {
        if (carrito.length > 0) resumenPago.classList.remove('d-none');
        else resumenPago.classList.add('d-none');
    }
    
    // Abrir modal
    const modalElement = document.getElementById('modalCarrito');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function mostrarMetodosPago() {
    if (carrito.length === 0) {
        mostrarNotificacion('Agrega productos primero', 'warning');
        return;
    }
    
    // Ocultar resumen, mostrar métodos de pago
    document.getElementById('lista-carrito').classList.add('d-none');
    document.getElementById('resumen-pago').classList.add('d-none');
    
    const seccionPago = document.getElementById('seccion-pago');
    if (seccionPago) {
        seccionPago.classList.remove('d-none');
        seleccionarMetodo('yape');
    }
}

function seleccionarMetodo(metodo) {
    metodoPagoSeleccionado = metodo;
    
    const btnYape = document.getElementById('btn-yape');
    const btnBcp = document.getElementById('btn-bcp');
    
    btnYape.classList.remove('active');
    btnBcp.classList.remove('active');
    
    if (metodo === 'yape') {
        btnYape.classList.add('active');
    } else {
        btnBcp.classList.add('active');
    }
    
    const datosYape = document.getElementById('datos-yape');
    const datosBcp = document.getElementById('datos-bcp');
    
    if (metodo === 'yape') {
        datosYape.classList.remove('d-none');
        datosBcp.classList.add('d-none');
    } else {
        datosYape.classList.add('d-none');
        datosBcp.classList.remove('d-none');
        mostrarCuentaBCP('soles');
    }
}

function mostrarCuentaBCP(tipo) {
    const cuentaSoles = document.getElementById('cuenta-bcp-soles');
    const cuentaCCI = document.getElementById('cuenta-bcp-cci');
    
    if (tipo === 'soles') {
        cuentaSoles.classList.remove('d-none');
        cuentaCCI.classList.add('d-none');
    } else {
        cuentaSoles.classList.add('d-none');
        cuentaCCI.classList.remove('d-none');
    }
}

function confirmarPago() {
    if (carrito.length === 0) return;

    let msg = `*🛒 NUEVO PEDIDO - PICAM MOBILIARIOS*%0A`;
    msg += `================================%0A%0A`;
    
    msg += `*PRODUCTOS:*%0A`;
    carrito.forEach((item, i) => {
        msg += `${i+1}. ${item.nombre}%0A   S/ ${item.precio.toFixed(2)}%0A`;
    });
    
    msg += `%0A--------------------------------%0A`;
    msg += `*TOTAL: S/ ${total.toFixed(2)}*%0A`;
    msg += `--------------------------------%0A%0A`;
    
    if (metodoPagoSeleccionado === 'yape') {
        msg += `💳 *Método de Pago:* YAPE%0A`;
        msg += `📱 *Número:* 916 694 651%0A`;
        msg += `👤 *Titular:* PICAM MOBILIARIOS%0A%0A`;
    } else {
        const radioBcpSoles = document.getElementById('radio-bcp-soles');
        const tipoCuenta = radioBcpSoles && radioBcpSoles.checked ? 'Soles' : 'CCI';
        
        msg += `💳 *Método de Pago:* BCP - ${tipoCuenta}%0A`;
        
        if (tipoCuenta === 'Soles') {
            msg += `🏦 *Cuenta Soles:* 191-08584543-0-54%0A`;
        } else {
            msg += `🔗 *CCI:* 002-191-10858454305455%0A`;
        }
        
        msg += `👤 *Titular:* PICAM MOBILIARIOS%0A%0A`;
    }
    
    msg += `✅ *Pago realizado*%0A`;
    msg += `📸 _Enviando comprobante de pago..._`;

    window.open(`https://wa.me/${WHATSAPP_DUENO}?text=${msg}`, '_blank');

    setTimeout(() => {
        carrito = [];
        total = 0;
        actualizarInterfaz();
        
        const modalElement = document.getElementById('modalCarrito');
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) modal.hide();
        
        mostrarNotificacion('¡Pedido enviado con éxito!', 'success');
    }, 1500);
}

/* ============================================
   6. FORMULARIO DE CONTACTO CON VALIDACIONES
   ============================================ */
function mostrarSubUbicacion() {
    const ubicacion = document.getElementById('ubicacion').value;
    const campoSubUbicacion = document.getElementById('campo-sub-ubicacion');
    const inputSubUbicacion = document.getElementById('sub-ubicacion');
    
    if (ubicacion) {
        campoSubUbicacion.classList.remove('d-none');
        inputSubUbicacion.required = true;
        
        if (ubicacion === 'Lima') {
            inputSubUbicacion.placeholder = 'Distrito (Ej: San Juan de Lurigancho) *';
        } else {
            inputSubUbicacion.placeholder = 'Departamento (Ej: Arequipa, Cusco) *';
        }
    } else {
        campoSubUbicacion.classList.add('d-none');
        inputSubUbicacion.required = false;
    }
}

function validarNombre(input, errorId) {
    const valor = input.value;
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const errorElement = document.getElementById(errorId);
    
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    
    if (valor && !soloLetras.test(valor)) {
        input.classList.add('error');
        errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('error');
        errorElement.classList.add('d-none');
        return true;
    }
}

function validarTelefono(input) {
    const valor = input.value;
    const soloNumeros = /^\d{0,9}$/;
    const errorElement = document.getElementById('error-telefono');
    
    if (!soloNumeros.test(valor)) {
        input.value = valor.slice(0, -1);
        return false;
    }
    
    if (valor.length > 0 && valor.length !== 9) {
        input.classList.add('error');
        errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('error');
        errorElement.classList.add('d-none');
        return true;
    }
}

function validarCorreo(input) {
    const valor = input.value;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById('error-correo');
    
    if (valor && !regexCorreo.test(valor)) {
        input.classList.add('error');
        errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('error');
        errorElement.classList.add('d-none');
        return true;
    }
}

/* ============================================
   7. ENVÍO DE FORMULARIO A WHATSAPP
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        const nombres = document.getElementById('nombres');
        const apellidos = document.getElementById('apellidos');
        const telefono = document.getElementById('telefono');
        const correo = document.getElementById('correo');
        
        if (nombres) {
            nombres.addEventListener('input', function() {
                validarNombre(this, 'error-nombres');
            });
        }
        
        if (apellidos) {
            apellidos.addEventListener('input', function() {
                validarNombre(this, 'error-apellidos');
            });
        }
        
        if (telefono) {
            telefono.addEventListener('input', function() {
                validarTelefono(this);
            });
        }
        
        if (correo) {
            correo.addEventListener('input', function() {
                validarCorreo(this);
            });
        }
        
        form.onsubmit = function(e) {
            e.preventDefault();
            
            const nombresValidos = validarNombre(nombres, 'error-nombres');
            const apellidosValidos = validarNombre(apellidos, 'error-apellidos');
            const telefonoValido = validarTelefono(telefono);
            const correoValido = validarCorreo(correo);
            
            if (!nombresValidos || !apellidosValidos || !telefonoValido || !correoValido) {
                mostrarNotificacion('Por favor, corrige los errores en el formulario', 'danger');
                return;
            }
            
            const nom = nombres.value;
            const ape = apellidos.value;
            const tel = telefono.value;
            const email = correo.value;
            const ubicacion = document.getElementById('ubicacion').value;
            const subUbicacion = document.getElementById('sub-ubicacion').value;
            const descripcion = document.getElementById('descripcion').value;
            
            if (!ubicacion || !subUbicacion) {
                mostrarNotificacion('Por favor, completa tu ubicación', 'warning');
                return;
            }
            
            const texto = `*📋 NUEVA COTIZACIÓN - PICAM MOBILIARIOS*%0A` +
                          `================================%0A%0A` +
                          `*DATOS DEL CLIENTE:*%0A` +
                          `👤 *Nombre:* ${nom} ${ape}%0A` +
                          `📱 *Teléfono:* ${tel}%0A` +
                          `📧 *Correo:* ${email}%0A%0A` +
                          `*UBICACIÓN:*%0A` +
                          `📍 *Región:* ${ubicacion}%0A` +
                          `🗺️ *${ubicacion === 'Lima' ? 'Distrito' : 'Departamento'}:* ${subUbicacion}%0A%0A` +
                          `*DETALLES DEL PROYECTO:*%0A` +
                          `📝 ${descripcion}%0A%0A` +
                          `================================%0A` +
                          `_Enviado desde picammobiliarios.com_`;

            window.open(`https://wa.me/${WHATSAPP_DUENO}?text=${texto}`, '_blank');
            
            form.reset();
            document.getElementById('campo-sub-ubicacion').classList.add('d-none');
            mostrarNotificacion('¡Mensaje enviado con éxito!', 'success');
        };
    }
});

/* ============================================
   8. UTILIDADES
   ============================================ */
function mostrarNotificacion(mensaje, tipo) {
    const iconos = {
        'success': 'check-circle-fill',
        'danger': 'exclamation-triangle-fill',
        'warning': 'exclamation-circle-fill',
        'info': 'info-circle-fill'
    };
    
    const toast = document.createElement('div');
    toast.className = `alert alert-${tipo} shadow-lg position-fixed bottom-0 start-50 translate-middle-x mb-4`;
    toast.style.zIndex = "3000";
    toast.style.borderRadius = "50px";
    toast.style.padding = "12px 30px";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "600";
    toast.style.minWidth = "250px";
    toast.style.textAlign = "center";
    
    toast.innerHTML = `<i class="bi bi-${iconos[tipo]} me-2"></i> ${mensaje}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "0.5s";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* ============================================
   9. NAVBAR SÓLIDO AL SCROLL
   ============================================ */
window.addEventListener('scroll', function() {
    const nav = document.getElementById('mainNav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(30, 61, 43, 0.98)';
        nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
    } else {
        nav.style.background = 'linear-gradient(to bottom, rgba(30, 61, 43, 0.88) 0%, rgba(30, 61, 43, 0.92) 100%)';
        nav.style.boxShadow = '0 2px 25px rgba(20, 40, 30, 0.4)';
    }
});

/* ============================================
   10. INICIALIZACIÓN
   ============================================ */
window.onload = () => {
    navegar('inicio');
    actualizarInterfaz();
    
    console.log(
        "%c 🪑 PICAM MOBILIARIOS | Sistema Web Profesional %c \n%c ✅ Catálogo ordenado | ✅ 100% Responsivo | ✅ Filtros optimizados \n%c Versión 4.0 Final - 2025",
        "color: #FFD700; font-size: 16px; font-weight: bold; background: #1e3d2b; padding: 10px 20px; border-radius: 8px 8px 0 0;",
        "",
        "color: #2d5f3f; font-size: 12px; background: #f0f0f0; padding: 5px 20px;",
        "color: #888; font-size: 10px; font-style: italic; background: #f0f0f0; padding: 5px 20px; border-radius: 0 0 8px 8px;"
    );
};