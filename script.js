/* ============================================
   PICAM MOBILIARIOS - JavaScript Optimizado
   ✅ Navegación SPA | ✅ Galería corregida
   ✅ Modal de solicitud | ✅ Validaciones
   ============================================ */

// Constantes globales
const WHATSAPP_DUENO = '51916694651';

// Estado global del modal de solicitud
let productoSeleccionado = {
    nombre: '',
    imagen: ''
};

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
    if (target) {
        target.classList.remove('d-none');
    }
    
    // Actualizar links del Navbar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        link.setAttribute('aria-current', 'false');
    });
    
    const linkActivo = document.getElementById('link-' + seccion);
    if (linkActivo) {
        linkActivo.classList.add('active');
        linkActivo.setAttribute('aria-current', 'page');
    }
    
    // Cerrar menú hamburguesa en móviles
    const navbarCollapse = document.getElementById('navbarContent');
    if (navbarCollapse) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) bsCollapse.hide();
    }
    
    // Scroll suave al inicio
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // Activar animaciones si es sección nosotros
    if (seccion === 'nosotros') {
        setTimeout(activarContadores, 300);
    }
    
    // Reiniciar galería si es inicio
    if (seccion === 'inicio') {
        setTimeout(() => {
            if (galleryInitialized && galleryTrack) {
                updateGalleryPosition();
            }
        }, 300);
    }
}

/* ============================================
   2. GALERÍA MATERIAL FOCUS - VERSIÓN CORREGIDA
   ============================================ */
let currentIndex = 0;
let galleryItems = [];
let galleryTrack = null;
let galleryInitialized = false;
let updateGalleryPosition = null; // Función global para actualizar posición

function initGallery() {
    if (galleryInitialized) {
        console.log('⚠️ Galería ya inicializada');
        return;
    }

    galleryTrack = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('galleryIndicators');

    if (!galleryTrack || !prevBtn || !nextBtn) {
        console.error('❌ No se encontraron elementos de galería');
        return;
    }

    if (galleryTrack.parentElement) {
        galleryTrack.parentElement.style.justifyContent = 'flex-start';
        galleryTrack.parentElement.style.alignItems = 'center';
    }

    galleryItems = Array.from(galleryTrack.querySelectorAll('.material-gallery-item'));
    const totalItems = galleryItems.length;

    if (totalItems === 0) {
        console.error('❌ No se encontraron items en la galería');
        return;
    }

    currentIndex = Math.floor(totalItems / 2);

    let startX = 0;
    let isDragging = false;

    indicatorsContainer.innerHTML = '';
    galleryItems.forEach((_, i) => {
        const indicator = document.createElement('button');
        indicator.className = 'gallery-indicator';
        indicator.setAttribute('role', 'tab');
        indicator.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    });

    const indicators = indicatorsContainer.querySelectorAll('.gallery-indicator');

    function updateGallery() {
        if (!galleryItems[currentIndex]) return;
        
        const item = galleryItems[currentIndex];
        const centerScreen = galleryTrack.parentElement.offsetWidth / 2;
        const centerItem = item.offsetLeft + (item.offsetWidth / 2);
        const offset = centerScreen - centerItem;

        galleryTrack.style.transform = `translateX(${offset}px)`;

        galleryItems.forEach((el, index) => {
            el.classList.toggle('active', index === currentIndex);
        });
        
        indicators.forEach((el, index) => {
            el.classList.toggle('active', index === currentIndex);
            el.setAttribute('aria-selected', index === currentIndex ? 'true' : 'false');
        });
    }

    // Exportar función para uso externo
    updateGalleryPosition = updateGallery;

    function goToSlide(index) {
        currentIndex = Math.max(0, Math.min(index, totalItems - 1));
        updateGallery();
    }

    function nextSlide() {
        if (currentIndex < totalItems - 1) {
            goToSlide(currentIndex + 1);
        }
    }

    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        }
    }

    // Limpiar eventos anteriores clonando nodos
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    newPrevBtn.addEventListener('click', prevSlide);
    newNextBtn.addEventListener('click', nextSlide);

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            if (currentIndex !== index) goToSlide(index);
        });
    });

    galleryTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });

    galleryTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextSlide() : prevSlide();
        }
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateGallery, 100);
    });

    setTimeout(updateGallery, 100);

    galleryInitialized = true;

    console.log(`✅ Galería PICAM lista: ${totalItems} trabajos cargados`);
}

