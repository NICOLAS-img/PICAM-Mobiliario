/* ============================================
   PICAM MOBILIARIOS - JavaScript FINAL
   🔥 VERSIÓN DEFINITIVA 2025
   ✅ Cinta Infinita | ✅ Promos Inteligentes
   ✅ Typing Animation | ✅ WhatsApp con Descuento
   ============================================ */

const CONFIG = {
  whatsapp: '51916694651',
  animationDuration: 300,
  debounceDelay: 150,
  modalPromoDelay: 2000,
  typingSpeed: 30
};

const Utils = {
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  validarSoloLetras(valor) {
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor);
  },

  validarSoloNumeros(valor) {
    return /^\d+$/.test(valor);
  },

  validarEmail(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  },

  mostrarNotificacion(mensaje, tipo = 'info') {
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
    toast.style.cssText = `
      z-index: 3000;
      border-radius: 50px;
      padding: 12px 30px;
      font-size: 14px;
      font-weight: 600;
      min-width: 250px;
      max-width: 90%;
      text-align: center;
      background-color: ${colores[tipo]};
      color: ${tipo === 'warning' ? '#000' : '#fff'};
      border: none;
    `;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `<i class="bi bi-${iconos[tipo]} me-2"></i> ${mensaje}`;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "0.5s";
      setTimeout(() => toast.remove(), 500);
    }, 3000);
  }
};

// ============================================
// NAVEGACIÓN SPA
// ============================================
const Navegacion = {
  currentSection: 'inicio',

  init() {
    window.navegar = (seccion) => this.navegar(seccion);
  },

  navegar(seccion) {
    document.querySelectorAll('.vista-seccion').forEach(sec => {
      sec.classList.add('d-none');
    });
 
    const target = document.getElementById('seccion-' + seccion);
    if (target) {
      target.classList.remove('d-none');
    }
 
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-current', 'false');
    });

    const linkActivo = document.getElementById('link-' + seccion);
    if (linkActivo) {
      linkActivo.classList.add('active');
      linkActivo.setAttribute('aria-current', 'page');
    }
 
    const navbarCollapse = document.getElementById('navbarContent');
    if (navbarCollapse) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) bsCollapse.hide();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.currentSection = seccion;

    // Acciones específicas por sección
    if (seccion === 'nosotros') {
  setTimeout(() => {
    TypingAnimation.init();
    // Activar animación de checks
    document.querySelectorAll('.check-item-final').forEach(item => {
      item.classList.add('check-animate');
    });
  }, CONFIG.animationDuration);
}

    if (seccion === 'inicio' && Galeria.initialized) {
      setTimeout(() => Galeria.actualizarPosicion(), CONFIG.animationDuration);
    }

    // Controlar promos por sección
    PromocionesInteligentes.manejarSeccion(seccion);
  }
};

// ============================================
// 🔥 SISTEMA DE PROMOCIONES INTELIGENTE
// ============================================
const PromocionesInteligentes = {
  popupLateralMostrado: false,

  manejarSeccion(seccion) {
  // Banner flotante SOLO en catálogo - NUNCA en otras secciones
  if (seccion === 'catalogo') {
  BannerFlotante.timeoutId = setTimeout(() => {
    BannerFlotante.mostrar();
  }, 1000);
  } else {
    
    // ← Ocultar Y cancelar timeout pendiente
    BannerFlotante.ocultar();
    if (this.banner) {
    this.banner.classList.remove('show');
    this.banner.style.display = 'none';
    this.banner.style.opacity = '0';     
    this.banner.style.visibility = 'hidden';  
  }
}
    // Pop-up lateral solo en contacto
    if (seccion === 'contacto' && !this.popupLateralMostrado) {
      setTimeout(() => {
        PopupLateral.mostrar();
        this.popupLateralMostrado = true;
      }, 3000);
    } else if (seccion !== 'contacto') {
      PopupLateral.ocultar();
    }
  }
};

