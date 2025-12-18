let carrito = [];
let total = 0;

function navegar(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.vista-seccion').forEach(sec => sec.classList.add('d-none'));
    // Mostrar la sección seleccionada
    document.getElementById('seccion-' + seccion).classList.remove('d-none');
    // Actualizar navegación activa
    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
    document.getElementById('link-' + seccion).classList.add('active');
}

function filtrar(categoria, btn) {
    // Remover activo de todos los botones de filtro
    document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Mostrar/ocultar items
    if (categoria === 'todos') {
        document.querySelectorAll('.item-prod').forEach(item => item.style.display = 'block');
    } else {
        document.querySelectorAll('.item-prod').forEach(item => {
            item.style.display = (item.dataset.cat === categoria) ? 'block' : 'none';
        });
    }
}

function agregarAlCarrito(nombre, precio, img) {
    carrito.push({ nombre, precio, img });
    total += precio;
    updateCart();
}

function updateCart() {
    document.getElementById('cart-count').textContent = carrito.length;
    document.getElementById('cart-total-price').textContent = 'S/ ' + total.toFixed(2);
    // Actualizar lista del carrito
    let lista = document.getElementById('lista-carrito');
    if (carrito.length === 0) {
        lista.innerHTML = '<p class="text-center">El carrito está vacío.</p>';
    } else {
        lista.innerHTML = carrito.map(item => `
            <div class="d-flex align-items-center mb-2">
                <img src="${item.img}" class="img-thumbnail me-3" style="width: 50px; height: 50px; object-fit: cover;">
                <div>
                    <h6 class="mb-0">${item.nombre}</h6>
                    <small>S/ ${item.precio.toFixed(2)}</small>
                </div>
            </div>
        `).join('');
    }
}

function abrirCarrito() {
    let modal = new bootstrap.Modal(document.getElementById('modalCarrito'));
    modal.show();
}

function mostrarYape() {
    document.getElementById('seccion-yape').classList.remove('d-none');
}

function generarBoleta() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text('Boleta de Compra', 20, 20);
    doc.text('Productos:', 20, 40);
    let y = 50;
    carrito.forEach(item => {
        doc.text(`${item.nombre} - S/ ${item.precio}`, 20, y);
        y += 10;
    });
    doc.text(`Total: S/ ${total.toFixed(2)}`, 20, y + 10);
    doc.save('boleta.pdf');
}

window.onload = () => {
    navegar('inicio');
    updateCart();
    
    // Handle contact form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value.trim();
            const celular = document.getElementById('celular').value.trim();
            const mensaje = document.getElementById('mensaje').value.trim();
            
            if (!nombre || !celular || !mensaje) {
                alert('Por favor, completa todos los campos.');
                return;
            }
            
            alert('¡Gracias por tu consulta! Te contactaremos pronto.');
            contactForm.reset();
        });
    }
};