/* ============================================
   3. CONTADOR ANIMADO (+500 PROYECTOS)
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
   4. FILTROS DE CATÁLOGO CON ANIMACIÓN
   ============================================ */
function filtrar(categoria, btn) {
    document.querySelectorAll('.btn-filter').forEach(b => { 
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    
    const productos = document.querySelectorAll('.producto-item'); 
    
    productos.forEach((producto, index) => {
        const categoriaProducto = producto.getAttribute('data-cat');
        
        producto.style.opacity = '0'; 
        producto.style.transform = 'translateY(20px)';
        producto.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            if (categoria === 'todos' || categoriaProducto === categoria) {
                producto.style.display = 'block';
                
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
   5. MODAL DE SOLICITUD DE INFORMACIÓN
   ============================================ */
function abrirFormularioSolicitud(nombreProducto, imagenProducto) {
    productoSeleccionado.nombre = nombreProducto;
    productoSeleccionado.imagen = imagenProducto;
    
    const modalNombre = document.getElementById('modal-producto-nombre');
    const modalImg = document.getElementById('modal-producto-img');
    
    if (modalNombre) modalNombre.textContent = nombreProducto;
    if (modalImg) {
        modalImg.src = imagenProducto;
        modalImg.alt = nombreProducto;
    }
    
    const form = document.getElementById('formSolicitud');
    if (form) form.reset();
    
    ocultarCamposCondicionales();
    
    const modalElement = document.getElementById('modalSolicitud');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
    }
}

function ocultarCamposCondicionales() {
    const campoDetalleUbicacion = document.getElementById('campo-detalle-ubicacion');
    const campoColores = document.getElementById('campo-colores');
    const mensajeLogo = document.getElementById('mensaje-logo');
    
    if (campoDetalleUbicacion) campoDetalleUbicacion.classList.add('d-none');
    if (campoColores) campoColores.classList.add('d-none');
    if (mensajeLogo) mensajeLogo.classList.add('d-none');
}

/* ============================================
   6. MOSTRAR/OCULTAR CAMPOS CONDICIONALES
   ============================================ */
function mostrarCampoUbicacionSolicitud() {
    const ubicacion = document.getElementById('ubicacionSolicitud').value;
    const campoDetalleUbicacion = document.getElementById('campo-detalle-ubicacion');
    const inputDetalleUbicacion = document.getElementById('detalleUbicacion');
    const labelDetalleUbicacion = document.getElementById('label-detalle-ubicacion');
    
    if (ubicacion) {
        campoDetalleUbicacion.classList.remove('d-none');
        inputDetalleUbicacion.required = true;
        
        if (ubicacion === 'Lima') {
            labelDetalleUbicacion.textContent = 'Distrito *';
            inputDetalleUbicacion.placeholder = 'Ejemplo: San Juan de Lurigancho';
        } else {
            labelDetalleUbicacion.textContent = 'Departamento *';
            inputDetalleUbicacion.placeholder = 'Ejemplo: Arequipa, Cusco';
        }
    } else {
        campoDetalleUbicacion.classList.add('d-none');
        inputDetalleUbicacion.required = false;
    }
}

function mostrarPaletaColores(mostrar) {
    const campoColores = document.getElementById('campo-colores');
    if (mostrar) {
        campoColores.classList.remove('d-none');
    } else {
        campoColores.classList.add('d-none');
        document.querySelectorAll('input[name="colorTapizado"]').forEach(radio => {
            radio.checked = false;
        });
    }
}

function mostrarMensajeLogo(mostrar) {
    const mensajeLogo = document.getElementById('mensaje-logo');
    if (mostrar) {
        mensajeLogo.classList.remove('d-none');
    } else {
        mensajeLogo.classList.add('d-none');
    }
}

/* ============================================
   7. VALIDACIONES DEL FORMULARIO DE SOLICITUD
   ============================================ */
function validarSoloLetras(input, errorId) {
    const valor = input.value;
    const soloLetras = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    const errorElement = document.getElementById(errorId);
    
    input.value = input.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
    
    if (valor && !soloLetras.test(valor)) {
        input.classList.add('is-invalid');
        if (errorElement) errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('is-invalid');
        if (errorElement) errorElement.classList.add('d-none');
        return true;
    }
}

function validarSoloNumeros(input, errorId) {
    const valor = input.value;
    const soloNumeros = /^\d+$/;
    const errorElement = document.getElementById(errorId);
    
    input.value = valor.replace(/[^\d]/g, '');
    
    if (valor && (!soloNumeros.test(valor) || parseInt(valor) < 1)) {
        input.classList.add('is-invalid');
        if (errorElement) errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('is-invalid');
        if (errorElement) errorElement.classList.add('d-none');
        return true;
    }
}

/* ============================================
   8. ENVÍO DEL FORMULARIO DE SOLICITUD
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    const formSolicitud = document.getElementById('formSolicitud');
    
    if (formSolicitud) {
        const cantidadJuegos = document.getElementById('cantidadJuegos');
        const nombreCompleto = document.getElementById('nombreCompleto');
        const detalleUbicacion = document.getElementById('detalleUbicacion');
        
        if (cantidadJuegos) {
            cantidadJuegos.addEventListener('input', function() {
                validarSoloNumeros(this, 'error-cantidad');
            });
        }
        
        if (nombreCompleto) {
            nombreCompleto.addEventListener('input', function() {
                validarSoloLetras(this, 'error-nombre-completo');
            });
        }
        
        if (detalleUbicacion) {
            detalleUbicacion.addEventListener('input', function() {
                validarSoloLetras(this, 'error-ubicacion');
            });
        }
        
        formSolicitud.onsubmit = function(e) {
            e.preventDefault();
            
            const cantidad = document.getElementById('cantidadJuegos').value;
            const nombre = document.getElementById('nombreCompleto').value;
            const ubicacion = document.getElementById('ubicacionSolicitud').value;
            const detalle = document.getElementById('detalleUbicacion').value;
            const logoPersonalizado = document.querySelector('input[name="logoPersonalizado"]:checked');
            
            if (!cantidad || parseInt(cantidad) < 1) {
                mostrarNotificacion('Ingrese una cantidad válida de juegos', 'warning');
                return;
            }
            
            if (!nombre.trim()) {
                mostrarNotificacion('Ingrese su nombre completo', 'warning');
                return;
            }
            
            if (!ubicacion) {
                mostrarNotificacion('Seleccione su ubicación', 'warning');
                return;
            }
            
            if (!detalle.trim()) {
                mostrarNotificacion('Ingrese su distrito o departamento', 'warning');
                return;
            }
            
            if (!logoPersonalizado) {
                mostrarNotificacion('Indique si desea logo personalizado', 'warning');
                return;
            }
            
            let mensaje = `*🛋️ SOLICITUD DE INFORMACIÓN - PICAM*%0A`;
            mensaje += `================================%0A%0A`;
            mensaje += `*PRODUCTO:*%0A📦 ${productoSeleccionado.nombre}%0A%0A`;
            mensaje += `*CANTIDAD:* ${cantidad} juegos%0A%0A`;
            mensaje += `*DATOS DEL CLIENTE:*%0A`;
            mensaje += `👤 ${nombre}%0A`;
            mensaje += `📍 ${ubicacion === 'Lima' ? 'Distrito' : 'Departamento'}: ${detalle}%0A%0A`;
            
            const tapizado = document.querySelector('input[name="tapizado"]:checked');
            if (tapizado) {
                if (tapizado.value === 'Si') {
                    const color = document.querySelector('input[name="colorTapizado"]:checked');
                    if (color) {
                        mensaje += `*TAPIZADO:* Sí - Color ${color.value}%0A`;
                    } else {
                        mensaje += `*TAPIZADO:* Sí%0A`;
                    }
                } else {
                    mensaje += `*TAPIZADO:* No%0A`;
                }
            }
            
            mensaje += `*LOGO PERSONALIZADO:* ${logoPersonalizado.value}%0A`;
            if (logoPersonalizado.value === 'Si') {
                mensaje += `📸 _Por favor, adjunte la imagen del logo_`;
            }
            
            window.open(`https://wa.me/${WHATSAPP_DUENO}?text=${mensaje}`, '_blank');
            
            const modalElement = document.getElementById('modalSolicitud');
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
            
            setTimeout(() => {
                mostrarNotificacion('¡Solicitud enviada con éxito!', 'success');
            }, 500);
        };
    }
});

/* ============================================
   9. FORMULARIO DE CONTACTO CON VALIDACIONES
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
        input.classList.add('is-invalid');
        errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('is-invalid');
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
        input.classList.add('is-invalid');
        errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('is-invalid');
        errorElement.classList.add('d-none');
        return true;
    }
}

function validarCorreo(input) {
    const valor = input.value;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const errorElement = document.getElementById('error-correo');
    
    if (valor && !regexCorreo.test(valor)) {
        input.classList.add('is-invalid');
        errorElement.classList.remove('d-none');
        return false;
    } else {
        input.classList.remove('is-invalid');
        errorElement.classList.add('d-none');
        return true;
    }
}

/* ============================================
   10. ENVÍO DE FORMULARIO DE CONTACTO
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
   11. SISTEMA DE NOTIFICACIONES
   ============================================ */
function mostrarNotificacion(mensaje, tipo) {
    const iconos = {
        'success': 'check-circle-fill',
        'danger': 'exclamation-triangle-fill',
        'warning': 'exclamation-circle-fill',
        'info': 'info-circle-fill'
    };
    
    const colores = {
        'success': '#198754',
        'danger': '#dc3545',
        'warning': '#ffc107',
        'info': '#0dcaf0'
    };
    
    const toast = document.createElement('div');
    toast.className = `alert alert-${tipo} shadow-lg position-fixed bottom-0 start-50 translate-middle-x mb-4`;
    toast.style.zIndex = "3000";
    toast.style.borderRadius = "50px";
    toast.style.padding = "12px 30px";
    toast.style.fontSize = "14px";
    toast.style.fontWeight = "600";
    toast.style.minWidth = "250px";
    toast.style.maxWidth = "90%";
    toast.style.textAlign = "center";
    toast.style.backgroundColor = colores[tipo];
    toast.style.color = tipo === 'warning' ? '#000' : '#fff';
    toast.style.border = 'none';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    
    toast.innerHTML = `<i class="bi bi-${iconos[tipo]} me-2"></i> ${mensaje}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transition = "0.5s";
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

/* ============================================
   12. NAVBAR SÓLIDO AL SCROLL
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
   13. INICIALIZACIÓN GLOBAL
   ============================================ */
window.onload = () => {
    navegar('inicio');
    initGallery();
    
    console.log(
        "%c 🪑 PICAM MOBILIARIOS | Sistema Web Profesional %c \n" +
        "%c ✅ SEO Optimizado | ✅ 100% Responsivo | ✅ Sin Carrito \n" +
        "%c ✅ Modal de Solicitud | ✅ Galería 3D | ✅ Validaciones \n" +
        "%c Versión 5.0 Final - 2025",
        "color: #FFD700; font-size: 16px; font-weight: bold; background: #1e3d2b; padding: 10px 20px; border-radius: 8px 8px 0 0;",
        "",
        "color: #2d5f3f; font-size: 12px; background: #f0f0f0; padding: 5px 20px;",
        "color: #2d5f3f; font-size: 12px; background: #f0f0f0; padding: 5px 20px;",
        "color: #888; font-size: 10px; font-style: italic; background: #f0f0f0; padding: 5px 20px; border-radius: 0 0 8px 8px;"
    );
};