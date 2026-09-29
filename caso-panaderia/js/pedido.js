document.addEventListener("DOMContentLoaded", function () {

    // Catálogo de productos
    const catalogo = [
        {
            id: 1,
            nombre: "Pan de masa madre",
            descripcion: "Pan artesanal de fermentación natural.",
            precio: 18,
            emoji: "🍞"
        },
        {
            id: 2,
            nombre: "Caja de alfajores",
            descripcion: "Deliciosos alfajores para compartir.",
            precio: 24,
            emoji: "🍪"
        },
        {
            id: 3,
            nombre: "Torta pequeña",
            descripcion: "Ideal para ocasiones especiales.",
            precio: 45,
            emoji: "🎂"
        }
    ];

    const formulario = document.getElementById("formPedido");
    const contenedorCatalogo = document.getElementById("catalogo");

    // Obtener la fecha actual en formato YYYY-MM-DD
    const hoy = new Date();
    const fechaHoy = hoy.getFullYear() + "-" +
        String(hoy.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoy.getDate()).padStart(2, "0");

    document.getElementById("fecha").min = fechaHoy;

    // Generar las tarjetas de productos
    for (let producto of catalogo) {
        contenedorCatalogo.innerHTML += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card producto shadow-sm">
                    <div class="card-body">
                        <div class="text-center display-4 mb-2">${producto.emoji}</div>
                        <h3 class="h5 card-title">${producto.nombre}</h3>
                        <p class="text-muted small">${producto.descripcion}</p>
                        <p class="precio">S/ ${producto.precio.toFixed(2)}</p>

                        <div class="form-check mb-2">
                            <input class="form-check-input seleccionar-producto"
                                   type="checkbox" id="producto${producto.id}"
                                   value="${producto.id}">
                            <label class="form-check-label" for="producto${producto.id}">
                                Agregar al pedido
                            </label>
                        </div>

                        <label for="cantidad${producto.id}" class="form-label">
                            Cantidad
                        </label>
                        <input type="number" class="form-control cantidad"
                               id="cantidad${producto.id}" min="1" max="10"
                               step="1" value="1" disabled>

                        <div class="invalid-feedback" id="errorCantidad${producto.id}">
                            Ingrese una cantidad entera entre 1 y 10.
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Mostrar un monto en soles con dos decimales
    function moneda(monto) {
        return "S/ " + monto.toFixed(2);
    }

    // Leer los productos seleccionados
    function leerProductos() {
        const productosElegidos = [];

        for (let producto of catalogo) {
            const seleccionado = document.getElementById("producto" + producto.id).checked;
            const cantidad = Number(document.getElementById("cantidad" + producto.id).value);

            if (seleccionado) {
                productosElegidos.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    cantidad: cantidad
                });
            }
        }

        return productosElegidos;
    }

    // Validar las cantidades
    function validarCantidades(productos) {
        let valido = true;

        for (let producto of catalogo) {
            const checkbox = document.getElementById("producto" + producto.id);
            const campoCantidad = document.getElementById("cantidad" + producto.id);

            campoCantidad.classList.remove("is-invalid");

            if (checkbox.checked) {
                const cantidad = Number(campoCantidad.value);

                if (!Number.isInteger(cantidad) || cantidad < 1 || cantidad > 10) {
                    campoCantidad.classList.add("is-invalid");
                    valido = false;
                }
            }
        }

        return valido;
    }

    // Calcular subtotal
    function calcularSubtotal(productos) {
        let subtotal = 0;

        for (let producto of productos) {
            subtotal += producto.precio * producto.cantidad;
        }

        return subtotal;
    }

    // Calcular descuento
    function calcularDescuento(subtotal) {
        let descuento = 0;

        if (subtotal >= 100) {
            descuento = subtotal * 0.10;
        }

        return descuento;
    }

    // Calcular costo de reparto
    function calcularReparto(modalidad) {
        let costo = 0;

        if (modalidad === "reparto") {
            costo = 8;
        }

        return costo;
    }

    // Calcular total
    function calcularTotal(subtotal, descuento, reparto) {
        return subtotal - descuento + reparto;
    }

    // Actualizar resumen al interactuar con el formulario
    function actualizarResumen() {
        const productos = leerProductos();
        const subtotal = calcularSubtotal(productos);
        const descuento = calcularDescuento(subtotal);
        const modalidad = document.getElementById("modalidad").value;
        const reparto = calcularReparto(modalidad);
        const total = calcularTotal(subtotal, descuento, reparto);

        const detalle = document.getElementById("detalleResumen");

        if (productos.length === 0) {
            detalle.textContent = "Seleccione productos para ver el resumen.";
        } else {
            detalle.innerHTML = "";

            for (let producto of productos) {
                detalle.innerHTML += `
                    <div class="d-flex justify-content-between mb-1">
                        <span>${producto.nombre} x ${producto.cantidad}</span>
                        <span>${moneda(producto.precio * producto.cantidad)}</span>
                    </div>
                `;
            }
        }

        document.getElementById("subtotal").textContent = moneda(subtotal);
        document.getElementById("descuento").textContent = moneda(descuento);
        document.getElementById("reparto").textContent = moneda(reparto);
        document.getElementById("total").textContent = moneda(total);
    }

    // Activar o desactivar la cantidad según el checkbox
    for (let producto of catalogo) {
        const checkbox = document.getElementById("producto" + producto.id);
        const campoCantidad = document.getElementById("cantidad" + producto.id);

        checkbox.addEventListener("change", function () {
            campoCantidad.disabled = !checkbox.checked;
            campoCantidad.classList.remove("is-invalid");
            document.getElementById("errorProductos").textContent = "";
            actualizarResumen();
        });

        campoCantidad.addEventListener("input", actualizarResumen);
        campoCantidad.addEventListener("change", actualizarResumen);
    }

    document.getElementById("modalidad").addEventListener("change", actualizarResumen);

    // Validar y enviar el formulario
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre = document.getElementById("nombre");
        const correo = document.getElementById("correo");
        const fecha = document.getElementById("fecha");
        const modalidad = document.getElementById("modalidad");

        let formularioValido = true;

        // Validar nombre
        nombre.classList.remove("is-invalid");
        if (nombre.value.trim().length < 3 || nombre.value.trim().length > 60) {
            nombre.classList.add("is-invalid");
            formularioValido = false;
        }

        // Validar correo
        correo.classList.remove("is-invalid");
        if (!correo.checkValidity() || correo.value.trim() === "") {
            correo.classList.add("is-invalid");
            formularioValido = false;
        }

        // Validar fecha
        fecha.classList.remove("is-invalid");
        if (fecha.value === "" || fecha.value < fechaHoy) {
            fecha.classList.add("is-invalid");
            formularioValido = false;
        }

        // Validar modalidad
        modalidad.classList.remove("is-invalid");
        if (modalidad.value !== "retiro" && modalidad.value !== "reparto") {
            modalidad.classList.add("is-invalid");
            formularioValido = false;
        }

        // Validar selección de productos
        const productos = leerProductos();
        const errorProductos = document.getElementById("errorProductos");

        if (productos.length === 0) {
            errorProductos.textContent = "Debe seleccionar al menos un producto.";
            formularioValido = false;
        } else {
            errorProductos.textContent = "";
        }

        // Validar cantidades
        if (!validarCantidades(productos)) {
            formularioValido = false;
        }

        if (!formularioValido) {
            return;
        }

        // Calcular montos finales
        const subtotal = calcularSubtotal(productos);
        const descuento = calcularDescuento(subtotal);
        const reparto = calcularReparto(modalidad.value);
        const total = calcularTotal(subtotal, descuento, reparto);

        // Crear objeto del pedido
        const pedido = {
            nombre: nombre.value.trim(),
            correo: correo.value.trim(),
            fecha: fecha.value,
            modalidad: modalidad.value,
            productos: productos,
            subtotal: subtotal,
            descuento: descuento,
            reparto: reparto,
            total: total
        };

        // Guardar el pedido en sessionStorage
        sessionStorage.setItem("pedido", JSON.stringify(pedido));

        // Ir a la página del resumen
        window.location.href = "resumen-pedido.html";
    });

    actualizarResumen();
});