// ============================================
// 🔥 CINTA INFINITA (Barra Informativa)
// ============================================
const CintaInfinita = {
  init() {
    const tickerWrapper = document.querySelector('.ticker-wrapper');
    const tickerContent = document.getElementById('tickerContent');
    
    if (!tickerWrapper || !tickerContent) {
      console.error('❌ No se encontró la cinta infinita');
      return;
    }

    // Guardar el HTML original
    const originalHTML = tickerContent.innerHTML;
    
    // Calcular cuántas veces duplicar según el ancho de pantalla
    const contentWidth = tickerContent.scrollWidth;
    const screenWidth = window.innerWidth;
    
    // Duplicar suficientes veces para cubrir 3 pantallas completas
    const timesToDuplicate = Math.ceil((screenWidth * 3) / contentWidth) + 2;
    
    // Crear el contenido duplicado
    let duplicatedContent = '';
    for (let i = 0; i < timesToDuplicate; i++) {
      duplicatedContent += originalHTML;
    }
    
    // Inyectar el contenido duplicado
    tickerContent.innerHTML = duplicatedContent;
    
    console.log(`✅ Cinta infinita inicializada - Contenido duplicado ${timesToDuplicate} veces`);
    
    // Recalcular si cambia el tamaño de ventana
    window.addEventListener('resize', () => {
      this.init();
    });
  }
};

// ============================================
// 🔥 MODAL PROMO GRANDE (Al cargar)
// ============================================
const ModalPromoGrande = {
  init() {
    const modalElement = document.getElementById('modalPromoGrande');
    if (!modalElement) return;

    const yaVisto = sessionStorage.getItem('modalPromoGrandeVisto');
    
    if (!yaVisto) {
      setTimeout(() => {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        sessionStorage.setItem('modalPromoGrandeVisto', 'true');
        console.log('✅ Modal promocional grande mostrado');
      }, CONFIG.modalPromoDelay);
    }
  }
};

// ============================================
// 🔥 BANNER FLOTANTE (Sistema A)
// ============================================
const BannerFlotante = {
  banner: null,
  timeoutId: null,

  init() {
    this.banner = document.getElementById('promoFloatingBanner');
    const closeBtn = document.getElementById('closeFloatingBanner');

    if (!this.banner) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.ocultar());
    }

    console.log('✅ Banner flotante inicializado');
    
    // IMPORTANTE: Asegurar que esté oculto al inicio
    this.banner.classList.remove('show');
  },
mostrar() {
  if (this.banner) {
    this.banner.style.display = 'block';
    this.banner.style.opacity = '1';
    this.banner.style.visibility = 'visible';
    setTimeout(() => {
      this.banner.classList.add('show');
    }, 50);
  }
},
 ocultar() {
  // Cancelar timeout pendiente
  if (this.timeoutId) {
    clearTimeout(this.timeoutId);
    this.timeoutId = null;
  }
  
  if (this.banner) {
    this.banner.classList.remove('show');
    this.banner.style.display = 'none';
    this.banner.style.opacity = '0';
    this.banner.style.visibility = 'hidden';
  }
}
};

// ============================================
// 🔥 POP-UP LATERAL (Sistema B)
// ============================================
const PopupLateral = {
  popup: null,

  init() {
    this.popup = document.getElementById('promoPopupLateral');
    const closeBtn = document.getElementById('closePopupLateral');

    if (!this.popup) return;

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.ocultar());
    }

    console.log('✅ Pop-up lateral inicializado');
  },

  mostrar() {
    if (this.popup) {
      this.popup.classList.add('show');
    }
  },

  ocultar() {
    if (this.popup) {
      this.popup.classList.remove('show');
    }
  }
};

// ============================================
// 🔥 ANIMACIÓN TYPING (Nosotros)
// ============================================
const TypingAnimation = {
  texto: "En PICAM transformamos espacios en experiencias únicas. Somos fabricantes dedicados a crear mobiliario que no solo decora, sino que resiste el ritmo exigente de pollerías, restobares, cevicherías y restaurantes.",
  index: 0,
  initialized: false,

  init() {
    if (this.initialized) return;

    const elemento = document.getElementById('typingText');
    if (!elemento) return;

    this.index = 0;
    elemento.textContent = '';
    
    this.escribir(elemento);
    this.initialized = true;
  },

  escribir(elemento) {
    if (this.index < this.texto.length) {
      elemento.textContent += this.texto.charAt(this.index);
      this.index++;
      setTimeout(() => this.escribir(elemento), CONFIG.typingSpeed);
    }
  },

  reset() {
    this.initialized = false;
  }
};

