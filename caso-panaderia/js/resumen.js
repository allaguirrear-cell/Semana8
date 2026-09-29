document.addEventListener("DOMContentLoaded", function () {

    const contenedor = document.getElementById("contenidoPedido");

    // Recuperar el pedido guardado
    const datosGuardados = sessionStorage.getItem("pedido");

    // Verificar si se abrió la página directamente
    if (datosGuardados === null) {
        contenedor.innerHTML = `
            <div class="alert alert-warning mb-0">
                <h2 class="h5">No hay información del pedido</h2>
                <p class="mb-0">
                    Primero debe completar el cotizador para visualizar un presupuesto.
                </p>
            </div>
        `;
        return;
    }

    const pedido = JSON.parse(datosGuardados);

    // Formatear montos en soles
    function moneda(monto) {
        return "S/ " + monto.toFixed(2);
    }

    // Mostrar modalidad en texto
    let modalidadTexto = "";

    if (pedido.modalidad === "reparto") {
        modalidadTexto = "Reparto a domicilio";
    } else {
        modalidadTexto = "Retiro en tienda";
    }

    // Generar filas de productos
    let filasProductos = "";

    for (let producto of pedido.productos) {
        filasProductos += `
            <tr>
                <td>${producto.nombre}</td>
                <td class="text-center">${producto.cantidad}</td>
                <td class="text-end">${moneda(producto.precio)}</td>
                <td class="text-end">${moneda(producto.precio * producto.cantidad)}</td>
            </tr>
        `;
    }

    // Mostrar fecha en formato local
    const partesFecha = pedido.fecha.split("-");
    const fechaMostrar = partesFecha[2] + "/" + partesFecha[1] + "/" + partesFecha[0];

    // Mostrar el resumen completo
    contenedor.innerHTML = `
        <div class="text-center mb-4">
            <div class="display-4">🥖</div>
            <h2 class="h4 titulo-seccion">Trigal de Lima</h2>
            <p class="text-muted mb-0">Presupuesto generado correctamente</p>
        </div>

        <div class="row g-3 mb-4">
            <div class="col-12 col-md-6">
                <h3 class="h6 titulo-seccion">Datos del cliente</h3>
                <p class="mb-1"><strong>Nombre:</strong> ${pedido.nombre}</p>
                <p class="mb-1"><strong>Correo:</strong> ${pedido.correo}</p>
            </div>

            <div class="col-12 col-md-6">
                <h3 class="h6 titulo-seccion">Datos de entrega</h3>
                <p class="mb-1"><strong>Fecha:</strong> ${fechaMostrar}</p>
                <p class="mb-1"><strong>Modalidad:</strong> ${modalidadTexto}</p>
            </div>
        </div>

        <h3 class="h5 titulo-seccion">Productos seleccionados</h3>

        <div class="table-responsive">
            <table class="table table-bordered table-striped align-middle">
                <thead class="table-light">
                    <tr>
                        <th>Producto</th>
                        <th class="text-center">Cantidad</th>
                        <th class="text-end">Precio unitario</th>
                        <th class="text-end">Importe</th>
                    </tr>
                </thead>
                <tbody>
                    ${filasProductos}
                </tbody>
            </table>
        </div>

        <div class="row justify-content-end">
            <div class="col-12 col-md-6 col-lg-5">
                <div class="border rounded p-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <strong>${moneda(pedido.subtotal)}</strong>
                    </div>

                    <div class="d-flex justify-content-between mb-2">
                        <span>Descuento:</span>
                        <strong>${moneda(pedido.descuento)}</strong>
                    </div>

                    <div class="d-flex justify-content-between mb-2">
                        <span>Reparto:</span>
                        <strong>${moneda(pedido.reparto)}</strong>
                    </div>

                    <hr>

                    <div class="d-flex justify-content-between">
                        <span class="fw-bold fs-5">Total:</span>
                        <strong class="fs-5 titulo-seccion">${moneda(pedido.total)}</strong>
                    </div>
                </div>
            </div>
        </div>

        <div class="alert alert-success mt-4 mb-0">
            Este documento es únicamente un presupuesto referencial.
            No representa una compra ni un pedido confirmado.
        </div>
    `;
});