// ============================================
// GALERÍA
// ============================================
const Galeria = {
  currentIndex: 0,
  items: [],
  track: null,
  initialized: false,

  init() {
    if (this.initialized) return;

    this.track = document.getElementById('galleryTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('galleryIndicators');

    if (!this.track || !prevBtn || !nextBtn) {
      console.error('❌ Elementos de galería no encontrados');
      return;
    }

    this.generarItems();
    
    this.items = Array.from(this.track.querySelectorAll('.material-gallery-item'));
    
    if (this.items.length === 0) {
      console.error('❌ No hay items en galería');
      return;
    }

    this.currentIndex = Math.floor(this.items.length / 2);

    this.generarIndicadores(indicatorsContainer);
    this.setupEventListeners(prevBtn, nextBtn);
    this.setupTouchEvents();

    window.addEventListener('resize', Utils.debounce(() => {
      this.actualizarPosicion();
    }, CONFIG.debounceDelay));

    this.actualizarPosicion();
    this.initialized = true;

    console.log(`✅ Galería inicializada: ${this.items.length} trabajos`);
  },

  generarItems() {
    const galleryItems = this.track.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item) => {
      const img = item.dataset.img;
      const alt = item.dataset.alt;
      const title = item.dataset.title;

      if (img) {
        const div = document.createElement('div');
        div.className = 'material-gallery-item';
        div.style.cssText = 'flex: 0 0 400px; height: 550px;';
        div.innerHTML = `
          <img src="${img}" 
               alt="${alt || 'Trabajo PICAM'}" 
               title="${title || 'PICAM Mobiliarios'}"
               loading="lazy"
               width="400"
               height="550"
               style="object-fit: cover; width: 100%; height: 100%;">
          <div class="material-gallery-label d-flex align-items-center justify-content-center">
            <span class="text-center">${title || 'Proyecto PICAM'}</span>
          </div>
        `;
        
        this.track.appendChild(div);
        item.remove();
      }
    });
  },

  generarIndicadores(container) {
    container.innerHTML = '';
    this.items.forEach((_, i) => {
      const indicator = document.createElement('button');
      indicator.className = 'gallery-indicator';
      indicator.setAttribute('role', 'tab');
      indicator.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
      indicator.addEventListener('click', () => this.irASlide(i));
      container.appendChild(indicator);
    });
  },

  setupEventListeners(prevBtn, nextBtn) {
    const newPrevBtn = prevBtn.cloneNode(true);
    const newNextBtn = nextBtn.cloneNode(true);
    prevBtn.parentNode.replaceChild(newPrevBtn, prevBtn);
    nextBtn.parentNode.replaceChild(newNextBtn, nextBtn);

    newPrevBtn.addEventListener('click', () => this.anterior());
    newNextBtn.addEventListener('click', () => this.siguiente());

    this.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        if (this.currentIndex !== index) this.irASlide(index);
      });
    });
  },

  setupTouchEvents() {
    let startX = 0;
    let isDragging = false;

    this.track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    this.track.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      isDragging = false;
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        diff > 0 ? this.siguiente() : this.anterior();
      }
    }, { passive: true });
  },

  actualizarPosicion() {
    if (!this.items[this.currentIndex]) return;

    const item = this.items[this.currentIndex];
    const centerScreen = this.track.parentElement.offsetWidth / 2;
    const centerItem = item.offsetLeft + (item.offsetWidth / 2);
    const offset = centerScreen - centerItem;

    this.track.style.transform = `translateX(${offset}px)`;

    this.items.forEach((el, index) => {
      el.classList.toggle('active', index === this.currentIndex);
    });

    const indicators = document.querySelectorAll('.gallery-indicator');
    indicators.forEach((el, index) => {
      el.classList.toggle('active', index === this.currentIndex);
      el.setAttribute('aria-selected', index === this.currentIndex ? 'true' : 'false');
    });
  },

  irASlide(index) {
    this.currentIndex = Math.max(0, Math.min(index, this.items.length - 1));
    this.actualizarPosicion();
  },

  siguiente() {
    if (this.currentIndex < this.items.length - 1) {
      this.irASlide(this.currentIndex + 1);
    }
  },

  anterior() {
    if (this.currentIndex > 0) {
      this.irASlide(this.currentIndex - 1);
    }
  }
};

// ============================================
// CATÁLOGO CON BADGES
// ============================================
const Catalogo = {
  init() {
    this.generarProductos();
    this.setupFiltros();
  },

  generarProductos() {
    const grid = document.getElementById('productos-grid');
    if (!grid) return;

    const productos = grid.querySelectorAll('.producto-item');
    
    productos.forEach(producto => {
      const nombre = producto.dataset.nombre;
      const img = producto.dataset.img;
      const alt = producto.dataset.alt;
      const tienePromo = producto.dataset.promo === 'true';
      const descuento = producto.dataset.descuento || '20';
      const promoExtra = producto.dataset.promoExtra || '';

      if (nombre && img) {
        const badgeHTML = tienePromo 
          ? `<div class="producto-badge-descuento">${descuento.includes('x') ? descuento : descuento + '% OFF'}</div>` 
          : '';

        producto.innerHTML = `
          <div class="producto-card">
            ${badgeHTML}
            <figure class="producto-imagen">
              <img src="${img}" alt="${alt || nombre}" loading="lazy">
            </figure>
            <div class="producto-info">
              <h3 class="producto-nombre">${nombre}</h3>
              <button class="btn-solicitar" onclick="ProductoModal.abrir('${nombre}', '${img}', ${tienePromo}, '${descuento}', '${promoExtra}')">
                <i class="bi bi-whatsapp"></i> Solicitar Información
              </button>
            </div>
          </div>
        `;
      }
    });

    console.log(`✅ ${productos.length} productos generados`);
  },

  setupFiltros() {
    const filterNav = document.getElementById('filterNav');
    if (!filterNav) return;

    filterNav.addEventListener('click', (e) => {
      if (e.target.classList.contains('btn-filter')) {
        this.filtrar(e.target.dataset.filter, e.target);
      }
    });
  },

  filtrar(categoria, btn) {
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
      }, CONFIG.animationDuration);
    });
  }
};

// ============================================
// 🔥 MODAL DE PRODUCTO CON DESCUENTO
// ============================================
const ProductoModal = {
  productoSeleccionado: { 
    nombre: '', 
    imagen: '', 
    tienePromo: false, 
    descuento: '', 
    promoExtra: '' 
  },

  init() {
    window.ProductoModal = this;
    window.mostrarCampoUbicacionSolicitud = () => this.mostrarCampoUbicacion();
    window.mostrarPaletaColores = (mostrar) => this.togglePaletaColores(mostrar);
    window.mostrarMensajeLogo = (mostrar) => this.toggleMensajeLogo(mostrar);
    window.actualizarNombreColor = (nombre) => this.actualizarNombreColor(nombre);
    
    this.setupFormulario();
  },

  abrir(nombre, imagen, tienePromo = false, descuento = '', promoExtra = '') {
    this.productoSeleccionado = { nombre, imagen, tienePromo, descuento, promoExtra };

    const modalNombre = document.getElementById('modal-producto-nombre');
    const modalImg = document.getElementById('modal-producto-img');
    const modalPromo = document.getElementById('modal-producto-promo');

    if (modalNombre) modalNombre.textContent = nombre;
    if (modalImg) {
      modalImg.src = imagen;
      modalImg.alt = nombre;
    }

    if (modalPromo) {
      if (tienePromo) {
        modalPromo.classList.remove('d-none');
      } else {
        modalPromo.classList.add('d-none');
      }
    }

    const form = document.getElementById('formSolicitud');
    if (form) form.reset();

    this.ocultarCamposCondicionales();

    const modalElement = document.getElementById('modalSolicitud');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  },

  ocultarCamposCondicionales() {
    const campos = ['campo-detalle-ubicacion', 'campo-colores', 'mensaje-logo'];
    campos.forEach(id => {
      const elem = document.getElementById(id);
      if (elem) elem.classList.add('d-none');
    });
 
    const labelContainer = document.getElementById('nombre-color-seleccionado');
    if (labelContainer) labelContainer.classList.add('d-none');
  },

  mostrarCampoUbicacion() {
    const ubicacion = document.getElementById('ubicacionSolicitud').value;
    const campo = document.getElementById('campo-detalle-ubicacion');
    const input = document.getElementById('detalleUbicacion');
    const label = document.getElementById('label-detalle-ubicacion');

    if (ubicacion) {
      campo.classList.remove('d-none');
      input.required = true;
      
      if (ubicacion === 'Lima') {
        label.textContent = 'Distrito *';
        input.placeholder = 'Ejemplo: San Juan de Lurigancho';
      } else {
        label.textContent = 'Departamento *';
        input.placeholder = 'Ejemplo: Arequipa, Cusco';
      }
    } else {
      campo.classList.add('d-none');
      input.required = false;
    }
  },

  togglePaletaColores(mostrar) {
    const campo = document.getElementById('campo-colores');
    if (mostrar) {
      campo.classList.remove('d-none');
    } else {
      campo.classList.add('d-none');
      document.querySelectorAll('input[name="colorTapizado"]').forEach(radio => {
        radio.checked = false;
      });
    }
  },

  toggleMensajeLogo(mostrar) {
    const mensaje = document.getElementById('mensaje-logo');
    if (mostrar) {
      mensaje.classList.remove('d-none');
    } else {
      mensaje.classList.add('d-none');
    }
  },

  actualizarNombreColor(nombre) {
    const label = document.getElementById('nombre-color-seleccionado');
    if (label) {
      label.textContent = nombre;
      label.classList.remove('d-none');
      label.style.display = 'inline-block';
    }
  },

  setupFormulario() {
    const form = document.getElementById('formSolicitud');
    if (!form) return;

    const cantidadJuegos = document.getElementById('cantidadJuegos');
    const nombreCompleto = document.getElementById('nombreCompleto');
    const detalleUbicacion = document.getElementById('detalleUbicacion');

    if (cantidadJuegos) {
      cantidadJuegos.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '');
      });
    }

    if (nombreCompleto) {
      nombreCompleto.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      });
    }

    if (detalleUbicacion) {
      detalleUbicacion.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      });
    }

    form.onsubmit = (e) => this.enviarSolicitud(e);
  },

  enviarSolicitud(e) {
    e.preventDefault();

    const cantidad = document.getElementById('cantidadJuegos').value;
    const nombre = document.getElementById('nombreCompleto').value;
    const ubicacion = document.getElementById('ubicacionSolicitud').value;
    const detalle = document.getElementById('detalleUbicacion').value;
    const tapizadoRadio = document.querySelector('input[name="tapizado"]:checked');
    const logoPersonalizado = document.querySelector('input[name="logoPersonalizado"]:checked');

    if (!cantidad || parseInt(cantidad) < 1) {
      Utils.mostrarNotificacion('Ingrese una cantidad válida de juegos', 'warning');
      return;
    }

    if (!nombre.trim()) {
      Utils.mostrarNotificacion('Ingrese su nombre completo', 'warning');
      return;
    }

    if (!ubicacion) {
      Utils.mostrarNotificacion('Seleccione su ubicación', 'warning');
      return;
    }

    if (!detalle.trim()) {
      Utils.mostrarNotificacion('Ingrese su distrito o departamento', 'warning');
      return;
    }

    if (!tapizadoRadio) {
      Utils.mostrarNotificacion('Indique si desea tapizado', 'warning');
      return;
    }

    if (tapizadoRadio.value === 'Si') {
      const color = document.querySelector('input[name="colorTapizado"]:checked');
      if (!color) {
        Utils.mostrarNotificacion('Debe seleccionar un color de tapizado', 'warning');
        document.getElementById('campo-colores').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }
    }

    if (!logoPersonalizado) {
      Utils.mostrarNotificacion('Indique si desea logo personalizado', 'warning');
      return;
    }

    let mensaje = `*🛋️ SOLICITUD DE INFORMACIÓN - PICAM*%0A`;
    mensaje += `================================%0A%0A`;
    mensaje += `*PRODUCTO:*%0A📦 ${this.productoSeleccionado.nombre}%0A%0A`;

    // 🔥 AGREGAR DESCUENTO SI TIENE PROMO
    if (this.productoSeleccionado.tienePromo) {
      mensaje += `*🔥 PRODUCTO EN PROMOCIÓN*%0A`;
      mensaje += `💰 Descuento Aplicable: *${this.productoSeleccionado.descuento}${this.productoSeleccionado.descuento.includes('x') ? '' : '% OFF'}*%0A`;
      if (this.productoSeleccionado.promoExtra) {
        mensaje += `🎁 Beneficio Extra: *${this.productoSeleccionado.promoExtra}*%0A`;
      }
      mensaje += `%0A`;
    }

    mensaje += `*CANTIDAD:* ${cantidad} juegos%0A%0A`;
    mensaje += `*DATOS DEL CLIENTE:*%0A`;
    mensaje += `👤 ${nombre}%0A`;
    mensaje += `📍 ${ubicacion === 'Lima' ? 'Distrito' : 'Departamento'}: ${detalle}%0A%0A`;

    if (tapizadoRadio.value === 'Si') {
      const color = document.querySelector('input[name="colorTapizado"]:checked');
      mensaje += `*TAPIZADO:* Sí - Color: *${color.value}*%0A`;
    } else {
      mensaje += `*TAPIZADO:* No%0A`;
    }

    mensaje += `*LOGO PERSONALIZADO:* ${logoPersonalizado.value}%0A`;
    if (logoPersonalizado.value === 'Si') {
      mensaje += `📸 _Por favor, adjunte la imagen del logo_`;
    }

    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${mensaje}`, '_blank');

    const modalElement = document.getElementById('modalSolicitud');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    setTimeout(() => {
      Utils.mostrarNotificacion('¡Solicitud enviada con éxito!', 'success');
    }, 500);
  }
};

// ============================================
// FORMULARIO CONTACTO
// ============================================
const FormularioContacto = {
  init() {
    window.mostrarSubUbicacion = () => this.mostrarSubUbicacion();
    
    const form = document.getElementById('contactForm');
    if (!form) return;

    this.setupValidaciones();
    form.onsubmit = (e) => this.enviar(e);
  },

  setupValidaciones() {
    const nombreContacto = document.getElementById('nombre-contacto');
    const telefono = document.getElementById('telefono');
    const subUbicacion = document.getElementById('sub-ubicacion');

    if (nombreContacto) {
      nombreContacto.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      });
    }

    if (telefono) {
      telefono.addEventListener('input', function() {
        this.value = this.value.replace(/[^\d]/g, '').slice(0, 9);
      });
    }

    if (subUbicacion) {
      subUbicacion.addEventListener('input', function() {
        this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      });
    }
  },

  mostrarSubUbicacion() {
    const ubicacion = document.getElementById('ubicacion').value;
    const campo = document.getElementById('campo-sub-ubicacion');
    const input = document.getElementById('sub-ubicacion');

    if (ubicacion) {
      campo.classList.remove('d-none');
      input.required = true;
      input.placeholder = ubicacion === 'Lima' 
        ? 'Distrito (Ej: San Juan de Lurigancho) *'
        : 'Departamento (Ej: Arequipa, Cusco) *';
    } else {
      campo.classList.add('d-none');
      input.required = false;
    }
  },

  enviar(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre-contacto').value.trim();
    const tel = document.getElementById('telefono').value.trim();
    const email = document.getElementById('correo').value.trim();
    const ubicacion = document.getElementById('ubicacion').value;
    const subUbic = document.getElementById('sub-ubicacion').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    if (!nombre) {
      Utils.mostrarNotificacion('Ingrese su nombre completo', 'warning');
      return;
    }

    if (!tel || tel.length !== 9) {
      Utils.mostrarNotificacion('Ingrese un teléfono válido de 9 dígitos', 'warning');
      return;
    }

    if (!Utils.validarEmail(email)) {
      Utils.mostrarNotificacion('Ingrese un correo válido', 'warning');
      return;
    }

    if (!ubicacion) {
      Utils.mostrarNotificacion('Seleccione su ubicación', 'warning');
      return;
    }

    if (!subUbic) {
      Utils.mostrarNotificacion(`Ingrese su ${ubicacion === 'Lima' ? 'distrito' : 'departamento'}`, 'warning');
      return;
    }

    if (!descripcion) {
      Utils.mostrarNotificacion('Describa su proyecto o consulta', 'warning');
      return;
    }

    const texto = `*📋 NUEVA COTIZACIÓN - PICAM MOBILIARIOS*%0A` +
      `================================%0A%0A` +
      `*DATOS DEL CLIENTE:*%0A` +
      `👤 *Nombre:* ${nombre}%0A` +
      `📱 *Teléfono:* ${tel}%0A` +
      `📧 *Correo:* ${email}%0A%0A` +
      `*UBICACIÓN:*%0A` +
      `📍 *Región:* ${ubicacion}%0A` +
      `🗺️ *${ubicacion === 'Lima' ? 'Distrito' : 'Departamento'}:* ${subUbic}%0A%0A` +
      `*DETALLES DEL PROYECTO:*%0A` +
      `📝 ${descripcion}%0A%0A` +
      `================================%0A` +
      `_Enviado desde picammobiliarios.com_`;

    window.open(`https://wa.me/${CONFIG.whatsapp}?text=${texto}`, '_blank');

    document.getElementById('contactForm').reset();
    document.getElementById('campo-sub-ubicacion').classList.add('d-none');
    Utils.mostrarNotificacion('¡Mensaje enviado con éxito!', 'success');
  }
};

// ============================================
// CONTADORES ANIMADOS
// ============================================
const Contadores = {
  activated: false,

  activar() {
    if (this.activated) return;

    const contadores = document.querySelectorAll('.counter');
    
    contadores.forEach(contador => {
      const target = parseInt(contador.getAttribute('data-target'));
      if (isNaN(target)) return;
      
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

    this.activated = true;
  },

  reset() {
    this.activated = false;
  }
};

// ============================================
// NAVBAR SCROLL
// ============================================
const NavbarScroll = {
  init() {
    window.addEventListener('scroll', Utils.debounce(() => {
      const nav = document.getElementById('mainNav');
      if (window.scrollY > 50) {
        nav.style.background = 'rgba(30, 61, 43, 0.98)';
        nav.style.boxShadow = '0 4px 30px rgba(0,0,0,0.3)';
      } else {
        nav.style.background = 'linear-gradient(to bottom, rgba(30, 61, 43, 0.88) 0%, rgba(30, 61, 43, 0.92) 100%)';
        nav.style.boxShadow = '0 2px 25px rgba(20, 40, 30, 0.4)';
      }
    }, 100));
  }
};

// ============================================
// SCROLL TO TOP
// ============================================
const ScrollToTop = {
  init() {
    const btn = document.getElementById('scrollToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
      const catalogoSeccion = document.getElementById('seccion-catalogo');
      const isCatalogoVisible = catalogoSeccion && !catalogoSeccion.classList.contains('d-none');
      
      if (isCatalogoVisible && window.pageYOffset > 300) {
        btn.classList.add('show');
      } else {
        btn.classList.remove('show');
      }
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
};

// ============================================
// INICIALIZACIÓN GLOBAL
// ============================================
const App = {
  init() {
    Navegacion.init();
    CintaInfinita.init();              // 🔥 NUEVO
    ModalPromoGrande.init();           // 🔥 NUEVO
    BannerFlotante.init();             // 🔥 NUEVO (Sistema A)
    PopupLateral.init();               // 🔥 NUEVO (Sistema B)
    Galeria.init();
    Catalogo.init();
    ProductoModal.init();
    FormularioContacto.init();
    NavbarScroll.init();
    ScrollToTop.init();
    
    Navegacion.navegar('inicio');

    console.log(
      "%c 🪑 PICAM MOBILIARIOS | VERSIÓN FINAL 2025 %c \n" +
      "%c ✅ Cinta Infinita Brillante | ✅ Modal Promo Grande \n" +
      "%c ✅ Banner Flotante (Catálogo) | ✅ Pop-up Lateral (Contacto) \n" +
      "%c ✅ Typing Animation | ✅ WhatsApp con Descuento \n" +
      "%c 🔥 100% RESPONSIVE | 🔥 ESCALABLE | 🔥 PROFESIONAL \n" +
      "%c Versión Final - 2025",
      "color: #FFD700; font-size: 16px; font-weight: bold; background: #1e3d2b; padding: 10px 20px; border-radius: 8px 8px 0 0;",
      "",
      "color: #2d5f3f; font-size: 11px; background: #f0f0f0; padding: 5px 20px;",
      "color: #FF6B35; font-size: 11px; font-weight: bold; background: #f0f0f0; padding: 5px 20px;",
      "color: #4ade80; font-size: 11px; font-weight: bold; background: #f0f0f0; padding: 5px 20px;",
      "color: #E63946; font-size: 11px; font-weight: bold; background: #f0f0f0; padding: 5px 20px;",
      "color: #888; font-size: 10px; font-style: italic; background: #f0f0f0; padding: 5px 20px; border-radius: 0 0 8px 8px;"
    );
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}